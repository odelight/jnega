export class Matrix {
    //first index specifies row, second index specifies column.
    array : number[][];
    
    constructor (array : number[][]) {
        this.array = array;
    }

    times (other : Matrix) {
        let resultArray : number[][] = [];
        for(let rowThis in this.array) {
            resultArray[rowThis] = Array(other.array[0].length);
            resultArray[rowThis].fill(0,0,other.array[0].length);
            for(let colThis in this.array[rowThis]) {
                for(let colOther in other.array[0]) {
                    resultArray[rowThis][colOther] += this.array[rowThis][colThis]*other.array[colThis][colOther];
                }
            }
        }
        return new Matrix(resultArray);
    }

    plus(other : Matrix) {
        let resultArray : number[][] = [];
        for(let row in this.array) {
            resultArray[row] = [];
            for(let col in this.array[row]) {
                resultArray[row][col] = this.array[row][col]+other.array[row][col];
            }
        }
        return new Matrix(resultArray);
    }

    equals(other : Matrix) {
        if(this.array.length != other.array.length) {
            return false;
        }
        for(let row in this.array) {
            if(this.array[row].length != other.array[row].length) {
                return false;
            }    
            for(let col in this.array[row]) {
                if(this.array[row][col] != other.array[row][col]){
                    return false;
                }
            }
        }
        return true;
    }
}
