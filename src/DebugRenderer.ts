import type { Consumer } from "./core/BaseTypes";
import type Game from "./core/game/Game";

export default class DebugRenderer {
    readonly game: Game;
    readonly setText: Consumer<string>;

    constructor(game: Game, setText: Consumer<string>) {
        this.game = game;
        this.setText = setText;
    }

    render() {
        const game = this.game;
        this.setText(`
            time.currentTime = ${game.time.currentTime}
            time.deltaTime = ${game.time.deltaTime}
        `);
    }
}