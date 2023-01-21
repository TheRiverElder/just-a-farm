export default class IncreasingNumberGenerator {
    private next: number;
    private step: number;

    constructor(next: number = 0, step: number = 1) {
        this.next = next;
        this.step = step;
    }

    generate(): number {
        const value = this.next;
        this.next += this.step;
        return value;
    }
}