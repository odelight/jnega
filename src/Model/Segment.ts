import { Point } from "./Point.js";
import { Material } from "./Material.js";

export class Segment {
    a : Point;
    b : Point;
    //Stretch is 0 if segment hasn't expanded at all, and segment breaks when stretch reaches 1.
    private stretch : number;
    material : Material;
    constructor(a : Point, b : Point, material : Material, stretch : number = 0) {
        this.a = a;
        this.b = b;
        this.material = material;
        this.stretch = stretch;
    }

    setStretch(s : number) {
        this.stretch = s;
    }

    getStretch() {
        return this.stretch;
    }

    length() : number {
        return this.a.distanceTo(this.b);
    }
}