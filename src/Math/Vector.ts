export class Vector {
    private _x : number;
    private _y : number;
    
    constructor(x : number, y : number) {
        this._x = x;
        this._y = y;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    plus(other : Vector) {
        return new Vector(this.x + other.x, this.y + other.y);
    }

    minus(other : Vector) {
        return new Vector(this.x - other.x, this.y - other.y);
    }

    innerProduct(other : Vector) {
        return this.x*other.x + this.y*other.y;
    }

    norm() {
        return Math.sqrt(this.innerProduct(this));
    }

    unitVector() : Vector {
        return this.scalarProduct(1/ this.norm());
    }

    scalarProduct(k : number) {
        return new Vector(this.x*k, this.y*k);
    }
}