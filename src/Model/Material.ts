export class Material {
    maxStretch: number;
    density : number;
    springCoefficient : number;
    dampingCoefficient : number;
    
    constructor(density : number, springCoefficient : number, dampingCoefficient : number, maxStretch : number) {
        this.density = density;
        this.springCoefficient = springCoefficient;
        this.dampingCoefficient = dampingCoefficient;
        this.maxStretch = maxStretch;
    }
}

export class Wood extends Material {
    constructor() {
        super(0.1, 100, 10, 0.25);
    }
}