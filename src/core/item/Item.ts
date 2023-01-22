import type { double, Nullable } from "../BaseTypes";
import InventorySlotItemMutationEvent from "../event/InventorySlotItemMutationEvent";
import { MutationType } from "../event/MutationType";
import type Field from "../game/Field";
import type Game from "../game/Game";
import type InventorySlot from "../game/InventorySlot";
import type Renderer from "../renderer/Renderer";

export default abstract class Item {
    public readonly game: Game;
    private amount: double = 0;

    constructor(game: Game) {
        this.game = game;
        this.amount = 1.0;
    }

    abstract getRenderer(): Renderer;

    abstract onUseAtField(field: Field, slot: InventorySlot): void;

    getAmount() {
        return this.amount;
    }

    setAmount(amount: double) {
        this.mutateAmount(amount - this.amount);
    }

    mutateAmount(delta: double, slot: Nullable<InventorySlot> = null): boolean {
        const oldAmount = this.amount;
        const newAmount = oldAmount + delta;
        if (newAmount < 0) return false;

        this.amount = newAmount;

        if (slot && delta !== 0) {
            this.game.inventorySlotItemMutationEventDispatcher.dispatch(
                new InventorySlotItemMutationEvent(slot, this, delta > 0 ? MutationType.INCREMENT : MutationType.DECREMENT));
        }

        return true;
    }
}