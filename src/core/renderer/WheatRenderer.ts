import { DisplayObject, Graphics } from "pixi.js";
import type { int } from "../BaseTypes";
import type Renderer from "./Renderer";

export default class WheatRenderer implements Renderer {

    readonly size: int = 32;
    readonly graphics: Graphics = new Graphics();

    constructor() {
        this.render();
    }

    getDisplayObject(): DisplayObject {
        return this.graphics;
    }
    
    render(): void {
        const graphics = this.graphics;
        graphics.lineStyle();
        graphics.beginFill(0xaf7f00);
        graphics.moveTo(3, 18);
        graphics.lineTo(28, 16);
        graphics.lineTo(15, 3);
        graphics.endFill();
    }
    
    shouldRerender(): boolean {
        return false;
    }

    dispose(): void {
        this.graphics.removeFromParent();
    }

    reset(): void {
        
    }

}