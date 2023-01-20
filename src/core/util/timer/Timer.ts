import type { int, Nullable } from "../../BaseTypes";
import EventDispatcher from "../event/EventDispatcher";

export default class Timer {
    public readonly eventDispatcher = new EventDispatcher<Timer>();

    period: int; // milliseconds

    private pid: Nullable<NodeJS.Timeout> = null;

    constructor(period: int) {
        if (period <= 0) throw new Error("period should larger than 0: " + period);
        this.period = period;
    }

    private run() {
        this.pid = setTimeout(this.run.bind(this), this.period);
        this.eventDispatcher.dispatch(this);
    }

    start() {
        if (this.pid !== null) return;
        this.run();
    }

    stop() {
        if (this.pid === null) return;
        clearTimeout(this.pid);
        this.pid = null;
    }
    
}