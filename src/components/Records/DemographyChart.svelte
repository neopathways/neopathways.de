<script lang="ts">
	// The demographic ditribution in percentage points of a specific age bracket
	export let demographyDistribution: { male: number, female: number, mark?: "female" | "male", label: string }[];
	export let width: number;
	export let height: number;
	export let maxInnerWidth: number = width / 2;

	let individualHeight = height / demographyDistribution.length - 2;

	const males = demographyDistribution.map(d => d.male)
	const females = demographyDistribution.map(d => d.female);

	let highestMale = Math.max(...males);
	let highestFemale = Math.max(...females);

	let lowestMale = Math.min(...males);
	let lowestFemale = Math.min(...females);

	const normalize = (value: number, lowest: number, highest: number) => {
		return Math.max(0.1, (value - lowest) / (highest - lowest));
	}

	const reversed = demographyDistribution.slice().reverse();

</script>

<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 500 500" fill="none" {...$$restProps}>
	<style>
		.text {
			font: bold 12px sans-serif;
			text-anchor: middle;
		}
	</style>
	{#each reversed as bracket, i}
		{@const maleWidth = normalize(bracket.male, lowestMale, highestMale) * maxInnerWidth}
		{@const femaleWidth = normalize(bracket.female, lowestFemale, highestFemale) * maxInnerWidth}
		<!-- Male -->
		<rect rx={12} x={width / 2 - maleWidth - 20} y={i * individualHeight + i * 2} width={maleWidth} height={individualHeight} class="fill-base-300" class:fill-blue-200={bracket.mark === "male"}></rect>
		{#if bracket.label}
			<text x={width / 2} y={i * individualHeight + i * 2 + individualHeight / 2 + 4} class="text fill-base-content">{bracket.label}</text>
		{/if}
		<!-- Female -->
		<rect rx={12} x={width / 2 + 20} y={i * individualHeight + i * 2} width={femaleWidth} height={individualHeight} class="fill-base-300" class:fill-pink-200={bracket.mark === "female"}></rect>
	{/each}
</svg>