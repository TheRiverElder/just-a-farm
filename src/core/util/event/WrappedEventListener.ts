import type { EventListener } from "./EventListener";

export default class WrapperEventListener<TEvent> implements EventListener<TEvent> {

    readonly func: (event: TEvent) => void;

    constructor(func: (event: TEvent) => void) {
        this.func = func;
    }

    onEvent(event: TEvent): void {
        this.func(event);
    }

}