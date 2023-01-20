import type { Graphics } from "pixi.js";
import type Field from "../game/Field";
import WheatPlant from "../plant/WheatPlant";
import Item from "./Item";

export default class WheatSeedItem extends Item {

    render(graphics: Graphics): void {
        graphics.lineStyle(2, 0x220033);
        graphics.beginFill(0x00ffff);
        graphics.drawCircle(16, 16, 4);
        graphics.endFill();
    }
    
    onUseAtField(field: Field): void {
        if (this.amount < 1 || !!field.plant) return;
        field.setContent(new WheatPlant(this.game, 1.0 / 60));
        this.amount--;
    }
    
}