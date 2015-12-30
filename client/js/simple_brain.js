"use strict";

class SimpleBrain {
    constructor(dna) {
        this._dna = dna;
    }

    think(inputHash) {
        let input = Object.keys(inputHash).map(key => { return inputHash[key]; });
        let hidden_neurons = this.sigmoid_map(this._dna.first_layer.multiplyWithVector(input));
        let output = this.sigmoid_map(this._dna.second_layer.multiplyWithVector(hidden_neurons));
        return {
            acceleration_angle: output[0],
            acceleration_radius: output[1],
            shooting_trigger: output[2],
            sexual_desire: output[3]
        };
    }

    sigmoid_map(vector) {
        return vector.map(x => {
            return Math.sigmoid(x);
        })
    }

    possessed() {
        return false;
    }

    draw() {
    }
}

module.exports = SimpleBrain;

