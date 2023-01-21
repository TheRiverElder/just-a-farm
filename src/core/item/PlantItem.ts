import type { Graphics } from "pixi.js";
import type Field from "../game/Field";
import type Game from "../game/Game";
import Item from "./Item";
import type Plant from "../plant/Plant";
import type Renderer from "../renderer/Renderer";

export default class PlantItem extends Item {
    plant: Plant;

    constructor(game: Game, plant: Plant) {
        super(game);
        this.plant = plant;
    }
    
    getRenderer(): Renderer {
        return this.plant.getRenderer();
    }

    onUseAtField(field: Field): void {
        field.setContent(this.plant);
        this.amount = 0;
    }

}