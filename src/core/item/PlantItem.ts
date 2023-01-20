import type { Graphics } from "pixi.js";
import type Field from "../game/Field";
import type Game from "../game/Game";
import Item from "./Item";
import type Plant from "../plant/Plant";

export default class PlantItem extends Item {
    plant: Plant;

    constructor(game: Game, plant: Plant) {
        super(game);
        this.plant = plant;
    }

    render(graphics: Graphics): void {
        this.plant.render(graphics);
    }

    onUseAtField(field: Field): void {
        field.setContent(this.plant);
        this.amount = 0;
    }

}