import type { Graphics } from "pixi.js";
import type { double } from "../BaseTypes";
import type Field from "../game/Field";
import type Game from "../game/Game";
import type Item from "../item/Item";
import PlantItem from "../item/PlantItem";
import TestItem from "../item/TestItem";
import WrapperEventListener from "../util/event/WrappedEventListener";
import Plant from "./Plant";

export default class TestPlant extends Plant {

    growSpeed: double = 0.0;

    constructor(game: Game, growSpeed: double) {
        super(game);
        this.growSpeed = growSpeed;
    }

    render(graphics: Graphics): void {
        const radius = (this.progress) * 8 + 4;
        graphics.lineStyle(0);
        graphics.beginFill(0x00ffff);
        graphics.drawCircle(16, 16, radius);
        graphics.endFill();
    }

    private ticker = new WrapperEventListener(() => this.tick());

    onAddToField(field: Field): void {
        this.game.tickEventDispatcher.addListener(this.ticker);
    }

    tick() {
        this.progress = Math.min(this.progress + this.game.time.deltaTimeInSeconds * this.growSpeed, 1);
    }

    onHarvest(field: Field): Item[] {
        this.game.tickEventDispatcher.removeListener(this.ticker);

        if (this.progress >= 1) {
            const childPlant = new TestPlant(this.game, this.growSpeed);
            return [
                new PlantItem(this.game, childPlant), 
                new TestItem(this.game),
            ];
        } else return [new PlantItem(this.game, this)];
    }

}