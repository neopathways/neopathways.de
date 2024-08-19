<script>
	import { InfoCircled } from "radix-svelte-icons";

</script>
<div class="grid grid-cols-[1fr,400px] gap-8 w-[calc(100%+432px)]">
	<slot></slot>

	<div class="prose-pre:mb-0">
		<slot name="response"></slot>
		<span class="text-base-content text-opacity-60 text-sm flex flex-row gap-2 items-center mt-2"><InfoCircled></InfoCircled> Example Response</span>
	</div>
	
</div>