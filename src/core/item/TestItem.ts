import type { Graphics } from "pixi.js";
import type Field from "../game/Field";
import Item from "./Item";

export default class TestItem extends Item {
    
    render(graphics: Graphics): void {
        const base = 0x20;
        const color = (base + Math.floor((this.game.time.currentTime % 1000) / 1000 * (0xff - base))) << 8;
        graphics.beginFill(color);
        graphics.drawRect(0, 0, 32, 32);
        graphics.endFill();
    }

    onUseAtField(field: Field): void {
        if (this.amount < 1) return;
         
        const plant = field.plant;
        if (!plant) return;

        plant.progress = 0;
        this.amount--;
    }
}