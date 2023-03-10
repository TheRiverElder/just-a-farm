import type { double, int, Nullable } from "../BaseTypes";
import Field from "./Field";
import GameTime from "./GameTime";
import InventorySlot from "./InventorySlot";
import type Item from "../item/Item";
import EventDispatcher from "../util/event/EventDispatcher";
import WrapperEventListener from "../util/event/WrappedEventListener";
import Timer from "../util/timer/Timer";
import type { Point } from "pixi.js";
import IncreasingNumberGenerator from "../util/math/IncreasingNumberGenerator";
import InventorySlotItemMutationEvent from "../event/InventorySlotItemMutationEvent";
import { MutationType } from "../event/MutationType";
import type FieldPlantMutationEvent from "../event/FieldPlantMutationEvent";

export default class Game {
    storage: Item[] = [];
    inventory: InventorySlot[] = [];
    land: Field[] = [];

    harvest(field: Field) {
        const plant = field.plant;
        if (!plant) return;

        const products = plant.onHarvest(field);
        field.setContent(null);
        products.forEach(item => this.addToInventory(item));
    }

    use(slot: InventorySlot, field: Field) {
        const item = slot.getItem();
        if (!item) return;

        item.onUseAtField(field, slot);
    }

    load(storageIndex: int, slot: InventorySlot) {
        const item = this.storage[storageIndex];
        if (!item) return;

        const replacement: Item[] = [];

        const oldItem = slot.getItem();
        if (!!oldItem && oldItem.getAmount() > 0) {
            replacement.push(oldItem);
            this.inventorySlotItemMutationEventDispatcher.dispatch(new InventorySlotItemMutationEvent(slot, oldItem, MutationType.DECREMENT));
        }

        this.storage.splice(storageIndex, 1, ...replacement);
    }

    store(slot: InventorySlot, storageIndex: int = -1) {
        const item = slot.getItem();
        if (!item) return;

        const finalStorageIndex = storageIndex < 0 ? this.storage.length : Math.min(this.storage.length, storageIndex);

        slot.setItem(null);
        this.storage.splice(finalStorageIndex, 0, item);
    }

    addToInventory(item: Item): boolean {
        for (const slot of this.inventory) {
            if (!slot.getItem()) {
                slot.setItem(item);
                return true;
            }
        }
        return false;
    }

    addToStorage(item: Item): boolean {
        this.storage.push(item);
        return true;
    }

    private readonly fieldUidGenerator = new IncreasingNumberGenerator();

    addField(position: Point): Field {
        const field = new Field(this.fieldUidGenerator.generate(), position.clone());
        this.land.push(field);
        return field;
    }

    findField(position: Point): Nullable<Field> {
        return this.land.find(field => field.position.equals(position)) || null;
    }


    tickPeriod: int = 50;
    timeScale: double = 1.0;
    time: GameTime = new GameTime(0, 0);

    readonly timer: Timer = new Timer(this.tickPeriod);
    readonly tickEventDispatcher = new EventDispatcher();
    readonly renderEventDispatcher = new EventDispatcher();
    readonly fieldPlantMutationEventDispatcher = new EventDispatcher<FieldPlantMutationEvent>();
    readonly inventorySlotItemMutationEventDispatcher = new EventDispatcher<InventorySlotItemMutationEvent>();

    public initialize() {
        this.inventory = Array(6).fill(0).map((_, index) => new InventorySlot(this, index));

        this.time = new GameTime(0, 0);
        this.timer.eventDispatcher.addListener(this.ticker);
        this.timer.start();
    }

    public dispose() {
        this.timer.stop();
        this.timer.eventDispatcher.removeListener(this.ticker);
    }

    private ticker = new WrapperEventListener(() => this.tick());

    tick() {
        const deltaTime = this.tickPeriod * this.timeScale;
        const currentTime = this.time.currentTime + deltaTime;
        this.time = new GameTime(currentTime, deltaTime);

        this.tickEventDispatcher.dispatch();

        this.renderEventDispatcher.dispatch();
    }

} 