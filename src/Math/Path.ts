import { Point } from "../Model/Point";
import { Vector } from "./Vector";

export function basicCosineWave(center : Point, direction : Vector, period : number) : Path {
    let innerPath = (t : number) => (center.offsetBy(direction.scalarProduct(Math.cos(t*(2*Math.PI/period)))));
    return new Path(innerPath);
}

export class Path {
    private internalPath : (t : number) => Point;
    public constructor(fn : (t : number) => Point) {
        this.internalPath = fn;
    }

    public initialPosition() : Point {
        return this.atTime(0);
    }

    public atTime(t : number) : Point {
        return this.internalPath(t);
    }
    
}