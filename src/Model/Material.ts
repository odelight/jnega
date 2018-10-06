
export class Material {
    typeEnum : MaterialType;
    maxStretch: number;
    density : number;
    springCoefficient : number;
    dampingCoefficient : number;
    costPerUnit : number;
    
    constructor(typeEnum : MaterialType, density : number, springCoefficient : number, maxStretch : number, costPerUnit : number, dampingRatio : number = 1) {
        this.typeEnum = typeEnum;
        this.density = density;
        this.springCoefficient = springCoefficient;
        this.maxStretch = maxStretch;
        this.costPerUnit = costPerUnit;
        let criticalDamping = Math.sqrt(2*this.springCoefficient*this.density);
        this.dampingCoefficient = dampingRatio*criticalDamping;
    }
}

export enum MaterialType {
    Wood,
    Steel
}

let wood = new Material(MaterialType.Wood, 0.1, 200000, 0.02, 1);
let steel = new Material(MaterialType.Steel, 0.2, 2000000, 0.01, 2);

export {wood, steel};