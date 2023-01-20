import type { Graphics } from "pixi.js";
import type { double } from "../BaseTypes";
import type Field from "../game/Field";
import type Game from "../game/Game";
import type Item from "../item/Item";

export default abstract class Plant {
    public readonly game: Game;

    progress: double = 0; // 0 ~ 1: growing period, 1 ~ 2: regrowing period

    constructor(game: Game) {
        this.game = game;
    }

    abstract render(graphics: Graphics): void;

    abstract onAddToField(field: Field): void;
    abstract onRemoveFromField(field: Field): void;
    abstract onHarvest(field: Field): Item[];
}