import { Point } from "./Point.js";
import { Segment } from "./Segment.js";
import { Material } from "./Material.js";
import { ModelInternal } from "./ModelInternal.js";

export class ModelAPI {
    private segments : Segment[];
    private scriptedPoints : ((t : number) => Point)[];
    private objectivePoints : [Point, number,  number][];
    private lossConditions : ((model : ModelAPI) => boolean)[];
    private victoryConditions : ((model : ModelAPI) => boolean)[];
    private internalModel : ModelInternal | null = null;
    private running : boolean = false;
    private time : number;

    constructor() {
        this.scriptedPoints = []
        this.segments = [];
        this.objectivePoints = []
        this.lossConditions = [];
        this.victoryConditions = [];
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

    pushObjectivePoint(position : Point, mass : number, id : number) {
        if(!this.running || this.internalModel == null) {
            this.objectivePoints.push([position, mass, id]);
        } else {
            throw "Attempted to add objective point after simulation started";
        }    
    }

    getObjectivePoints() : [Point, number, number][] {
        if(!this.running || this.internalModel == null) {
            return this.objectivePoints;
        } else {
            return this.internalModel.getObjectivePoints();
        }  
    }

    //Returns number of times step has been called, as an integer.
    getTime() : number {
        return this.time;
    }

    addLossCondition(fn : (model : ModelAPI) => boolean) {
        this.lossConditions.push(fn);
    }

    addVictoryCondition(fn : (model : ModelAPI) => boolean) {
        this.victoryConditions.push(fn);
    }


    getGameOver() : GameState {
        let won = this.victoryConditions
        .map(fn => fn(this))
        .some(won => won == true);
        if(won) {
            return GameState.WON;
        }

        let lost = this.lossConditions
        .map(fn => fn(this))
        .some(lost => lost == true);
        if(lost) {
            return GameState.LOST;
        }

        return GameState.STILL_PLAYING;
    }

    start() {
        this.time = 0;
        this.running = true;
        this.internalModel = new ModelInternal(this.segments, this.scriptedPoints, this.objectivePoints);
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
        this.time++;
    }

    isRunning() {
        return this.running && this.internalModel != null;
    }
    
}

export enum GameState {
    WON,
    LOST,
    STILL_PLAYING
}