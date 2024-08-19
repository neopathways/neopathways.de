<script lang="ts">
	export let pages: number = 1;
	export let currentPage: number = 1;
</script>

<div class="join">
	{#each Array.from({ length: pages }, (_, i) => i) as page}
		<button class="join-item btn" class:btn-active={currentPage === page} on:click={() => currentPage = page}>{page + 1}</button>
	{/each}
</div>