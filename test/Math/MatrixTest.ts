import { Matrix } from "../../src/Math/Matrix.js";

export function matrixTest() : string {
    let result = "Matrix Test results:";
    if(!testTimes()) {
        return result + "Failed: testProduct";
    }
    if(!testPlus()) {
        return result + "Failed: testPlus";
    }
    return result + "Success";
}

function testTimes() : boolean {
    let matrix1 = new Matrix([[1,2],[3,4]]);
    let matrix2 = new Matrix([[4,3],[2,1]]);
    let product = matrix1.times(matrix2);
    let expected = new Matrix([[8,5],[20,13]]);
    return expected.equals(product);
}

function testPlus() : boolean {
    let matrix1 = new Matrix([[1,2],[3,4]]);
    let matrix2 = new Matrix([[4,3],[2,1]]);
    let sum = matrix1.plus(matrix2);
    let expected = new Matrix([[5,5],[5,5]]);
    return expected.equals(sum);
}
