<script lang="ts">
	import moment from "moment";
	import type { Organization, User, UserRecord } from "@prisma/client";
	import ArrowRight from "radix-svelte-icons/src/lib/icons/ArrowRight.svelte";

	export let similar: (UserRecord & {
		data: any,
		user: User,
		organization: Organization
	})[]
</script>

<div class="flex flex-col gap-4">
	{#each similar as record}
	<a class="flex flex-row gap-8 group justify-between items-center border border-base-300 bg-base-200 rounded-lg p-4 not-prose hover:bg-base-300 transition" href="/profile/records/{record.uid}">
		<div class="flex flex-col">
			<h4 class="text-lg font-bold my-0 text-base-content capitalize"><span class="text-base-content text-opacity-50 mr-2">{Math.round(record.accuracy * 100)}%</span> {record.category.toLowerCase()}</h4>
			<span class="text-sm">collected {moment(record.created).fromNow()} by <strong>{record.organization.name}</strong></span>
		</div>
		<div class="group-hover:animated">
			<ArrowRight size={24}></ArrowRight>
		</div>
	</a>
{/each}
</div>

<style>
	@keyframes indicate {
		0% {
			transform: translateX(-2px);
		}
		50% {
			transform: translateX(2px);
		}
		100% {
			transform: translateX(-2px);
		}
	}
	@tailwind utilities;
	@layer utilities {
		.animated {
			animation: indicate 1s infinite;
		}
	}
</style>