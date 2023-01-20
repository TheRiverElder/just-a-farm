import type { Graphics } from "pixi.js";
import type { double, int } from "../BaseTypes";
import type Field from "../game/Field";
import type Game from "../game/Game";
import type Item from "../item/Item";
import PlantItem from "../item/PlantItem";
import TestItem from "../item/TestItem";
import WrapperEventListener from "../util/event/WrappedEventListener";
import { constraints } from "../util/math/MatlUtils";
import Plant from "./Plant";
import TestPlant from "./TestPlant";

export default class WheatPlant extends Plant {

    growSpeed: double = 0.0;
    health: double = 0.0;
    condition: double = 0.0;

    constructor(game: Game, growSpeed: double) {
        super(game);
        this.growSpeed = growSpeed;

        this.health = 1;
        this.condition = 0;
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
        this.health = constraints(this.health + this.condition, 0, 1.5);
        let grown = this.game.time.deltaTimeInSeconds * this.growSpeed;
        grown *= this.health;
        this.progress = constraints(this.progress + grown, 0, 1);
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