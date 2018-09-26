
export class Material {
    maxStretch: number;
    density : number;
    springCoefficient : number;
    dampingCoefficient : number;
    costPerUnit : number;
    
    constructor(density : number, springCoefficient : number, maxStretch : number, costPerUnit : number, dampingRatio : number = 1) {
        this.density = density;
        this.springCoefficient = springCoefficient;
        this.maxStretch = maxStretch;
        this.costPerUnit = costPerUnit;
        let criticalDamping = Math.sqrt(2*this.springCoefficient*this.density);
        this.dampingCoefficient = dampingRatio*criticalDamping;
    }
}

let wood = new Material(0.1, 200000, 0.02, 1);
export {wood};