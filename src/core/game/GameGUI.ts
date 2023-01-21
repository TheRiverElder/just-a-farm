import { Application, Container, DisplayObject, FederatedPointerEvent, Graphics, Matrix, Point, Rectangle } from "pixi.js";
import type Game from "./Game";
import "@pixi/math-extras";
import type InventorySlot from "./InventorySlot";
import type { int, Nullable } from "../BaseTypes";
import WrapperEventListener from "../util/event/WrappedEventListener";
import type FieldPlantMutationEvent from "../event/FieldPlantMutationEvent";
import { MutationType } from "../event/MutationType";
import type InventorySlotItemMutationEvent from "../event/InventorySlotItemMutationEvent";

enum DraggingType {
    NONE,
    ITEM,
    LAND,
}

export default class GameGUI {
    readonly game: Game;
    readonly app: Application;

    readonly backgroundView = new Graphics();
    readonly inventoryView = new Container();
    readonly storageView = new Container();
    readonly landView = new Container();
    private draggingItemView: Nullable<DisplayObject> = null;

    private inventorySlotViews: Graphics[] = [];
    private fieldViews = new Map<int, Graphics>();


    constructor(game: Game, mountElement: HTMLElement) {
        this.game = game;

        this.app = new Application({ resizeTo: mountElement });
        mountElement.appendChild(this.app.view as unknown as any);

        this.initialize();
    }

    private draggingType: DraggingType = DraggingType.NONE;
    private dragging: boolean = false; // 只有在指针移动后才赋为true，在拖动发结束后不还原，仅在拖动开始时重置
    private pointerMoveStartPointerPosition: Point = new Point();
    private pointerMoveStartTargetPosition: Point = new Point();
    private draggingItemSlot: Nullable<InventorySlot> = null;

    initialize() {

        const handleDraggingLandPointerDown = (event: FederatedPointerEvent) => {
            this.draggingType = DraggingType.LAND;
            this.dragging = false;

            this.pointerMoveStartPointerPosition = event.client.clone();
            this.pointerMoveStartTargetPosition = this.landView.position.clone();
        };

        const handleDraggingItemPointerDown = (event: FederatedPointerEvent, slot: InventorySlot, originalView: Graphics) => {
            if (!slot.item) return;
            this.draggingType = DraggingType.ITEM;
            this.dragging = false;
            this.draggingItemSlot = slot;
            
            this.pointerMoveStartPointerPosition = event.client.clone();
            this.pointerMoveStartTargetPosition = originalView.getGlobalPosition().clone();
        };

        const handleDraggingPointerMove = (event: FederatedPointerEvent) => {
            if (this.draggingType === DraggingType.NONE) return;
            const isStartDragging = !this.dragging;
            this.dragging = true;

            switch (this.draggingType) {
                case DraggingType.ITEM: {
                    if (isStartDragging && !this.draggingItemView && this.draggingItemSlot) {
                        const item = this.draggingItemSlot.item;
                        if (item) {
                            this.draggingItemView = item.getRenderer().getDisplayObject();
                            this.app.stage.addChild(this.draggingItemView);
                        }
                    }
                    if (!this.draggingItemView) break;
                    const pointerPisition = event.client;
                    const delta = pointerPisition.clone().subtract(this.pointerMoveStartPointerPosition);
                    this.draggingItemView.position = delta.add(this.pointerMoveStartTargetPosition);
                    break;
                }
                case DraggingType.LAND: {
                    const pointerPisition = event.client;
                    // console.log("pointerPisition", pointerPisition);
                    const delta = pointerPisition.clone().subtract(this.pointerMoveStartPointerPosition);
                    this.landView.position = delta.add(this.pointerMoveStartTargetPosition);
                    // console.log("this.landView.position", this.landView.position);
                    break;
                }
                default: break;
            }
        };

        const handleDraggingPointerUp = (event: FederatedPointerEvent) => {
            if (this.draggingType === DraggingType.NONE) return;
            
            this.pointerMoveStartPointerPosition = new Point();
            this.pointerMoveStartTargetPosition = new Point();
            this.draggingItemSlot?.item?.getRenderer().dispose();

            if (this.draggingType === DraggingType.ITEM) {
                const item = this.draggingItemSlot.item;
                if (!!item) {
                    const slotView = this.inventorySlotViews[this.draggingItemSlot.index];
                    if (slotView) {
                        const renderer = item.getRenderer();
                        renderer.reset();
                        const view = renderer.getDisplayObject();
                        view.position = new Point();
                        slotView.addChild(view);
                    }
                }
            }

            this.draggingItemSlot = null;
            this.draggingType = DraggingType.NONE;
        };

        { // initialize inventory view
            this.inventoryView.zIndex = 10;

            this.inventorySlotViews = this.game.inventory.map(slot => {
                const view = new Graphics();
                view.width = 32;
                view.height = 32;
                view.position = new Point(32 * slot.index, 0);
                view.interactive = true;
                // g.hitArea = new Rectangle(0, 0, g.width, g.height);

                // g.on("click", () => console.log(`这是${slot.item?.amount || 0}个物品，位置：${slot.index}`));
                view.on("pointerdown", (event) => {
                    if (!slot.item) return;
                    handleDraggingItemPointerDown(event, slot, view);
                });
                view.on("pointermove", (event) => {
                    if (this.draggingType != DraggingType.ITEM) return;
                    handleDraggingPointerMove(event);
                });
                view.on("pointerup", (event) => {
                    handleDraggingPointerUp(event);
                    // this.game.inventorySwap();
                }); 

                return view;
            });

            this.inventoryView.addChild(...this.inventorySlotViews);
        }

        { // initialize land view
            this.landView.position = new Point(100, 100);
            this.landView.interactive = false;

            const tileSize = new Point(32, 32);
            this.game.land.forEach((field) => {
                const view = new Graphics();
                view.interactive = true;
                view.position = field.position.clone().multiply(tileSize);

                view.on("pointerdown", handleDraggingLandPointerDown);
                view.on("pointermove", handleDraggingPointerMove);
                view.on("pointerup", (event) => {
                    const draggingType = this.draggingType;
                    const draggingItemSlot = this.draggingItemSlot;
                    handleDraggingPointerUp(event);
                    if (draggingType === DraggingType.ITEM && !!draggingItemSlot) {
                        this.game.use(draggingItemSlot, field);
                    }
                });
                view.on("click", (event) => {
                    if (this.dragging) return;
                    this.game.harvest(field);
                });
                

                view.clear();
                view.lineStyle(1, 0xffffff);
                view.beginFill(0xffffff, 0.5);
                view.drawRect(0, 0, 32, 32);
                view.endFill();

                this.fieldViews.set(field.uid, view);
                this.landView.addChild(view);
            });
        }

        { // initialize background
            this.backgroundView.interactive = true;
            
            this.backgroundView.on("pointerdown", handleDraggingLandPointerDown);
            this.backgroundView.on("pointermove", handleDraggingPointerMove);
            this.backgroundView.on("pointerup", handleDraggingPointerUp);
            // this.backgroundView.on("pointerleave", handleDriggingPointerUp);
        }

        this.app.stage.addChild(this.backgroundView, this.landView, this.storageView, this.inventoryView);

        this.game.fieldPlantMutationEventDispatcher.addListener(this.fieldPlantMutationEventListener);
        this.game.inventorySlotItemMutationEventDispatcher.addListener(this.inventorySlotItemMutationEventListener);
    }

