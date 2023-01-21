import type { double } from "../BaseTypes";
import type Field from "../game/Field";
import type Game from "../game/Game";
import type Renderer from "../renderer/Renderer";

export default abstract class Item {
    public readonly game: Game;
    amount: double = 0;

    constructor(game: Game) {
        this.game = game;
        this.amount = 1.0;
    }

    abstract getRenderer(): Renderer;

    abstract onUseAtField(field: Field): void;
}