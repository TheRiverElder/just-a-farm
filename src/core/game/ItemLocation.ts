import type { double } from "../BaseTypes";
import type Item from "../item/Item";

export default interface ItemLocation {
    onItemAdded(item: Item): void;
    onItemAmountMutated(item: Item, oldAmount: double): void;
    onItemRemoved(item: Item): void;
}