import { Point } from "pixi.js";
import Game from "../game/Game";
import GameGUI from "../game/GameGUI";
import WheatSeedItem from "../item/WheatSeedItem";
import WrapperEventListener from "../util/event/WrappedEventListener";

export function testGame(domElement: HTMLElement) {
		
    const game: Game = new Game();
    game.initialize();

    { // initialize test data
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 7; x++) {
                game.addField(new Point(x, y));
            }
        }
    }

    const gameGUI = new GameGUI(game, domElement);console.log(gameGUI);
    game.renderEventDispatcher.addListener(new WrapperEventListener(() => gameGUI.render()));

    // const debugRenderer = new DebugRenderer(game, (text: string) => (debugText = text));
    // game.renderEventDispatcher.addListener(new WrapperEventListener(() => debugRenderer.render()));

    {
        const items = [
            new WheatSeedItem(game),
        ];
        items.forEach(item => {
            item.amount = 1;
            game.addToInventory(item);
        });
    }

    return () => {
        game.dispose();
    };
} 