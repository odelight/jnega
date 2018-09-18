import { Point } from "../Model/Point";
import { Vector } from "./Vector";

export function basicSineWave(center : Point, direction : Vector, period : number) : (t : number) => Point {
    return (t) => (center.offsetBy(direction.scalarProduct(Math.sin(t*(2*Math.PI/period)))));
}