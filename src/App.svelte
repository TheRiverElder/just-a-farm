<script lang="ts">
	import { onDestroy, onMount } from "svelte";
    import { testGame } from "./core/test/TestGame";
    
	let mountedElement: HTMLElement;
	let debugText = ``;
	let dispose: () => void = () => {};

	onMount(() => {
		if (!mountedElement) return;

		dispose = testGame(mountedElement);
	});

	onDestroy(() => {
		dispose();
	});
</script>

<main bind:this={mountedElement} >
	<div class="debug-text">
		{#each debugText.split("\n") as line}
			<p>{line}</p>
		{/each}
	</div>
</main>


<style>
	main {
		position: relative;
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 0;
		overflow: hidden;
	}

	main > * {
		position: absolute;
		left: 0;
		top: 0;
	}

	.debug-text {
		z-index: 1;
		left: auto;
		right: 0;
		top: 0;
		background-color: #ffffff80;
		color: #000000;
		padding: 1em;
	}
</style>
