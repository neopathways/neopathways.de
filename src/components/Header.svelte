<script lang="ts">
	import {
		CaretDown,
		ExternalLink,
		Person,
	} from "radix-svelte-icons";
	import ThemeController from "./ThemeController.svelte";
	import { lightMode } from "#lib/shared";
	import ReactiveSvg from "./ReactiveSVG.svelte";
	import type { User } from "@prisma/client"

	export let light: boolean;
	export let user: User | null;

	let lastScrollYWhenScrollTop = 0;
	let lastScrollY = 0;
	function scroll(e: UIEvent & { currentTarget: EventTarget & Window }) {
		if (e.currentTarget.scrollY < lastScrollY) {
			lastScrollYWhenScrollTop = e.currentTarget.scrollY;
		}

		if (
			e.currentTarget.scrollY >
			lastScrollYWhenScrollTop + window.innerHeight / 2
		) {
			invisible = true;
		} else {
			invisible = false;
		}

		lastScrollY = e.currentTarget.scrollY;
	}

	let invisible: boolean;

	lightMode.set(light);
</script>

<svelte:window on:scroll={scroll} />
<div class:move-up={invisible} class=" fixed top-0 z-50 transition-all w-full">
	<div
	class="navbar bg-base-100 px-4 lg:px-8 border-b border-b-base-200 h-[75px] flex w-full"
