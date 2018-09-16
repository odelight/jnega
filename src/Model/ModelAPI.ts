import { Point } from "./Point.js";
import { Segment } from "./Segment.js";
import { Material } from "./Material.js";
import { ModelInternal } from "./ModelInternal.js";

export class ModelAPI {
    segments : Segment[];
    internalModel : ModelInternal;

    pushSegment(a : Point, b : Point, material : Material) {
        this.segments.push(new Segment(a,b, material));
    }

    getSegments() : Segment[]  {
        return this.segments;
    }

    
}
