<script lang="ts">
	import { DiscordLogo, GithubLogo } from "radix-svelte-icons";
	import ReactiveSvg from "./ReactiveSVG.svelte";
</script>

<footer class="footer bg-base-100 border-t border-t-base-200 items-center p-4">
	<div class="max-w-screen-xl w-full mx-auto flex flex-col lg:flex-row justify-between items-center">
			<div class="flex flex-col lg:flex-row items-center">
				<a class="link" href="/">
					<ReactiveSvg src="/logo-long.svg" class="h-14 w-48"
					></ReactiveSvg>
				</a>
				<p class="text-gray-400">
					Copyright © {new Date().getFullYear()} - All rights reserved
				</p>
			</div>
			<div class="flex flex-row items-center gap-8">
				<a href="https://github.com/neopathways" target="_blank">
					<GithubLogo size={24}></GithubLogo>
				</a>
				<a href="https://github.com/neopathways" target="_blank">
					<DiscordLogo size={24}></DiscordLogo>
				</a>
			</div>
	</div>
</footer>
