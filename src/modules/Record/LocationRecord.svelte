<script lang="ts">
	import WorldMap from "#components/WorldMap.svelte";
	import { DrawingPinFilled } from "radix-svelte-icons";
	import z from "zod";
	import { ZodLocationValidator } from "#lib/AccuracyClassification/location";
	import moment from "moment";
	import SimilarRecords from "./SimilarRecords.svelte";
	import type { Organization, User, UserRecord } from "@prisma/client";


	export let record: UserRecord & {
		user: User,
		organization: Organization,
		data: z.infer<typeof ZodLocationValidator>;
	};

	export let similar: (UserRecord & {
		data: z.infer<typeof ZodLocationValidator>;
		user: User,
		organization: Organization
	})[];


</script>

<div class="grid grid-cols-[1fr,1fr] gap-8">
	<div class="w-full">
		<div class="border border-base-300 rounded-lg">
			{#if record.data?.latitude && record.data?.longitude}
				<WorldMap
					lat={record.data.latitude}
					lng={record.data.longitude}
					width={800}
				></WorldMap>
			{/if}
		</div>
		<h2 class="flex flex-row gap-4 items-center"><DrawingPinFilled size={24}></DrawingPinFilled> Location Record</h2>
		<p>Location records are usually collected through the geolocation API in browsers.</p>
		<slot name="faq"></slot>
	</div>

	<div>
		<h3 class="mt-0">Provided Data</h3>
		<table class="table bg-base-200">
			<thead class="bg-base-100">
				<tr class="border-b border-b-base-300">
					<th class="rounded-tl-lg">Property</th>
					<th class="rounded-tr-lg">Value</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Latitude</td>
					<td><strong>{record.data?.latitude}</strong></td>
				</tr>
				<tr>
					<td>Longitude</td>
					<td><strong>{record.data?.longitude}</strong></td>
				</tr>
				<tr>
					<td>Accuracy</td>
					<td>{record.data?.accuracy}</td>
				</tr>
				<tr>
					<td>Altitude</td>
					<td>{record.data?.altitude}</td>
				</tr>
				<tr>
					<td>Altitude Accuracy</td>
					<td>{record.data?.altitudeAccuracy}</td>
				</tr>
				<tr>
					<td>Heading</td>
					<td>{record.data?.heading}</td>
				</tr>
				<tr>
					<td>Speed</td>
					<td>{record.data?.speed}</td>
				</tr>
				<tr>
					<td>Validation Accuracy</td>
					<td><strong>{Math.round(record.accuracy * 100)}%</strong></td>
				</tr>
				<tr>
					<td>Created</td>
					<td>{moment(record.created).format("MMMM DD, YYYY HH:mm")}</td>
				</tr>
			</tbody>
		</table>
		<h3>Similar Records</h3>
		<slot name="similar"></slot>
	</div>
</div>

<style>
	td {
		@apply px-4 text-base;
	}
</style>