    private readonly fieldPlantMutationEventListener = new WrapperEventListener<FieldPlantMutationEvent>((event) => {
        const renderer = event.plant.getRenderer();
        if (event.mutationType === MutationType.ADD) {
            const displayObject = renderer.getDisplayObject();
            const fieldView: Graphics = this.fieldViews.get(event.field.uid);
            fieldView?.addChild(displayObject);
            renderer.render();
        } else if (event.mutationType === MutationType.REMOVE) {
            renderer.dispose();
        }
    });

    private readonly inventorySlotItemMutationEventListener = new WrapperEventListener<InventorySlotItemMutationEvent>((event) => {
        const renderer = event.item.getRenderer();
        if (event.mutationType === MutationType.ADD) {
            const displayObject = renderer.getDisplayObject();
            const inventorySlotView: Graphics = this.inventorySlotViews[event.slot.index];
            inventorySlotView?.addChild(displayObject);
            renderer.render();
        } else if (event.mutationType === MutationType.REMOVE) {
            renderer.dispose();
        }
    });

    render() {

        // render inventory
        for (const slot of this.game.inventory) {
            const view = this.inventorySlotViews[slot.index];
            if (!view) continue;
            
            view.clear();
            view.lineStyle(2, 0x0000ff, 0.5, 0);
            view.beginFill(0x101010, 0.5);
            view.drawRect(0, 0, 32, 32)
            view.endFill();
    
            const item = slot.item;
            if (item) {
                const renderer = item.getRenderer();
                if (renderer.shouleRerender()) {
                    renderer.render();
                }
            }
        }

        { // render land
            const landView = this.landView;
            for (const field of this.game.land) {
                const plant = field.plant;
                if (!plant) continue;
                const renderer = plant.getRenderer();
                if (renderer.shouleRerender()) {
                    renderer.render();
                }
            }
        }

        { // render background
            const view = this.backgroundView;
            view.clear();
            view.beginFill(0x7f7f7f);
            view.drawRect(0, 0, this.app.view.width, this.app.view.height);
            view.endFill();
        }

        if (this.draggingItemView) {
            if (this.draggingType === DraggingType.ITEM && !!this.draggingItemSlot && !!this.draggingItemSlot.item) {
                const renderer = this.draggingItemSlot.item.getRenderer();
                if (renderer.shouleRerender()) {
                    renderer.render();
                }
            }
        }
    }
}