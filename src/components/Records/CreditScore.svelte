<script lang="ts">
	import { ZodCreditScore } from "#lib/types/financial";
	import type { z } from "zod";

	export let score: z.infer<typeof ZodCreditScore>;
	export let width: number = 200;
	export let height: number = 200;
</script>

<svg
	{width}
	{height}
	{...$$restProps}
	viewBox="0 0 500 500"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		xmlns="http://www.w3.org/2000/svg"
		d="M414 207C414 152.1 392.191 99.4489 353.371 60.6289C314.551 21.8089 261.9 4.14482e-06 207 0C152.1 -4.14482e-06 99.4489 21.8089 60.6289 60.6289C21.8089 99.4489 8.28964e-06 152.1 0 207L124.2 207C124.2 185.04 132.924 163.98 148.452 148.452C163.98 132.924 185.04 124.2 207 124.2C228.96 124.2 250.02 132.924 265.548 148.452C281.076 163.98 289.8 185.04 289.8 207H414Z"
		fill="var(--primary)"
	/>
</svg>
