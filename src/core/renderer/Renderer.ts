import type { DisplayObject } from "pixi.js";

export default interface Renderer {
    getDisplayObject(): DisplayObject;
    render(): void;
    shouleRerender(): boolean;
    dispose(): void;
    reset(): void;
}