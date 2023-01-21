import type Field from "../game/Field";
import type Plant from "../plant/Plant";
import type { MutationType } from "./MutationType";

export default class FieldPlantMutationEvent {
    readonly field: Field;
    readonly plant: Plant;
    readonly mutationType: MutationType;

    constructor(field: Field, plant: Plant, mutationType: MutationType) {
        this.field = field;
        this.plant = plant;
        this.mutationType = mutationType;
    }
}