import { DisplayObject, Graphics } from "pixi.js";
import type { int } from "../BaseTypes";
import type Renderer from "./Renderer";

export default class WheatSeedRenderer implements Renderer {

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
        graphics.lineStyle(2, 0x220033);
        graphics.beginFill(0x00ffff);
        graphics.drawCircle(16, 16, 4);
        graphics.endFill();
    }
    
    shouleRerender(): boolean {
        return false;
    }

    dispose(): void {
        this.graphics.removeFromParent();
    }

    reset(): void {
        
    }

}