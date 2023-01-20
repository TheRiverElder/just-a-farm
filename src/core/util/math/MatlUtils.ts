export function constraints(value: number, minimum: number, maximum: number) {
    return Math.min(Math.max(minimum, value), maximum);
}