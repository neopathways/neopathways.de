<script lang="ts">
	import type { ZodTransactionAmount } from "#lib/AccuracyClassification/medical/types";
	import moment from "moment";
	import type { z } from "zod";

	export let transaction: z.infer<typeof ZodTransactionAmount>;

	let payableAmount = 0;

	if (transaction.taxIncluded) {
		payableAmount = transaction.amount;
	} else {
		payableAmount = transaction.amount + transaction.amount * ((transaction.tax || 0) / 100);
	}
</script>

<table class="table">
	<thead class="bg-base-100">
		<tr class="border-b border-b-base-300">
			<th class="rounded-tl-lg">Amount</th>
			<th>Currency</th>
			<th>Type</th>
			<th>Date</th>
			<th class="rounded-tr-lg">Tax</th>
		</tr>
	</thead>
	<tbody class="text-center">
		<tr >
			<td><strong>{transaction.amount.toFixed(2)}</strong></td>
			<td>{transaction.currency ?? "N/A"}</td>
			<td>{transaction.type ?? "N/A"}</td>
			{#if transaction.date}
			<td>{moment(transaction.date).format("MMMM DD, YYYY h:mm a")}</td>
			{:else}
			<td>N/A</td>
			{/if}
			<td>{transaction.tax || 0}%</td>
		</tr>
		<tr>
			<td></td>
			<td></td>
			<td></td>
			<td></td>
			<td><strong>{payableAmount.toFixed(2)} {transaction.currency}</strong></td>
		</tr>
	</tbody>
</table>