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
}