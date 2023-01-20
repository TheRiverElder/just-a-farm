<script lang="ts">
    import { Point } from "pixi.js";
	import { onMount } from "svelte";
    import Field from "./core/game/Field";
 
    import Game from "./core/game/Game";
    import GameGUI from "./core/game/GameGUI";
    import TestItem from "./core/item/TestItem";
    import WheatSeedItem from "./core/item/WheatSeedItem";
    import WrapperEventListener from "./core/util/event/WrappedEventListener";
    import DebugRenderer from "./DebugRenderer";


	let mountedElement: HTMLElement;
	let debugText = ``;

	onMount(() => {
		if (!mountedElement) return;
		
		const game: Game = new Game();
		game.initialize();

		{ // initialize test data

			const items = [
				new TestItem(game),
				new WheatSeedItem(game),
			];
			items.forEach(item => {
				item.amount = 1;
				game.addToInventory(item);
			});

			const fields: Field[] = [];
			for (let y = 0; y < 5; y++) {
				for (let x = 0; x < 7; x++) {
					fields.push(new Field(new Point(x, y)));
				}
			}
			game.land.push(...fields);
		}

		const gameGUI = new GameGUI(game, mountedElement);
		game.renderEventDispatcher.addListener(new WrapperEventListener(() => gameGUI.render()));

		const debugRenderer = new DebugRenderer(game, (text: string) => (debugText = text));
		game.renderEventDispatcher.addListener(new WrapperEventListener(() => debugRenderer.render()));
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
