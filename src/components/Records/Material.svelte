<script lang="ts">
	import { type MaterialWithRelations } from "prisma/generated";
	import { ZodRef } from "#lib/refs/types"
	import { z } from "zod";
	import { resolveClientRef } from "#lib/refs/client-ref"
	import type { HTMLAttributeAnchorTarget } from "svelte/elements";

	export let material: MaterialWithRelations | z.infer<typeof ZodRef>;
	export let showPrice: boolean = true;
	export let showWeight: boolean = true;
	export let showDescription: boolean = true;
	export let showManufacturer: boolean = true;
	export let target: HTMLAttributeAnchorTarget = "_blank";

	export let hrefType: "url" | "id" = "url";

	export let { class: className, rest } = $$restProps;

	let request: Promise<MaterialWithRelations | null> = material as unknown as Promise<MaterialWithRelations>;
	if ("$ref" in material) {
		material = ZodRef.parse(material);

		request = resolveClientRef(material) as Promise<MaterialWithRelations | null>;
	}
</script>

{#await request}
	<div class="flex flex-col bg-base-100 w-full h-32 border border-base-300 px-5 py-4 rounded-lg {className}" {...rest}>
		<span class="skeleton w-1/4 h-3"></span>
		<span class="skeleton w-2/3 h-5 my-2"></span>
		<span class="skeleton w-1/3 h-3"></span>

		{#if showDescription}
			<span class="skeleton w-1/2 h-3 mt-4"></span>
		{/if}
		{#if showWeight}
			<span class="skeleton w-1/3 h-3 mt-4"></span>
		{/if}
		{#if showPrice}
			<span class="skeleton w-1/3 h-3 mt-4"></span>
		{/if}
	</div>
{:then material} 
	{#if material}
		<a href={hrefType == "url" ? material.url : `/knowledge-base/materials/${material.uid}`} {target} class="no-underline rounded-lg border border-base-300 px-5 py-4 flex flex-col bg-base-200 hover:bg-base-300 hover:-translate-y-1 transition-all group {className} " {...rest} class:hoverable={material.url ?? false}>
			<span class="text-base-content text-opacity-50 text-xs">{material.type}</span>
			<span class="text-lg font-bold">{material.name}</span>
			{#if material.manufacturer && showManufacturer}
				<span class="text-base-content text-opacity-50 text-sm">{material.manufacturer ?? ""}</span>
			{/if}
			{#if showPrice && material.price}
				<span class="text-base-content text-opacity-50 text-sm">{material.price?.toFixed(2)} {material.currency}</span>
			{/if}
			{#if material.description && showDescription}
				<p class="text-sm my-2 text-base-content text-opacity-75">{material.description}</p>
			{/if}
			<span class="text-base-content text-sm font-bold group-hover:underline mt-auto pt-2">Visit Page</span>
		</a>
	{/if}
{/await}

<style>
	.hoverable:hover {
		@apply bg-base-200;
	}
</style>