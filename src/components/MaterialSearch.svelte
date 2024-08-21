<script lang="ts">
	import { MaterialSchema } from "prisma/generated";
	import CustomSearch from "./CustomSearch.svelte";
</script>

<CustomSearch schema={MaterialSchema}></CustomSearch>