<script lang="ts">
	import type { MarkdownHeading } from "astro";

	export let headings: MarkdownHeading[];

	function scroll() {
		const scrollY = window.scrollY;
		for (const heading of headings) {
			const element = document.getElementById(heading.slug);
			
			if (!element) {
				continue;
			}

			// Highlight the heading if it's at the top of the screen
			if (element.getBoundingClientRect().top < 175) {
				highlightedHeading = heading.slug;
			}
		}
	}

	let highlightedHeading: string = "";
</script>

<svelte:window on:scroll={scroll}></svelte:window>

{#each headings as heading}
	<a
		href={`#${heading.slug}`}
		class="border-b border-b-base-200 my-2.5 link link-hover no-underline text-base text-base-content text-opacity-60 font-medium border-l-base-content"
		class:text-opacity-90={highlightedHeading === heading.slug}
		class:border-l-4={highlightedHeading === heading.slug}
		class:pl-2={highlightedHeading === heading.slug}
		>{heading.text}</a
	>
{/each}
