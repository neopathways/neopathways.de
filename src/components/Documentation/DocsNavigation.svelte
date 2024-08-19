<script lang="ts">
	import type { CollectionEntry} from "astro:content"

	export let collection: CollectionEntry<"docs">[];
	export let pathname: string;
</script>

<nav>
	<ul>
		{#each collection as entry}
			<li style="padding-left: {(entry.slug.split("/").length - 1) * 0.75}rem;" class="my-2 link link-hover no-underline text-base text-base-content text-opacity-60 font-medium"
			class:text-opacity-90={pathname === `/docs/${entry.slug}`}>
				<a href="/docs/{entry.slug}">{entry.data.title}</a>
			</li>
		{/each}
	</ul>
</nav>