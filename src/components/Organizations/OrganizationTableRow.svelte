<script lang="ts">
	import moment from "moment"
	import { Camera, Pencil1, Trash } from "radix-svelte-icons"
	import type { Organization } from "prisma/generated";
	import { api } from "astro-typesafe-api/client"
	import Cookies from "js-cookie";

	export let organization: (Organization & { _count: {
		oAuthConnections: number,
		oAuthRefreshTokens: number,
		ProvidedRecords: number,
		members: number,
		Uploads: number
	}});

	let name = organization.name
	let description = organization.description
	let redirecturl = organization.redirecturl

	async function save() {
		const response = await api.organization.POST.fetch({
			description,
			name,
			redirecturl,
			uid: organization.uid
		}, {
			headers: {
				Authorization: `Bearer ${Cookies.get("accessToken")}`
			}
		})

		organization.name = name
		organization.description = description
		organization.redirecturl = redirecturl
		organization = organization
	}

	async function deleteOrganization() {
		if (confirmDeleteValue !== organization.name) {
			alert("The organization name does not match. Please type the organization name to confirm deletion.")
			return
		}

		const response = await api.organization.DELETE.fetch({
			uid: organization.uid
		}, {
			headers: {
				Authorization: `Bearer ${Cookies.get("accessToken")}`
			}
		})

		element.parentNode?.removeChild(element)
	}

	let deleteModal: HTMLDialogElement;
	let editModal: HTMLDialogElement;
	let element: HTMLTableRowElement;

	let confirmDeleteValue: string;
</script>

<tr bind:this={element}>
	<td>
		<a class="link" href="/profile/organizations/{organization.uid}">{organization.name}</a>
	</td>
	<td>
		{moment(organization.created).format("MMMM Do YYYY")}
	</td>
	<td>
		{organization._count.oAuthConnections}
	</td>
	<td>
		{organization.uid}
	</td>
	<td class="flex flex-row gap-2">
		<!-- Delete Modal -->
		<dialog bind:this={deleteModal} class="modal">
			<div class="modal-box">
				<h3 class="text-lg font-bold">Delete</h3>
				<p class="py-4">Are you sure you want to revoke this session? This will log you out of all devices connected to this session. Please be aware that the logout times can be up to 30 minutes.</p>
				<label class="form-control w-full">
					<div class="label">
						<span class="label-text text-gray-400">Write the organization name to confirm deletion</span>
					</div>
					<input type="text" placeholder={organization.name} class="input input-bordered w-full" bind:value={confirmDeleteValue} />
				</label>
				<div class="modal-action">
					<form method="dialog" class="flex gap-2">
						<button class="btn btn-error" on:click={deleteOrganization} disabled={confirmDeleteValue !== organization.name}>Yes I'm sure, delete!</button>
						<button class="btn">No, cancel that.</button>
					</form>
				</div>
			</div>
		</dialog>

		<!-- Edit Modal -->
		<dialog bind:this={editModal} class="modal">
			<div class="modal-box">
				<h3 class="text-lg font-bold">Edit</h3>
				<div class="flex flex-col items-center gap-4">
					<div class="avatar">
						<div class="w-48 rounded-full group">
							<img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
							<div class="invisible group-hover:visible absolute top-0 left-0 rounded-full bg-[rgba(0,0,0,0.6)] flex items-center justify-center w-full h-full cursor-pointer">
								<Camera size={32}></Camera>
							</div>
						</div>
					</div>
					<label class="form-control w-full">
						<div class="label">
							<span class="label-text text-gray-400">Name</span>
						</div>
						<input type="text" placeholder="Bob's and Uncles" class="input input-bordered w-full" bind:value={name} />
					</label>
					<label class="form-control w-full">
						<div class="label">
							<span class="label-text text-gray-400">Description</span>
						</div>
						<textarea placeholder="Some description" class="textarea textarea-bordered w-full" bind:value={description}></textarea>
					</label>
					<label class="form-control w-full">
						<div class="label">
							<span class="label-text text-gray-400">Redirect URI</span>
						</div>
						<input type="text" placeholder="Bob's and Uncles" class="input input-bordered w-full" bind:value={redirecturl} />
					</label>
				</div>
				<div class="modal-action">
					<form method="dialog" class="flex gap-2">
						<button class="btn btn-success" on:click={save}>Save!</button>
						<button class="btn">No, cancel that.</button>
					</form>
				</div>
			</div>
		</dialog>
		<div class="tooltip" data-tip="Edit">
			<button class="btn btn-square btn-ghost" on:click={() => editModal.showModal()}><Pencil1 size={18}></Pencil1></button>
		</div>
		<div class="tooltip" data-tip="Revoke Access">
			<button class="btn btn-square btn-error" on:click={() => deleteModal.showModal()}><Trash size={18}></Trash></button>
		</div>
	</td>
</tr>