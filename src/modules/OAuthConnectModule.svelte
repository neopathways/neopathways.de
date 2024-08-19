<script lang="ts">
	import type { Organization } from "prisma/generated"
	import { Scope } from "#types/oauth";
	import { api } from "astro-typesafe-api/client";
	import Cookies from "js-cookie";
	import OAuthScope from "#components/OAuth/OAuthScope.svelte";

	export let organization: Organization
	export let scopes: Scope[];
	export let redirectUrl: string;	
	// Whether the connection was already established before and only the scopes need to be updated.
	export let update: boolean;
	export let previousScopes: Scope[];
	export let alreadyConnected: boolean;
	let acceptedRisks = false
	let acceptedTerms = false

	async function connect(e: SubmitEvent) {
		e.preventDefault()

		const response = await api.oauth.code.GET.fetch({
			client_id: organization.uid,
			scopes,
			redirect_uri: redirectUrl
		}, {
			headers: {
				'Content-Type': 'application/json',
				"Authorization": "Bearer " + Cookies.get('accessToken')
			}
		});

		if (!response.code) {
			alert('An error occurred while connecting your account. Please try again later.')
			return;
		}

		const url = new URL(redirectUrl);
		url.searchParams.append('code', response.code);

		window.location.href = url.toString();
	}
</script>

<form class="lg:border lg:border-base-200 max-w-lg w-full rounded-lg flex flex-col gap-4 p-8 lg:p-16 prose prose-base max-h-[75vh] overflow-y-auto" on:submit={connect}>
	{#if alreadyConnected}
		<h1 class="my-0">
			Connected
		</h1>
		<p class="text-gray-500 my-0">
			Your account is already conneceted to <strong>{organization.name}</strong>. That means you have already given the same account access permissions to this organization that were requested this time.
		</p>
		<button class="btn btn-primary">Close this window</button>
	{:else}
		<h1 class="my-0">
			{#if update}
			Update
			{:else}
			Connect
			{/if}
		</h1>
		<p class="text-gray-500 my-0">
			{#if update}
			Update your permissions for <strong>{organization.name}</strong>
			{:else}
			Connect your Neopathways account to <strong>{organization.name}</strong>
			{/if}
		</p>
		<h2 class="my-0">Requested Permissions</h2>
		{#each scopes as scope}
			<OAuthScope {scope}></OAuthScope>
		{/each}

		{#if update}
			<hr class="my-4">
			<h2 class="my-0">Previous Permissions</h2>
			{#each previousScopes as scope}
				<OAuthScope {scope}></OAuthScope>
			{/each}
		{/if}

		<hr class="my-4">
		<div class="form-control">
			<label class="label cursor-pointer gap-4">
				<input type="checkbox" class="checkbox" bind:checked={acceptedRisks} />
				<span class="label-text" class:text-error={scopes.includes(Scope.FULL) || scopes.includes(Scope.DELETE)}>I understand the risks associated with granting these permissions.</span>
			</label>
		</div>
		<div class="form-control">
			<label class="label cursor-pointer gap-4">
				<input type="checkbox" class="checkbox" bind:checked={acceptedTerms} />
				<span class="label-text text-gray-500">I further agree to the <a href="/privacy-policy">privacy policy</a> and <a href="/terms-of-service">terms of service</a> of Neopathways and the processing of my data through a third party, namely <strong>{organization.name}</strong></span>
			</label>
		</div>
		<button class="btn btn-primary" disabled={!acceptedRisks || !acceptedTerms}>Connect</button>
	{/if}
</form>