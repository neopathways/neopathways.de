<script lang="ts">
	import { api } from "astro-typesafe-api/client";
	import Cookies from "js-cookie";
	import { Camera, Plus } from "radix-svelte-icons";

	let name: string;
	let description: string;
	let redirecturl: string;
	let createModal: HTMLDialogElement;

	async function create() {
		const { uid } = await api.organization.PUT.fetch({
			description,
			name,
			redirecturl
		}, {
			headers: {
				Authorization: `Bearer ` + Cookies.get("accessToken")
			}
		})
	}
</script>

<dialog bind:this={createModal} class="modal not-prose">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Create</h3>
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
				<button class="btn btn-success" on:click={create}>Create!</button>
				<button class="btn">No, cancel that.</button>
			</form>
		</div>
	</div>
</dialog>
<div class="tooltip" data-tip="Create a new organization">
	<button class="btn btn-square btn-ghost" on:click={() => createModal.showModal()}>
		<Plus size={24}></Plus>
	</button>
</div>