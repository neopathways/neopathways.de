<script lang="ts">
	import type { TransactionWithRelations } from "prisma/generated";
	import moment from "moment";

	export let transaction: TransactionWithRelations;
	export let compact: boolean = false;
	export let vertical: boolean = false;

	let payableAmount = 0;

	if (transaction.taxIncluded) {
		payableAmount = transaction.amount;
	} else {
		payableAmount = transaction.amount + transaction.amount * ((transaction.tax || 0) / 100);
	}
</script>

{#if compact}
	<div class="rounded-lg border border-base-300">
		<div class="flex gap-4 p-4 justify-between" class:flex-row={!vertical} class:flex-col={vertical}>
			<div class="flex flex-col">
				<span class="text-base-content text-opacity-50">Amount</span>
				<strong>{transaction.amount.toFixed(2)} {transaction.currency}</strong>
			</div>
			<div class="flex flex-col">
				<span class="text-base-content text-opacity-50">Type</span>
				<strong>{transaction.type ?? "N/A"}</strong>
			</div>
			<div class="flex flex-col">
				<span class="text-base-content text-opacity-50">Date</span>
				<strong>{moment(transaction.date).format("MM.DD.YYYY")}</strong>
			</div>
			<div class="flex flex-col">
				<span class="text-base-content text-opacity-50">Tax</span>
				<strong>{transaction.tax || 0}%</strong>
			</div>
			<div class="flex flex-col">
				<span class="text-base-content text-opacity-50">Payable</span>
				<strong>{payableAmount.toFixed(2)} {transaction.currency}</strong>
			</div>
		</div>
	</div>
{:else}
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
{/if}