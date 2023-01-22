import type Field from "../game/Field";
import type InventorySlot from "../game/InventorySlot";
import WheatPlant from "../plant/WheatPlant";
import type Renderer from "../renderer/Renderer";
import WheatSeedRenderer from "../renderer/WheatSeedRenderer";
import Item from "./Item";

export default class WheatSeedItem extends Item {

    readonly renderer = new WheatSeedRenderer();

    getRenderer(): Renderer {
        return this.renderer;
    }
    
    onUseAtField(field: Field, slot: InventorySlot): void {
        if (!this.mutateAmount(-1, slot) || !!field.plant) return;
        field.setContent(new WheatPlant(this.game, 1.0 / 60));
    }
    
}