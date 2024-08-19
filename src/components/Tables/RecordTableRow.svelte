<script lang="ts">
	import moment from "moment";
	import type { Organization, UserRecord } from "prisma/generated";
	import { Download, FileText, Trash } from "radix-svelte-icons";
	import DrawingPin from "radix-svelte-icons/src/lib/icons/DrawingPin.svelte";

	export let record: UserRecord & {
		organization: Organization
	};
</script>

<tr>
	<td>
		<div class="flex items-center gap-2">
			{#if record.category === "LOCATION"}
				<DrawingPin size={20}></DrawingPin>
			{:else}
				<FileText size={20}></FileText>
			{/if}
			<span class="capitalize">{record.category.toLowerCase()}</span>
		</div>
	</td>
	<td>
		<a href="/profile/records/{record.uid}" class="link">{record.uid}</a>
	</td>
	<td>
		<div class="flex flex-wrap gap-2">
			{#each record.tags as tag}
				<span class="badge badge-primary capitalize">{tag.toLowerCase()}</span>
			{/each}
		</div>
	</td>
	<td>
		<a href="/organization/{record.organization.uid}" class="link">{record.organization.name}</a>
	</td>
	<td>
		<strong>{Math.round(record.accuracy * 100)}%</strong>
	</td>
	<td>
		{moment().format('MMMM Do YYYY, h:mm a')}
	</td>
	<td class="flex flex-row gap-2">
		<a class="btn btn-square btn-ghost" href="/profile/records/{record.uid}.json" target="_blank"><Download size={18}></Download></a>
		<button class="btn btn-square btn-ghost"><Trash size={18}></Trash></button>
	</td>
</tr>