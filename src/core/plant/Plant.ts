import type { double } from "../BaseTypes";
import type Field from "../game/Field";
import type Game from "../game/Game";
import type Item from "../item/Item";
import type Renderer from "../renderer/Renderer";

export default abstract class Plant {
    public readonly game: Game;

    progress: double = 0; // 0 ~ 1: growing period, 1 ~ 2: regrowing period

    constructor(game: Game) {
        this.game = game;
    }

    abstract getRenderer(): Renderer;

    abstract onAddToField(field: Field): void;
    abstract onRemoveFromField(field: Field): void;
    abstract onHarvest(field: Field): Item[];
}