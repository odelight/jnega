import { Point } from "./Point.js";
import { Segment } from "./Segment.js";
import { Material } from "./Material.js";
import { ModelInternal } from "./ModelInternal.js";

export class ModelAPI {
    private segments : Segment[];
    private scriptedPoints : ((t : number) => Point)[];
    private internalModel : ModelInternal | null = null;
    private running : boolean = false;

    constructor() {
        this.scriptedPoints = []
        this.segments = [];
    }

    pushSegment(a : Point, b : Point, material : Material) {
        if(!this.running || this.internalModel == null) {
            this.segments.push(new Segment(a,b, material));
        } else {
            throw "Attempted to add segment after simulation started";
        }
    }

    getSegments() : Segment[]  {
        if(!this.running || this.internalModel == null) {
            return this.segments;
        } else {
            return this.internalModel.getSegments();
        }
    }

    pushScriptedPoint(path : (t : number) => Point) {
        this.scriptedPoints.push(path);
    }

    getScriptedPoints() : Point[] {
        if(!this.running || this.internalModel == null) {
            return this.scriptedPoints.map(sp => sp(0));
        } else {
            return this.internalModel.getScriptedPoints();
        }    
    }

    start() {
        this.running = true;
        this.internalModel = new ModelInternal(this.segments, this.scriptedPoints);
    }

    abort() {
        this.running = false;
        this.internalModel = null;
    }

    step() {
        if(!this.running || this.internalModel == null) {
            throw "Called step before model started successfully";
        }
        this.internalModel.step();
    }

    isRunning() {
        return this.running && this.internalModel != null;
    }
    
}
