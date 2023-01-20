import type { Graphics } from "pixi.js";
import type { double } from "../BaseTypes";
import type Field from "../game/Field";
import type Game from "../game/Game";

export default abstract class Item {
    public readonly game: Game;
    amount: double = 0;

    constructor(game: Game) {
        this.game = game;
        this.amount = 1.0;
    }

    abstract render(graphics: Graphics): void;

    abstract onUseAtField(field: Field): void;
}