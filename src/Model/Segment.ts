import { Point } from "./Point";

export class Segment {
    a : Point;
    b : Point;
    constructor(a : Point, b : Point) {
        this.a = a;
        this.b = b;
    }
}