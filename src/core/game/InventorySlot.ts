import type { int, Nullable } from "../BaseTypes";
import type Game from "./Game";
import type Item from "../item/Item";
import type { Graphics } from "pixi.js";

export default class InventorySlot {
    readonly game: Game;
    readonly index: int;
    item: Nullable<Item> = null;

    constructor(game: Game, index: int, item: Nullable<Item> = null) {
        this.game = game;
        this.index = index;
        this.item = item;
    }

    render(graphics: Graphics) {
        graphics.clear();
        graphics.lineStyle(2, 0x0000ff, 0.5, 0);
        graphics.beginFill(0x101010, 0.5);
        graphics.drawRect(0, 0, 32, 32)
        graphics.endFill();

        const item = this.item;
        if (item) {
            item.render(graphics);
        }
    }
}