<script lang="ts">
	import type { RefreshToken } from "prisma/generated"
	import moment from "moment"
	import { Reload, Trash } from "radix-svelte-icons";
	import { api } from "astro-typesafe-api/client";

	export let refreshTokens: RefreshToken[];
	export let clientAddress: string;

	async function revokeRefreshToken(token: RefreshToken) {
		const response = await api.auth.refreshtoken.DELETE.fetch({
			uid: token.uid
		}, {
			headers: {
				Authorization: `Bearer ${token.token}`
			}
		})

		refreshTokens = refreshTokens.filter(t => t.uid !== token.uid)
	}

	function showModal(id: string) {
		(document.getElementById(id) as HTMLDialogElement)?.showModal()
	}
</script>

<table class="table bg-base-200">
	<!-- head -->
	<thead class="bg-base-100">
		<tr class="border-b border-b-base-300">
			<th class="rounded-tl-lg">Location</th>
			<th>Date and Time</th>
			<th>Expiration Date</th>
			<th>User Agent</th>
			<th class="rounded-tr-lg">Operations</th>
		</tr>
	</thead>
	<tbody>
		{#each refreshTokens as token, i}
			<tr>
				<td>
					<span>{token.ip}</span>
					{#if token.ip === clientAddress}
						<span class="badge badge-success">This Device</span>
					{/if}
				</td>
				<td>
					{moment(token.created).fromNow()}
				</td>
				<td>
					{moment(token.validUntil).format('MMMM Do YYYY, h:mm a')}
				</td>
				<td>
					{token.agent}
				</td>
				<td class="flex flex-row gap-2">
					<dialog id="deleteModal_{i}" class="modal">
						<div class="modal-box">
							<h3 class="text-lg font-bold">Delete</h3>
							<p class="py-4">Are you sure you want to revoke this session? This will log you out of all devices connected to this session. Please be aware that the logout times can be up to 30 minutes.</p>
							<div class="modal-action">
								<form method="dialog" class="flex gap-2">
									<button class="btn btn-error" on:click={() => revokeRefreshToken(token)}>Yes I'm sure, delete!</button>
									<button class="btn">No, cancel that.</button>
								</form>
							</div>
						</div>
					</dialog>
					<div class="tooltip" data-tip="Extend 30 days">
						<button class="btn btn-square btn-ghost"><Reload size={18}></Reload></button>
					</div>
					<div class="tooltip" data-tip="Revoke Access">
						<button class="btn btn-square btn-error" on:click={() => showModal(`deleteModal_${i}`)}><Trash size={18}></Trash></button>
					</div>
				</td>
			</tr>
		{/each}
	</tbody>
	<!-- foot -->
</table>