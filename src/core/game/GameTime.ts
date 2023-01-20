import type { double } from "../BaseTypes";

export default class GameTime {
    readonly currentTime: double;
    readonly deltaTime: double;

    constructor(currentTime: double, deltaTime: double) {
        this.currentTime = currentTime;
        this.deltaTime = deltaTime;
    }

    get currentTimeInSeconds(): double {
        return this.currentTime / 1000;
    }
    
    get deltaTimeInSeconds(): double {
        return this.deltaTime / 1000;
    }

}