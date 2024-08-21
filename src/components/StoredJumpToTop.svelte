<script lang="ts">
	// A component that allows you to jump to the top of the page and return to the previous position afterwards

	import { ArrowUp, ArrowDown } from "radix-svelte-icons";

	let lastScrollPosition = 0;

	function click() {
		if (lastScrollPosition === 0) {
			window.scrollTo({ top: 0, behavior: "smooth" });
		} else {
			window.scrollTo({ top: lastScrollPosition, behavior: "smooth" });
		}

		lastScrollPosition = window.scrollY;
	}

	function scroll() {
		const scrollTop = window.scrollY;

		if (scrollTop > lastScrollPosition) {
			lastScrollPosition = 0;
		}
	}

	const { class: className, rest} = $$restProps;
</script>

<svelte:window on:scroll={scroll}></svelte:window>
<label class="sticky bottom-4 p-3 rounded-full border border-base-300 bg-base-200 swap swap-rotate active:bg-base-300 transition {className}" {...rest}>
	<input type="checkbox" class="hidden" checked={lastScrollPosition == 0} on:click={click}>
	<ArrowUp size={24} class="swap-on"></ArrowUp>
	<ArrowDown size={24} class="swap-off"></ArrowDown>
</label>