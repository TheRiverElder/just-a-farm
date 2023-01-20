import type { EventListener } from "./EventListener";

export default class EventDispatcher<TEvent = void> {
    private readonly listeners: Set<EventListener<TEvent>> = new Set();

    dispatch(event: TEvent) {
        this.listeners.forEach(listener => listener.onEvent(event));
    }
    
    addListener(listener: EventListener<TEvent>) {
        this.listeners.add(listener);
    }
    
    removeListener(listener: EventListener<TEvent>) {
        this.listeners.delete(listener);
    }

    
}