<script lang="ts">
	import { ZodRef } from "#lib/refs/types";
	import { resolveClientRef } from "#lib/refs/client-ref";
	import { ZodHolding } from "#lib/types/financial";
	import { z } from "zod";
	import Price from "./Price.svelte";
	import moment from "moment";
	import { ArrowDown, ArrowUp, Cross2 } from "radix-svelte-icons";

	export let holding: z.infer<typeof ZodHolding>;

		console.log(holding);
		

	let request: Promise<z.infer<typeof ZodHolding._def.options[0]> | null> = Promise.resolve(holding as z.infer<typeof ZodHolding>);
	if ("$ref" in holding) {
		holding = ZodRef.parse(holding);

		request = resolveClientRef(holding)
	}
</script>

{#await request}
	
{:then holding} 
	{#if holding}
		{@const priceDifference = holding.currentPrice.amount - holding.purchasePrice.amount}
		{@const priceDifferencePercentage = (priceDifference / holding.purchasePrice.amount) * 100}
		<div class="border border-base-300 rounded-lg px-5 py-4">
			<div class="flex flex-col">
				<span class="text-base-content text-opacity-50 flex gap-2 items-center"><strong>{holding.name}</strong>
				{#if holding.currentPrice.currency === holding.purchasePrice.currency}
					{#if priceDifference > 0}
						<ArrowUp size={16}></ArrowUp>
					{:else if priceDifference < 0}
						<ArrowDown size={16}></ArrowDown>
					{/if}
					{priceDifferencePercentage.toFixed(2)}%
				{:else}
					<Cross2 size={16}></Cross2>
				{/if}
				</span>
				<span class="text-base-content text-opacity-50 text-sm">{moment(holding.purchaseDate).format("MMMM DD, YYYY")}</span>
			</div>
			<p class="mt-2 mb-0 text-sm">{holding.notes}</p>
		</div>
	{/if}
{/await}