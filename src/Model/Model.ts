import { Point } from "./Point.js";
import { Segment } from "./Segment.js";

export class Model {
    segments : Segment[] = [];
    pushSegment(a : Point, b : Point) {
        this.segments.push(new Segment(a,b));
    }
    getSegments() : Segment[]  {
        return this.segments;
    }
}
