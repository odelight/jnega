import { Vector } from "../Math/Vector.js";

export class Point {
    static hashConstant = 10000;
    private _x: number;
    private _y: number;
    
    constructor(x : number, y : number) {
        this._x = x;
        this._y = y;
    }

    equals(other : Point) {
        return this.x == other.x && this.y == other.y;
    }

    hash() : number {
        return Point.hashConstant*this.x + this.y;
    }

    vectorTo(other : Point) : Vector {
        return new Vector(other.x - this.x, other.y - this.y);
    }

    offsetBy(v : Vector) : Point {
        return new Point(this.x + v.x, this.y + v.y);
    }

    distanceTo(other : Point) : number {
        let dx = this.x - other.x;
        let dy = this.y - other.y;
        return Math.sqrt(dx*dx + dy*dy);
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }
}
