import { Point } from "./Point.js";
import { Segment } from "./Segment.js";
import { Material } from "./Material.js";
import { Vector } from "../Math/Vector.js";

export class ModelInternal {
    private static G = new Vector(0, -10);
    private timeStep = 0.1;
    private segments : InternalSegment[];
    private points : InternalPoint[];
    public constructor(segments : Segment[]) {
        let vertexSet = new VertexSet();
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
        return this.segments.map((iseg) => new Segment(iseg.endA.position, iseg.endB.position, iseg.material));
    }

    public getPoints() : Point[] {
        return this.points.map(p => new Point(p.position.x, p.position.y));
    }

    public step() {
        let forces = this.calculateForces();
        this.euler(this.timeStep, forces);
    }

    private calculateForces()  {
        let forceMap : ForceMap
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
            p.position = p.position.offsetBy(p.v.scalarProduct(dt).plus(forceMap.getForce(p).scalarProduct((dt*dt)/(2*p.m))));
            p.v = p.v.plus(forceMap.getForce(p).scalarProduct((dt)/(2*p.m)));
        }
    }

}

class ForceMap {
    innerMap : Map<number, Vector>;

    constructor() {
        this.innerMap = new Map();
    }

    public addForce(p : InternalPoint, v : Vector) {
        if(this.innerMap.has(p.id)) {
            this.innerMap.set(p.id, this.innerMap.get(p.id).plus(v));
        } else {
            this.innerMap.set(p.id, v);
        }
    }

    public getForce(p : InternalPoint) : Vector {
        if(this.innerMap.has(p.id)) {
            return this.innerMap.get(p.id);
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

    getInternalPoint(p : Point) : InternalPoint {
        if(this.innerMap.has(p.hash())) {
            return this.innerMap.get(p.hash());
        } else {
            let v = new InternalPoint(p);
            this.innerMap.set(p.hash(), v);
            return v;
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
        return this.getLengthRatio()*this.material.springCoefficient + this.getLengthVelocity()*this.material.dampingCoefficient;
    }

    private getLengthRatio() : number {
        return this.currentLength() / this.initialLength;
    }

    private getLengthVelocity() : number {
        let displacement = this.endA.position.vectorTo(this.endB.position);
        let velocityDiff = this.endB.v.minus(this.endA.v);
        return displacement.innerProduct(velocityDiff) / this.currentLength() ;
    }

    private currentLength() : number {
        return this.endA.position.distanceTo(this.endB.position);
    }
}