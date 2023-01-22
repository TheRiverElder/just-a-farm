import type { double, Nullable } from "../BaseTypes";
import type Field from "../game/Field";
import type Game from "../game/Game";
import type InventorySlot from "../game/InventorySlot";
import type ItemLocation from "../game/ItemLocation";
import type Renderer from "../renderer/Renderer";

export default abstract class Item {
    public readonly game: Game;
    private amount: double = 0;
    public location: Nullable<ItemLocation> = null;

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

        if (delta !== 0) {
            this.location?.onItemAmountMutated(this, oldAmount);
        }

        return true;
    }
}