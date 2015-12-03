"use strict";

let Matrix = require('./matrix');

class SimpleBrain {
    constructor(dna) {
        this._dna = dna;
    }

    think(input) {
        let hidden_neurons = this.sigmoid_map(this._dna.first_layer.multiplyWithVector(input));
        return this.sigmoid_map(this._dna.second_layer.multiplyWithVector(hidden_neurons));
    }

    sigmoid_map(vector) {
        return vector.map(x => {
            return 1 / (1 + Math.exp(-x));
        })
    }
}

module.exports = SimpleBrain;

