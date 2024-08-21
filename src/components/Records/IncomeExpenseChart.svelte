<script lang="ts">
	export let data: { income: number, expense: number }[];
	export let width: number = 500;
	export let height: number = 500;
	export let incomeColor: string = "green";
	export let expenseColor: string = "red";

	const incomeMax = Math.max(...data.map(d => d.income));
	const expenseMax = Math.max(...data.map(d => d.expense));

	export let margin = 12;
	export let padding = 16;
	const individualWidth = (width / data.length / 2) - margin;
	const individualHeight = height / Math.max(incomeMax, expenseMax);

	export let borderRadius = individualWidth / 3;
	
</script>

<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 {width} {height}" fill="none" {...$$restProps}>
	<style>
		.text {
			font: bold 10px sans-serif;
			fill: white;
		}
	</style>
	{#each data as dataset, i}
		{@const incomeHeight = Math.max(10, dataset.income * individualHeight)}
		{@const expenseHeight = Math.max(10, dataset.expense * individualHeight)}
		<rect rx={borderRadius} x={2 * i * (individualWidth + margin) + padding} y={height - incomeHeight + padding} width={individualWidth} height={incomeHeight - padding * 2} fill={incomeColor}></rect>
		<rect rx={borderRadius} x={2 * i * (individualWidth + margin) + individualWidth + margin + padding} y={height - expenseHeight + padding} width={individualWidth} height={expenseHeight - padding * 2} fill={expenseColor}></rect>
	{/each}
</svg>