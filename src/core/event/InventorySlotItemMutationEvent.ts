import type InventorySlot from "../game/InventorySlot";
import type Item from "../item/Item";
import type { MutationType } from "./MutationType";

export default class InventorySlotItemMutationEvent {
    readonly slot: InventorySlot;
    readonly item: Item;
    readonly mutationType: MutationType;

    constructor(slot: InventorySlot, item: Item, mutationType: MutationType) {
        this.slot = slot;
        this.item = item;
        this.mutationType = mutationType;
    }
}