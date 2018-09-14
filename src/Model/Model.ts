import { Point } from "./Point.js";
import { Segment } from "./Segment.js";
import { Material } from "./Material.js";

export class Model {
    segments : Segment[] = [];

    pushSegment(a : Point, b : Point, material : Material) {
        this.segments.push(new Segment(a,b, material));
    }

    getSegments() : Segment[]  {
        return this.segments;
    }
    
}
