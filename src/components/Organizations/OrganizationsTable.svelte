<script lang="ts">
	import type { Organization } from "prisma/generated";
	import OrganizationTableRow from "./OrganizationTableRow.svelte";

	export let organizations: (Organization & { _count: {
		oAuthConnections: number,
		oAuthRefreshTokens: number,
		ProvidedRecords: number,
		members: number,
		Uploads: number
	}})[];
</script>

<table class="table bg-base-200">
	<thead class="bg-base-100">
		<tr class="border-b border-b-base-300">
			<th class="rounded-tl-lg">Name</th>
			<th>Created</th>
			<th>Connections</th>
			<th>Client ID</th>
			<th class="rounded-tr-lg">Operations</th>
		</tr>
	</thead>
	<tbody>
		{#each organizations as organization}
			<OrganizationTableRow {organization}></OrganizationTableRow>
		{/each}
	</tbody>
</table>