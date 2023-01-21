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
}