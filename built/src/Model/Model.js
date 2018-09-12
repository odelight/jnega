import { Segment } from "./Segment.js";
export class Model {
    constructor() {
        this.segments = [];
    }
    pushSegment(a, b) {
        this.segments.push(new Segment(a, b));
    }
    getSegments() {
        return this.segments;
    }
}
