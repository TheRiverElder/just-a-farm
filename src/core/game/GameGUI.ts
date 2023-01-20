import { Application, Container, FederatedPointerEvent, Graphics, Matrix, Point, Rectangle } from "pixi.js";
import type Game from "./Game";
import "@pixi/math-extras";
import type InventorySlot from "./InventorySlot";
import type { Nullable } from "../BaseTypes";
import type Field from "./Field";

enum DraggingType {
    NONE,
    ITEM,
    LAND,
}

export default class GameRenderer {
    readonly game: Game;
    readonly app: Application;

    readonly backgroundView = new Graphics();
    readonly inventoryView = new Container();
    readonly storageView = new Container();
    readonly landView = new Container();
    readonly draggingItemView = new Graphics();

    private inventorySlotViews: Graphics[] = [];
    private fieldViews: Graphics[] = [];


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

        const handleDraggingItemPointerDown = (event: FederatedPointerEvent, item: InventorySlot, originalView: Graphics) => {
            this.draggingType = DraggingType.ITEM;
            this.dragging = false;
            this.draggingItemSlot = item;
            
            this.pointerMoveStartPointerPosition = event.client.clone();
            this.pointerMoveStartTargetPosition = originalView.getGlobalPosition().clone();
            this.draggingItemView.visible = true;
        };

        const handleDraggingPointerMove = (event: FederatedPointerEvent) => {
            if (this.draggingType === DraggingType.NONE) return;
            this.dragging = true;

            switch (this.draggingType) {
                case DraggingType.ITEM: {
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

            this.draggingType = DraggingType.NONE;
            this.pointerMoveStartPointerPosition = new Point();
            this.pointerMoveStartTargetPosition = new Point();
            this.draggingItemSlot = null;
            this.draggingItemView.clear();
            this.draggingItemView.visible = false;
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

            this.fieldViews = this.game.land.map((field) => {
                const view = new Graphics();
                view.interactive = true;
                view.position = field.position.clone().multiply(new Point(32, 32));

                view.on("pointerdown", handleDraggingLandPointerDown);
                view.on("pointermove", handleDraggingPointerMove);
                view.on("pointerup", (event) => {
                    if (this.draggingType === DraggingType.ITEM && !!this.draggingItemSlot) {
                        this.game.use(this.draggingItemSlot, field);
                    }
                    handleDraggingPointerUp(event);
                });
                view.on("click", (event) => {
                    if (this.dragging) return;
                    this.game.harvest(field);
                });
                
                return view;
            });

            this.landView.addChild(...this.fieldViews);
        }

        { // initialize background
            this.backgroundView.interactive = true;
            
            this.backgroundView.on("pointerdown", handleDraggingLandPointerDown);
            this.backgroundView.on("pointermove", handleDraggingPointerMove);
            this.backgroundView.on("pointerup", handleDraggingPointerUp);
            // this.backgroundView.on("pointerleave", handleDriggingPointerUp);
        }

        this.app.stage.addChild(this.backgroundView, this.landView, this.storageView, this.inventoryView, this.draggingItemView);
    }

    render() {

        // render inventory
        for (const slot of this.game.inventory) {
            const view = this.inventorySlotViews[slot.index];
            if (!view) continue;
            slot.render(view);
        }

        { // render land
            const landView = this.landView;
            for (let index = 0; index <= this.game.land.length; index++) {
                const field = this.game.land[index];
                const view = this.fieldViews[index];

                if (!field || !view) continue;

                view.clear();
                view.lineStyle(1, 0xffffff);
                view.beginFill(0xffffff, 0.5);
                view.drawRect(0, 0, 32, 32);
                view.endFill();

                const plant = field.plant;
                if (!plant) continue;
                plant.render(view);
            }
        }

        { // render background
            const view = this.backgroundView;
            view.clear();
            view.beginFill(0x7f7f7f);
            view.drawRect(0, 0, this.app.view.width, this.app.view.height);
            view.endFill();
        }

        {
            this.draggingItemView.clear();
            if (this.draggingType === DraggingType.ITEM && !!this.draggingItemSlot && !!this.draggingItemSlot.item) {
                this.draggingItemSlot.item.render(this.draggingItemView);
            }
        }
    }
}