<script lang="ts">
	import type { ZodMaterial } from "#lib/AccuracyClassification/medical/types";
	import type { z } from "zod";

	export let material: z.infer<typeof ZodMaterial>;
	export let showPrice: boolean = true;
	export let showWeight: boolean = true;
	export let showDescription: boolean = true;

	material.price = {
		amount: 10,
		currency: "USD",
		date: new Date(),
		tax: 0,
		taxIncluded: false,
		type: "CASH"
	}
</script>

<a class="flex flex-col bg-base-100 border border-base-300 rounded-lg px-5 py-4 no-underline transition-all h-min w-full" target="_blank" class:hoverable={material.url ?? false} href={material.url}>
	<span class="text-base-content font-semibold">{material.name} ({material.quantity})</span>
	<span class="text-base-content text-opacity-50 text-sm">{material.type}</span>
	{#if material.description && showDescription}
		<span class="text-base-content text-opacity-50 text-sm my-4">{material.description}</span>
	{/if}
	{#if material.weight && showWeight}
		<span class="text-base-content text-opacity-50 text-sm">Weight: {material.weight}</span>
	{/if}
	{#if showPrice && material.price}
		<span class="text-base-content text-opacity-50 text-sm">Price: {material.price.amount} {material.price.currency}</span>
	{/if}
</a>

<style>
	.hoverable:hover {
		@apply bg-base-200;
	}
</style>