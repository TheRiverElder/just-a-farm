import { Point } from "pixi.js";
import type { int, Nullable } from "../BaseTypes";
import FieldPlantMutationEvent from "../event/FieldPlantMutationEvent";
import { MutationType } from "../event/MutationType";
import type Plant from "../plant/Plant";

export default class Field {
    readonly uid: int;
    readonly position: Point = new Point();
    plant: Nullable<Plant> = null;

    constructor(uid: int, position: Point, plant: Nullable<Plant> = null) {
        this.uid = uid;
        this.position = position;
        this.plant = plant;
    }

    setContent(plant: Nullable<Plant> = null): Nullable<Plant> {
        const oldPlant = this.plant;
        if (oldPlant) {
            oldPlant.onRemoveFromField(this);
            oldPlant.game.fieldPlantMutationEventDispatcher.dispatch(new FieldPlantMutationEvent(this, oldPlant, MutationType.REMOVE));
        }
        this.plant = plant;
        if (plant) {
            plant.onAddToField(this);
            plant.game.fieldPlantMutationEventDispatcher.dispatch(new FieldPlantMutationEvent(this, plant, MutationType.ADD));
        }
        return oldPlant;
    }
}