>
	<div class="mx-auto max-w-screen-xl w-full relative justify-between">
		<a class="link" href="/">
			<ReactiveSvg src="/logo-long.svg" class="h-14 w-48"></ReactiveSvg>
		</a>
		<div class="flex-none hidden lg:block">
			<ul class="menu menu-horizontal menu-md items-center gap-2 px-1">
				<div class="dropdown static">
					<li tabindex="0" role="button" class="group">
						<a
							>Solutions <CaretDown
								class="group-focus:rotate-180 transition-all"
							></CaretDown></a
						>
					</li>
					<div
						tabindex="0"
						class="dropdown-content z-10 bg-base-100 rounded-lg w-full max-w-screen-xl absolute left-0 top-[75px] px-16 py-12 shadow border border-base-200"
					>
						<div class="grid grid-cols-3 gap-16">
							<div class="flex flex-col gap-4">
								<h2 class="text-2xl font-semibold">
									Solutions
								</h2>
								<p class="text-base text-gray-500">
									With flexibility and neutrality at the core
									of our Customer Identity and Workforce
									Identity Clouds, we make seamless and secure
									access possible for your customers,
									employees, and partners.
								</p>
								<a href="/pricing" class="link">Pricing</a>
							</div>
							<div class="flex flex-col gap-2">
								<h2
									class="text-lg font-normal text-gray-500 mb-2"
								>
									Business Solutions
								</h2>
								<a class="font-medium text-base"
									>Realtime Customer Analytics</a
								>
								<a class="font-medium text-base"
									>Surveillance systems</a
								>
								<a class="font-medium text-base"
									>Customer information management</a
								>
							</div>
							<div class="flex flex-col gap-2">
								<h2
									class="text-lg font-normal text-gray-500 mb-2"
								>
									Customer Products
								</h2>
								<a class="font-medium text-base"
									>Personal Information Management</a
								>
								<a class="font-medium text-base"
									>Identity Provider</a
								>
							</div>
						</div>
					</div>
				</div>
				<div class="dropdown static">
					<li tabindex="0" role="button" class="group">
						<a
							>Developers <CaretDown
								class="group-focus:rotate-180 transition-all"
							></CaretDown></a
						>
					</li>
					<div
						tabindex="0"
						class="dropdown-content z-10 bg-base-100 rounded-lg w-full max-w-screen-xl absolute left-0 top-[75px] px-16 py-12 shadow border border-base-200"
					>
						<div class="grid grid-cols-3 gap-16">
							<div class="flex flex-col gap-4">
								<h2 class="text-2xl font-semibold">
									For Developers
								</h2>
								<p class="text-base text-gray-500">
									Start building with powerful and extensible
									out-of-the-box features, plus thousands of
									integrations and customizations. Our
									developer community is here for you.
								</p>
							</div>
							<div class="flex flex-col gap-2">
								<h2
									class="text-lg font-normal text-gray-500 mb-2"
								>
									Verification Systems
								</h2>
								<a
									class="font-medium text-base flex flex-row gap-2 items-center"
									>Entity Identification Systems (IRIS) <ExternalLink
									></ExternalLink></a
								>
								<a class="font-medium text-base"
									>Auth0 Integrations</a
								>
								<a
									class="font-medium text-base link"
									href="/docs">Developer References</a
								>
								<a class="font-medium text-base"
									>Knowledge Base</a
								>
								<a class="font-medium text-base"
									>Verification System Integration</a
								>
							</div>
							<div class="flex flex-col gap-2">
								<h2
									class="text-lg font-normal text-gray-500 mb-2"
								>
									Information Networks
								</h2>
								<a class="font-medium text-base"
									>Provider Information Sharing</a
								>
								<a class="font-medium text-base"
									>Contributing Customer Information</a
								>
								<a class="font-medium text-base"
									>Developer References</a
								>
								<a class="font-medium text-base"
									>Knowledge Base</a
								>
								<a
									class="font-medium text-base flex flex-row gap-2 items-center"
									>Relations Graphing <ExternalLink
									></ExternalLink></a
								>
							</div>
						</div>
					</div>
				</div>
				<div class="dropdown static">
					<li tabindex="0" role="button" class="group">
						<a
							>Resources <CaretDown
								class="group-focus:rotate-180 transition-all"
							></CaretDown></a
						>
					</li>
					<div
						tabindex="0"
						class="dropdown-content z-10 bg-base-100 rounded-lg w-full max-w-screen-xl absolute left-0 top-[75px] px-16 py-12 shadow border border-base-200"
					>
						<div class="grid grid-cols-4 gap-16">
							<div class="flex flex-col gap-4">
								<h2 class="text-2xl font-semibold">
									Resources and Support
								</h2>
								<p class="text-base text-gray-500">
									Neopathways gives you a neutral, powerful
									and extensible platform that puts identity
									at the heart of your stack. No matter what
									industry, use case, or level of support you
									need, we’ve got you covered.
								</p>
							</div>
							<div class="flex flex-col gap-2">
								<h2
									class="text-lg font-normal text-gray-500 mb-2"
								>
									Resources
								</h2>
								<a class="font-medium text-base">Case Studies</a
								>
								<a class="font-medium text-base">Research</a>
								<a class="font-medium text-base">Datasheets</a>
								<a class="font-medium text-base">Technologies</a
								>
							</div>
							<div class="flex flex-col gap-2">
								<h2
									class="text-lg font-normal text-gray-500 mb-2"
								>
									Community
								</h2>
								<a class="font-medium text-base"
									>Third party services</a
								>
								<a class="font-medium text-base"
									>Developer Hub</a
								>
							</div>
							<div class="flex flex-col gap-2">
								<h2
									class="text-lg font-normal text-gray-500 mb-2"
								>
									Support
								</h2>
								<a class="font-medium text-base">Contact</a>
								<a class="font-medium text-base">FAQ</a>
								<a class="font-medium text-base"
									>Knowledge Base</a
								>
							</div>
						</div>
					</div>
				</div>
				<li><a href="/about">About</a></li>
			</ul>
		</div>
		<div class="items-center gap-4 hidden lg:flex">
			{#if user}
			<div class="dropdown">
				<div tabindex="0" role="button" class="flex flex-row gap-4 btn btn-ghost text-right">
					<div class="flex flex-col">
						<span class="text-base font-semibold">{user.firstname}</span>
						<span class="text-sm text-gray-500">{user.email}</span>
					</div>
					<div class="avatar w-10 h-10 rounded-full bg-base-300">
						<img src="https://sm.ign.com/ign_ap/cover/a/avatar-gen/avatar-generations_hugw.jpg" class="rounded-full" alt="">
					</div>
				</div>
				<ul tabindex="0" class="dropdown-content mt-2 menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
					<li><a href="/profile/dashboard">Profile</a></li>
					<li><a>Organizations</a></li>
					<li><a>Documentation</a></li>
					<div class="divider"></div>
					<div class="w-full flex flex-row justify-between">
						<ThemeController size={18}></ThemeController>
					</div>
				</ul>
			</div>
			{:else}
				<a href="/auth/login" class="btn btn-outline"
					><Person></Person> Login</a
				>
				<ThemeController></ThemeController>
			{/if}
		</div>
	</div>
</div>
<slot></slot>
</div>


<style>
	.move-up {
		transform: translateY(-100%);
	}
</style>
