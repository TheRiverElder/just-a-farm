import { Point } from "pixi.js";
import type { Nullable } from "../BaseTypes";
import type Plant from "../plant/Plant";

export default class Field {
    readonly position: Point = new Point();
    plant: Nullable<Plant> = null;

    constructor(position: Point, plant: Nullable<Plant> = null) {
        this.position = position;
        this.plant = plant;
    }

    setContent(plant: Nullable<Plant> = null): Nullable<Plant> {
        const oldPlant = this.plant;
        if (oldPlant) {
            oldPlant.onRemoveFromField(this);
        }
        this.plant = plant;
        if (plant) {
            plant.onAddToField(this);
        }
        return oldPlant;
    }
}