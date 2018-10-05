
export class Material {
    name : string;
    maxStretch: number;
    density : number;
    springCoefficient : number;
    dampingCoefficient : number;
    costPerUnit : number;
    
    constructor(name : string, density : number, springCoefficient : number, maxStretch : number, costPerUnit : number, dampingRatio : number = 1) {
        this.name = name;
        this.density = density;
        this.springCoefficient = springCoefficient;
        this.maxStretch = maxStretch;
        this.costPerUnit = costPerUnit;
        let criticalDamping = Math.sqrt(2*this.springCoefficient*this.density);
        this.dampingCoefficient = dampingRatio*criticalDamping;
    }
}

let wood = new Material("wood", 0.1, 200000, 0.02, 1);
let steel = new Material("steel", 0.2, 2000000, 0.01, 2);

export {wood, steel};