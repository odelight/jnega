
export class Material {
    maxStretch: number;
    density : number;
    springCoefficient : number;
    dampingCoefficient : number;
    
    constructor(density : number, springCoefficient : number, maxStretch : number, dampingRatio : number = 1) {
        this.density = density;
        this.springCoefficient = springCoefficient;
        let criticalDamping = Math.sqrt(2*this.springCoefficient*this.density);
        this.dampingCoefficient = dampingRatio*criticalDamping;
        this.maxStretch = maxStretch;
    }
}

let wood = new Material(0.1, 200000, 0.02);
export {wood};