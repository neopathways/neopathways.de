<script lang="ts">
	import ThemeController from "./ThemeController.svelte";
	import { lightMode } from "#lib/shared";
	import ReactiveSvg from "./ReactiveSVG.svelte";

	export let light: boolean;
	lightMode.set(light);
</script>

<div
	class="navbar bg-base-100 px-8 fixed top-0 z-50 transition-all"
>
	<div class="mx-auto max-w-screen-xl w-full relative justify-between">
		<a class="link" href="/">
			<ReactiveSvg src="/logo-long.svg" class="h-14 w-48"></ReactiveSvg>
		</a>
		<ThemeController></ThemeController>
	</div>
</div>
