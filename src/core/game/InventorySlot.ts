import type { int, Nullable } from "../BaseTypes";
import type Game from "./Game";
import type Item from "../item/Item";
import type ItemLocation from "./ItemLocation";
import InventorySlotItemMutationEvent from "../event/InventorySlotItemMutationEvent";
import { MutationType } from "../event/MutationType";

export default class InventorySlot implements ItemLocation {
    readonly game: Game;
    readonly index: int;
    private item: Nullable<Item> = null;

    constructor(game: Game, index: int, item: Nullable<Item> = null) {
        this.game = game;
        this.index = index;
        this.item = item;
    }

    getItem() {
        return this.item;
    }

    setItem(item: Nullable<Item> = null) {
        const oldItem = this.item;
        this.item = item;
        
        if (oldItem) {
            oldItem.location = null;
            this.onItemRemoved(oldItem);
        }
        
        if (item) {
            this.item.location = this;
            this.onItemAdded(item);
        }

    }

    onItemAdded(item: Item): void {
        this.game.inventorySlotItemMutationEventDispatcher.dispatch(
            new InventorySlotItemMutationEvent(this, item, MutationType.ADDED));
    }

    onItemAmountMutated(item: Item, oldAmount: number): void {
        const mutationType = item.getAmount() > oldAmount ? MutationType.INCREMENT : MutationType.DECREMENT;
        this.game.inventorySlotItemMutationEventDispatcher.dispatch(new InventorySlotItemMutationEvent(this, item, mutationType));
        if (item === this.item && item.getAmount() <= 0) {
            this.setItem(null);
        } 
    }

    onItemRemoved(item: Item): void {
        this.game.inventorySlotItemMutationEventDispatcher.dispatch(
            new InventorySlotItemMutationEvent(this, item, MutationType.REMOVED));
    }
}