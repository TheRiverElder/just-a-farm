import type { Point } from "pixi.js";

export function constraints(value: number, minimum: number, maximum: number): number {
    return Math.min(Math.max(minimum, value), maximum);
}

export function pointToArray(point: Point): [number, number] {
    return [point.x, point.y];
}