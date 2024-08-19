<script lang="ts">
	import { Scope } from "#types/oauth";
	import {
		Cube,
		Reader,
		FilePlus,
		FileMinus,
		DrawingPin,
	} from "radix-svelte-icons";

	export let scope: Scope;
</script>

{#if scope === Scope.FULL}
	<div class="flex flex-row gap-4">
		<Cube size={24}></Cube>
		<div class="flex flex-col gap-1">
			<h4 class="my-0">Full Access</h4>
			<p class="text-gray-500 leading-6 my-0">
				You are granting full access to your Neopathways account.
			</p>
		</div>
	</div>
{:else if scope === Scope.READ}
	<div class="flex flex-row gap-4">
		<Reader size={24}></Reader>
		<div class="flex flex-col gap-1">
			<h4 class="my-0">Read Access</h4>
			<p class="text-gray-500 leading-6 my-0">
				You are granting read access to your Neopathways account.
			</p>
		</div>
	</div>
{:else if scope === Scope.WRITE}
	<div class="flex flex-row gap-4">
		<FilePlus size={24}></FilePlus>
		<div class="flex flex-col gap-1">
			<h4 class="my-0">Write Access</h4>
			<p class="text-gray-500 leading-6 my-0">
				You are granting write access to your Neopathways account.
			</p>
		</div>
	</div>
{:else if scope === Scope.DELETE}
	<div class="flex flex-row gap-4">
		<FileMinus size={24}></FileMinus>
		<div class="flex flex-col gap-1">
			<h4 class="my-0">Delete Permissions</h4>
			<p class="text-gray-500 leading-6 my-0">
				You are granting delete access to your Neopathways account. <br
				/> This applies only to data stored in your account, not your account
				itself.
			</p>
		</div>
	</div>
{:else if scope.startsWith("location:")}
	<div class="flex flex-row gap-4">
		<DrawingPin size={24}></DrawingPin>
		<div class="flex flex-col gap-1">
			<h4 class="my-0">Location Access</h4>
			<p class="text-gray-500 leading-6 my-0">
				You are granting
				{#if scope === Scope.LOCATION_READ}
					read access to your location.
				{:else if scope === Scope.LOCATION_WRITE}
					write access to your location.
				{:else if scope === Scope.LOCATION_FULL}
					full access to your location data
				{:else if scope === Scope.LOCATION_DELETE}
					delete permissions for your location data
				{/if}
			</p>
		</div>
	</div>
{/if}
