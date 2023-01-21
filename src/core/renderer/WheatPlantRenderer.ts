import { DisplayObject, Graphics, Point } from "pixi.js";
import type { int } from "../BaseTypes";
import type Game from "../game/Game";
import type Plant from "../plant/Plant";
import { pointToArray } from "../util/math/MatlUtils";
import type Renderer from "./Renderer";

export default class WheatPlantRenderer implements Renderer {

    readonly size: int = 32;
    readonly game: Game;
    readonly plant: Plant;
    readonly graphics: Graphics;
    dynamic: boolean = false;
    private staticImageRendered: boolean = false;

    constructor(plant: Plant, dynamic: boolean = false) {
        this.game = plant.game;
        this.plant = plant;
        this.dynamic = dynamic;
        this.graphics = new Graphics();
    }

    setDynamic(dynamic: boolean) {
        const oldDynamic = this.dynamic;
        this.dynamic = dynamic;
        if (oldDynamic !== dynamic && !dynamic) {
            this.staticImageRendered = false;
        }
    }

    getDisplayObject(): DisplayObject {
        return this.graphics;
    }
    
    render(): void {
        const gameTime = this.dynamic ? this.game.time.currentTimeInSeconds : 0;
        const phase = gameTime % 10 / 10 * 2 * Math.PI;

        const graphics = this.graphics;
        const radius = this.size / 8 + this.size / 4 * this.plant.progress;
        const r = Math.floor(0xff * this.plant.progress);
        const g = 0xff;
        const b = 0x00;
        const color = ((r << 16) + (g << 8) + b);

        const center = new Point(this.size / 2, this.size / 2);
        const segmentX = Math.cos(phase);
        const segmentY = Math.sin(phase);
        const handleLength = (7 / 8 / 2) * this.size;

        graphics.clear();
        graphics.lineStyle(this.size / 16, color);
        graphics.beginFill();
        graphics.moveTo(...pointToArray(new Point(+segmentX, +segmentY).multiplyScalar(handleLength).add(center)));
        graphics.lineTo(...pointToArray(new Point(-segmentX, -segmentY).multiplyScalar(handleLength).add(center)));
        graphics.endFill();
        graphics.beginFill();
        graphics.moveTo(...pointToArray(new Point(-segmentY, +segmentX).multiplyScalar(handleLength).add(center)));
        graphics.lineTo(...pointToArray(new Point(+segmentY, -segmentX).multiplyScalar(handleLength).add(center)));
        graphics.endFill();

        graphics.lineStyle();
        graphics.beginFill(color);
        graphics.drawCircle(32 / 2, 32 / 2, radius);
        graphics.endFill();

        if (!this.dynamic && !this.staticImageRendered) {
            this.staticImageRendered = true;
        }
    }
    
    shouleRerender(): boolean {
        return this.dynamic || !this.staticImageRendered;
    }

    dispose(): void {
        this.graphics.removeFromParent();
    }

    reset(): void {
        this.dynamic = true;
        this.staticImageRendered = false;
    }

}