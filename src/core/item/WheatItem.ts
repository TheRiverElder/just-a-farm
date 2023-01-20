import type { Graphics } from "pixi.js";
import type Field from "../game/Field";
import Item from "./Item";

export default class WheatItem extends Item {

    render(graphics: Graphics): void {
        graphics.lineStyle();
        graphics.beginFill(0xaf7f00);
        graphics.moveTo(3, 18);
        graphics.lineTo(28, 16);
        graphics.lineTo(15, 3);
        graphics.endFill();
    }

    onUseAtField(field: Field): void {
        // TODO 
    }

}