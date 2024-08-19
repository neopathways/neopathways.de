<script lang="ts">
	import LocationRecord from "./LocationRecord.svelte";
	import type { Organization, User, UserRecord } from "@prisma/client";
	import DemographicRecord from "./DemographicRecord.svelte";
	import SimilarRecords from "./SimilarRecords.svelte";
	import moment from "moment";
	import { api } from "astro-typesafe-api/client"
import { UserRecordSchema } from "prisma/generated";
	import Cookies from "js-cookie";

	
	export let record: UserRecord & { user: User, organization: Organization, data: any };
	export let similar: (UserRecord & { user: User, organization: Organization, data: any })[];

	let Element: typeof LocationRecord | typeof DemographicRecord | null = null;

	if (record.category === "LOCATION") {
		Element = LocationRecord;
	} else if (record.category === "DEMOGRAPHIC") {
		Element = DemographicRecord;
	}

const categories = Object.values(UserRecordSchema.shape.category.enum);

let result: Awaited<ReturnType<typeof api.record.GET.fetch>> | null = null;

async function search() {
	result = await api.record.GET.fetch({
		category: searchCategory,
		orguid: record.organization.uid,
		take: 5,
	}, {
		headers: {
			"Authorization": `Bearer ${Cookies.get("accessToken")}`
		}
	})

	dropdownOpen = true;
}

function keydown(e: KeyboardEvent) {
	if (e.key === "Enter") {
		search();
	}
}

let searchTerm: string = "";
let searchCategory: UserRecord["category"] = record.category
let dropdownOpen: boolean = false;
</script>

<div class="flex flex-row justify-between">
	<div class="flex flex-col">
		<h1 class="mb-0">Record <span class="text-base-content text-opacity-50">{record.uid}</span></h1>
		<span class="text-base-content text-opacity-50 block mb-8">{moment(record.created).format("MMMM DD, YYYY HH:mm")} by <a href={`/organization/${record.organization.uid}`} target="_blank">{record.organization.name}</a></span>
	</div>
	<div class="flex flex-row gap-4">
		<select class="select select-bordered capitalize" bind:value={searchCategory}>
			{#each categories as category}
			<option value={category} selected={category === record.category}>{category.replace(/_/g, " ").toLowerCase()}</option>
			{/each}
		</select>
		<input type="text" placeholder="Search..." class="input input-bordered" bind:value={searchTerm} on:keydown={keydown}>
		<div class="dropdown dropdown-left top-16 right-4" class:dropdown-open={dropdownOpen}>
			<div class="dropdown-content menu bg-base-100 rounded-lg z-[1] w-[576px] p-4 border border-base-300 ">
				{#if result}
				<SimilarRecords similar={result.records}></SimilarRecords>
				{/if}
			</div>
		</div>
	</div>
</div>
<div class="prose prose-xl max-w-full">
	{#if Element}
	<Element {record} {similar}>
		<SimilarRecords {similar} slot="similar"></SimilarRecords>
		<div slot="faq">
			<h3>How is the validation accuracy calculated?</h3>
			<p>Validation accuracy is a key attribute of our datasets. It estimates the accuracy of a specific record by considering all previously submitted records and their corresponding accuracy. This estimate also factors in the specificity of the data provided and the historical accuracy of the data provider.</p>
			<p>If you notice any errors in the collected data, you can manually edit or delete specific records.</p>
		</div>
	</Element>
	{/if}
</div>