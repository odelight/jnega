export class Material {
    density : number;
    springCoefficient : number;
    dampingCoefficient : number;
    
    constructor(density : number, springCoefficient : number, dampingCoefficient : number) {
        this.density = density;
        this.springCoefficient = springCoefficient;
        this.dampingCoefficient = dampingCoefficient;
    }
}
