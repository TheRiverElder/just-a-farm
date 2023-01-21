import type { double } from "../BaseTypes";
import type Field from "../game/Field";
import type Game from "../game/Game";
import type Item from "../item/Item";
import PlantItem from "../item/PlantItem";
import WheatItem from "../item/WheatItem";
import WheatSeedItem from "../item/WheatSeedItem";
import type Renderer from "../renderer/Renderer";
import WheatPlantRenderer from "../renderer/WheatPlantRenderer";
import WrapperEventListener from "../util/event/WrappedEventListener";
import { constraints } from "../util/math/MatlUtils";
import Plant from "./Plant";

export default class WheatPlant extends Plant {

    growSpeed: double = 0.0;
    health: double = 0.0;
    condition: double = 0.0;

    constructor(game: Game, growSpeed: double) {
        super(game);
        this.growSpeed = growSpeed;

        this.health = 1.0;
        this.condition = 0.0;
    }

    readonly renderer = new WheatPlantRenderer(this, true);

    getRenderer(): Renderer {
        return this.renderer;
    }

    private ticker = new WrapperEventListener(() => this.tick());

    onAddToField(field: Field): void {
        this.game.tickEventDispatcher.addListener(this.ticker);
    }

    tick() {
        this.health = constraints(this.health + this.condition, 0.5, 1.5);
        const deltaProgress = this.game.time.deltaTimeInSeconds * this.growSpeed * this.health;
        this.progress = constraints(this.progress + deltaProgress, 0, 1);
    }

    onRemoveFromField(field: Field): void {
        this.game.tickEventDispatcher.removeListener(this.ticker);
    }

    onHarvest(field: Field): Item[] {

        if (this.progress >= 1) {
            const seeds = [new WheatSeedItem(this.game)];
            const hasExtraPlant = Math.random() < 0.2;
            if (hasExtraPlant) {
                seeds.push(new WheatSeedItem(this.game));
            }
            return [
                ...seeds, 
                new WheatItem(this.game),
            ];
        } else return [new PlantItem(this.game, this)];
    }

} 