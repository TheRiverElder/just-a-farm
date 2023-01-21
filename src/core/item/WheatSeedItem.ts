import type { Graphics } from "pixi.js";
import type Field from "../game/Field";
import WheatPlant from "../plant/WheatPlant";
import type Renderer from "../renderer/Renderer";
import WheatSeedRenderer from "../renderer/WheatSeedRenderer";
import Item from "./Item";

export default class WheatSeedItem extends Item {

    readonly renderer = new WheatSeedRenderer();

    getRenderer(): Renderer {
        return this.renderer;
    }
    
    onUseAtField(field: Field): void {
        if (this.amount < 1 || !!field.plant) return;
        field.setContent(new WheatPlant(this.game, 1.0 / 60));
        this.amount--;
    }
    
}