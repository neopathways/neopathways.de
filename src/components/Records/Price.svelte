<script lang="ts">
	import { ZodTransactionAmount } from "#lib/types/financial";
	import { z } from "zod";

	export let price: z.infer<typeof ZodTransactionAmount>
</script>

<span class="text-base-content text-opacity-50"><strong>{price.amount.toFixed(2)}</strong> {price.currency}</span>