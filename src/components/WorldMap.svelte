<script lang="ts">
	import map from "svg-world-map";
	import stringify from "virtual-dom-stringify"

	export let lat: number;
	export let lng: number;
	export let width: number
</script>

<div>
	{@html stringify(map(lng, lat, {
		ocean: "transparent",
		pinHeight: 4,
		land: "#303133",
		mapWidth: width
	}))}
</div>