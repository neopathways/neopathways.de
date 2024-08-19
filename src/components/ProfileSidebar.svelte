<script lang="ts">
	import { ActivityLog, Backpack, BarChart, Camera, DrawingPin, Gear, Home, IdCard, Mix, Person } from "radix-svelte-icons";
	import ThemeController from "./ThemeController.svelte";
	import ReactiveSvg from "./ReactiveSVG.svelte";
	import { lightMode } from "#lib/shared";


	export let light: boolean;

	lightMode.set(light);

</script>
<div class="drawer drawer-open bg-base-200">
  <input id="my-drawer-2" type="checkbox" class="drawer-toggle hidden" />
  <div class="drawer-content flex flex-col items-center justify-center">
    <!-- Page content here -->
    <label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden">
      Open drawer
    </label>
  </div>
  <div class="drawer-side">
    <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
		<div class="flex flex-col gap-8 h-full border-r border-r-base-300">
			<a href="/" class="p-4"><ReactiveSvg src="/logo-long.svg" class="h-14 w-48"></ReactiveSvg></a>
			<ul class="menu bg-base-200 text-base-content w-64 gap-2 p-4">
				<span class="text-gray-500 font-semibold">MAIN</span>
				<a href="/profile/dashboard" class="flex flex-row gap-2 items-center text-base font-medium btn btn-ghost justify-start"><Home size={18}></Home> Dashboard</a>
				<a href="/profile/organizations" class="flex flex-row gap-2 items-center text-base font-medium btn btn-ghost justify-start"><Backpack size={18}></Backpack> Organizations</a>
				<a href="/profile/dashboard" class="flex flex-row gap-2 items-center text-base font-medium btn btn-ghost justify-start"><BarChart size={18}></BarChart> Analytics</a>
				<a href="/profile/dashboard" class="flex flex-row gap-2 items-center text-base font-medium btn btn-ghost justify-start"><ActivityLog size={18}></ActivityLog> Logs</a>
				<span class="text-gray-500 font-semibold">SERVICES</span>
				<a href="/profile/dashboard" class="flex flex-row gap-2 items-center text-base font-medium btn btn-ghost justify-start"><Camera size={18}></Camera> CCTV Tracking</a>
				<a href="/profile/dashboard" class="flex flex-row gap-2 items-center text-base font-medium btn btn-ghost justify-start"><DrawingPin size={18}></DrawingPin> IP Location</a>
				<a href="/profile/dashboard" class="flex flex-row gap-2 items-center text-base font-medium btn btn-ghost justify-start"><Person size={18}></Person> Facial Recognition</a>
				<span class="text-gray-500 font-semibold">SECURITY</span>
				<a href="/profile/sessions" class="flex flex-row gap-2 items-center text-base font-medium btn btn-ghost justify-start"><IdCard size={18}></IdCard> Sessions</a>
			</ul>
			<div class="flex flex-row justify-between items-center mt-auto border-t border-t-base-300 p-4">
				<ThemeController></ThemeController>
				<a class="btn btn-square btn-ghost"><Person size={24}></Person> </a>
				<a class="btn btn-square btn-ghost"><Gear size={24}></Gear></a>
			</div>
		</div>
  </div>
</div>