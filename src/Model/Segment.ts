import { Point } from "./Point.js";
import { Material } from "./Material.js";

export class Segment {
    a : Point;
    b : Point;
    material : Material;
    constructor(a : Point, b : Point, material : Material) {
        this.a = a;
        this.b = b;
        this.material = material;
    }
}