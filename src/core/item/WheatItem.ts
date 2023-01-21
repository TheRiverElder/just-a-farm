import type Field from "../game/Field";
import type Renderer from "../renderer/Renderer";
import WheatRenderer from "../renderer/WheatRenderer";
import Item from "./Item";

export default class WheatItem extends Item {

    readonly renderer = new WheatRenderer();

    getRenderer(): Renderer {
        return this.renderer;
    }

    onUseAtField(field: Field): void {
        // TODO 
    }

}