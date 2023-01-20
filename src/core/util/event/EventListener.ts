export interface EventListener<TEvent> {
    onEvent(event: TEvent): void;
}


