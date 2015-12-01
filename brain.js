"use strict";

class Brain {
    constructor(dna) {
        this._dna = dna;
    }

    think(input) {
        let hidden_neurons = this.sigmoid_map(this.multiply(input, this._dna.first_layer));
        return this.sigmoid_map(this.multiply(hidden_neurons, this._dna.second_layer));
    }

    sigmoid_map(vector) {
        return vector.map(function(x) {
            return 1 / (1 + Math.exp(-x));
        })
    }

    multiply(vect, matrix) {
        let result = [];
        for(let i = 0; i < matrix.length; ++i) {
            let k = 0;
            for(let j = 0; j < matrix[i].length; ++j ) {
                k += vect[j] * matrix[i][j];
            }
            result.push(k);
        }
        return result;
    }
}

module.exports = Brain;

