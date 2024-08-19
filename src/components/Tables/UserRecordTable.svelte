<script lang="ts">
	import { api } from "astro-typesafe-api/client"
	import RecordTableRow from "./RecordTableRow.svelte";
	import Cookies from "js-cookie";
	import Pagination from "#components/Pagination.svelte";

	let currentPage: number = 0;
	let take: number = 5;

	$: request = api.record.GET.fetch({
			skip: currentPage * take,
			take
		}, {
			headers: {
				"Authorization": `Bearer ${Cookies.get("accessToken")}`
			}
		})
</script>

<div class="not-prose flex flex-col gap-4">
	<div class="border border-base-300 rounded-lg">
		<table class="table bg-base-200">
			<thead class="bg-base-100">
				<tr class="border-b border-b-base-300">
					<th class="rounded-tl-lg">Record Type</th>
					<th>ID</th>
					<th>Tags</th>
					<th>Organization</th>
					<th>Calculated Accuracy</th>
					<th>Created</th>
					<th class="rounded-tr-lg">Operations</th>
				</tr>
			</thead>
			<tbody>
				{#await request}
					<tr>
						<td colspan="7" class="text-center">Loading...</td>
					</tr>
				{:then data}
					{#each data.records as record}
						<RecordTableRow {record}></RecordTableRow>
					{/each}
				{/await}
			</tbody>
		</table>
	</div>
	
	
	<!-- svelte-ignore empty-block -->
	{#await request}
		
	{:then data}
	<div class="flex flex-row gap-4">
		<Pagination pages={data.count / take} bind:currentPage={currentPage}></Pagination>
		<select bind:value={take} class="select select-bordered w-min">
			<option value={5}>5</option>
			<option value={10}>10</option>
			<option value={25}>25</option>
			<option value={50}>50</option>
			<option value={100}>100</option>
		</select>
	</div>
	{/await}
</div>