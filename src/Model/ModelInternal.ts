import { Point } from "./Point.js";
import { Segment } from "./Segment.js";
import { Material } from "./Material.js";
import { Vector } from "../Math/Vector.js";

export class ModelInternal {
    private static G = new Vector(0, 1);
    private timeStep = 0.1;
    private segments : InternalSegment[];
    private points : InternalPoint[];
    public constructor(segments : Segment[], fixedPoints : ((t : number) => Point)[]) {
        this.segments = [];
        this.points = [];
        let vertexSet = new VertexSet();
        for(let p of fixedPoints) {
            vertexSet.addScriptedPoint(p);
        }
        for (let seg of segments) {
            let m = seg.material.density * seg.length();
            let a = vertexSet.getInternalPoint(seg.a);
            let b = vertexSet.getInternalPoint(seg.b);
            let internalSegment = new InternalSegment(a,b, seg.material);
            a.m += m/2;
            a.incidentSegments.push(internalSegment);
            b.m += m/2;
            b.incidentSegments.push(internalSegment);
            this.segments.push(internalSegment);
        }
        this.points = vertexSet.getAllPoints();
    }

    public getSegments() : Segment[] {
        return this.segments
        .filter(s =>!s.isBroken())
        .map((iseg) => new Segment(iseg.endA.position, iseg.endB.position, iseg.material));
    }

    public getPoints() : Point[] {
        return this.points.map(p => new Point(p.position.x, p.position.y));
    }

    public step() {
        let forces = this.calculateForces();
        this.euler(this.timeStep, forces);
    }

    private calculateForces()  {
        let forceMap : ForceMap = new ForceMap();
        for(let s of this.segments) {
            let t = s.getTension();
            let segmentDirection = s.endA.position.vectorTo(s.endB.position).unitVector();
            forceMap.addForce(s.endA, segmentDirection.scalarProduct(t));
            forceMap.addForce(s.endB, segmentDirection.scalarProduct(-t));
        }
        for(let p of this.points) {
            forceMap.addForce(p, ModelInternal.G.scalarProduct(p.m));
        }
        return forceMap;
    } 

    private euler(dt : number, forceMap : ForceMap) {
        for(let p of this.points) {
            let f = forceMap.getForce(p);
            p.step(dt,f);
        }
    }

}

class ForceMap {
    innerMap : Map<number, Vector>;

    constructor() {
        this.innerMap = new Map();
    }

    public addForce(p : InternalPoint, v : Vector) {
        if(p.scripted) {
            return;
        }
        let f = this.innerMap.get(p.id);
        if(f != null) {
            this.innerMap.set(p.id, f.plus(v));
        } else {
            this.innerMap.set(p.id, v);
        }
    }

    public getForce(p : InternalPoint) : Vector {
        let f = this.innerMap.get(p.id);
        if(f != null) {
            return f;
        } else {
            return new Vector(0,0);
        }
    }
}

class VertexSet {
    innerMap : Map<number, InternalPoint>;

    constructor () {
        this.innerMap = new Map();
    }

    addScriptedPoint(p : (t : number) => Point) {
        let ip = new ScriptedPoint(p);
        this.innerMap.set(p(0).hash(), ip);
    }

    getInternalPoint(p : Point) : InternalPoint {
        let ip = this.innerMap.get(p.hash())
        if(ip != null) {
            return ip;
        } else {
            ip = new InternalPoint(p);
            this.innerMap.set(p.hash(), ip);
            return ip;
        }
    }

    getAllPoints() : InternalPoint[] {
        return Array.from(this.innerMap.values());
    }
}

//internal point representation
class InternalPoint {
    private static nextId : number = 0;
    id : number;
    position : Point;
    v : Vector;
    m : number;
    incidentSegments : InternalSegment[] = [];
    
    constructor(p : Point) {
        this.position = p;
        this.v = new Vector(0,0);
        this.m = 0;
        this.id = InternalPoint.nextId++;
    }
    
    get scripted() {
        return false;
    }

    step(dt : number, f: Vector = new Vector(0,0)) {
        this.v = this.v.plus(f.scalarProduct((dt)/(2*this.m)));
        this.position = this.position.offsetBy(this.v.scalarProduct(dt));
    }

}

class ScriptedPoint extends InternalPoint {
    private t : number;
    private path : (t : number) => Point
    constructor(path : (t : number) => Point) {
        super(path(0));
        this.path = path;
        this.t = 0;
    }

    step(dt : number, f: Vector = new Vector(0,0)) {
        this.t += dt;
        this.position = this.path(this.t);
    }

    get scripted() {
        return true;
    }
}

class InternalSegment {
    endA : InternalPoint;
    endB : InternalPoint;
    initialLength : number;
    material : Material;
    broken : boolean;
    constructor(a : InternalPoint, b : InternalPoint, material : Material) {
        this.endA = a;
        this.endB = b;
        this.material = material;
        this.initialLength = this.endA.position.distanceTo(this.endB.position);
        this.broken = false;
    }

    public getTension() {
        if(Math.abs(this.getLengthRatio() - 1) > this.material.maxStretch) {
            this.broken = true;
        }
        if(this.broken) {
            return 0;
        }
        let springForce = (this.getLengthRatio()-1)*this.material.springCoefficient;
        let dampingForce = this.getLengthVelocity()*this.material.dampingCoefficient*this.initialLength;
        console.log("spring force: " + springForce + " -- dampingForce: " + dampingForce + " -- y: " + this.endB.position.y);
        return springForce + dampingForce;
    }

    public isBroken() {
        return this.broken;
    }

    private getLengthRatio() : number {
        return this.currentLength() / this.initialLength;
    }

    private getLengthVelocity() : number {
        let displacement = this.endA.position.vectorTo(this.endB.position);
        let velocityDiff = this.endB.v.minus(this.endA.v);
        let unscaledVelocity = displacement.innerProduct(velocityDiff) / this.currentLength() ;
        return unscaledVelocity / this.initialLength;
    }

    private currentLength() : number {
        return this.endA.position.distanceTo(this.endB.position);
    }
}