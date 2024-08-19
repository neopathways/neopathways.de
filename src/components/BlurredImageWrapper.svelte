<script lang="ts">
	export let src: string;
	export let alt: string;

	const {class: className, ...rest} = $$restProps;
</script>

<div class="relative flex items-center justify-center w-full h-full p-8 overflow-hidden">
	<div class="absolute inset-0 bg-cover bg-center filter blur-xl" style="background-image: url({src})"></div>
	<img {src} {alt} class="w-full h-full rounded-lg z-10 {$$restProps.class}" {...rest}>
</div>