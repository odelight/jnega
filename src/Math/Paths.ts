import { Point } from "../Model/Point";
import { Vector } from "./Vector";

export function basicCosineWave(center : Point, direction : Vector, period : number) : (t : number) => Point {
    return (t) => (center.offsetBy(direction.scalarProduct(Math.cos(t*(2*Math.PI/period)))));
}