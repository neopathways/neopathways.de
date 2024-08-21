<script lang="ts">
	import type { User } from "@prisma/client";
	import Header from "./Header.svelte";

	export let paths: {
		name: string;
		href: string;
	}[] = [];
	export let light: boolean;
	export let user: User | null;
</script>

<Header {light} {user}>
	<div class="w-full left-0 h-[50px] bg-base-100 border-b border-b-base-200">
		<div class="max-w-screen-xl mx-auto flex flex-row items-center h-full justify-between px-4 lg:px-8">
			<div class="breadcrumbs text-sm">
				<ul>
					{#each [{name: "Home", href: "/docs"}, ...paths] as segment, i}
						<li><a class:text-opacity-60={i !== paths.length} class:text-opacity-90={i === paths.length} class="capitalize text-base-content" href={segment.href}>{segment.name}</a></li>
					{/each}
				</ul>
			</div>
			<input type="text" class="input input-bordered input-sm" placeholder="Search...">
		</div>
	</div>
</Header>
<div class="h-[50px]"></div>