"use strict";

let SimpleBrain = require('./simple_brain');
let Matrix = require('./matrix');

class SimpleDna {
    constructor(dna, sight_resolution) {
        this._dna = dna;
        this._sight_resolution = sight_resolution;
    }

    buildBrain() {
        return new SimpleBrain(this._dna);
    }

    eyeSize() {
        return this._dna.eye_size;
    }

    visibilityColor() {
        return hsl2rgb(this._dna.color, 100, 50);
    }

    eggColor() {
        return hsl2rgb(this._dna.egg_color, 100, 90);
    }

    mix(other_dna) {
        return new SimpleDna({
            first_layer: this.mutateEye((this._dna.first_layer.mix(other_dna._dna.first_layer)).mutate(0.1)),
            second_layer: (this._dna.second_layer.mix(other_dna._dna.second_layer)).mutate(0.01),
            egg_color: SimpleDna.mutateValue(Math.random() < 0.5 ? this._dna.egg_color : other_dna._dna.egg_color, 2),
            color: SimpleDna.mutateValue(Math.random() < 0.5 ? this._dna.color : other_dna._dna.color, 2),
            eye_size: SimpleDna._keepInRange(SimpleDna.mutateValue(Math.random() < 0.5 ? this._dna.eye_size : other_dna._dna.eye_size, 0.02*Math.PI), 0.17*Math.PI, 0.27*Math.PI)
        });
    }

    mutateEye(matrix) {
        if(Math.random() > 0.9) {
            let data = matrix._data;
            let i = (data[0].length - 4*this._sight_resolution) + 4*Math.floor(Math.random()*(this._sight_resolution - 1));
            let tmp = 0;
            for(let k = 0; k < data.length; ++k) {
                tmp = data[k][i+0]; data[k][i+0] = data[k][i+4]; data[k][i+4] = tmp;
                tmp = data[k][i+1]; data[k][i+1] = data[k][i+5]; data[k][i+5] = tmp;
                tmp = data[k][i+2]; data[k][i+2] = data[k][i+6]; data[k][i+6] = tmp;
                tmp = data[k][i+3]; data[k][i+3] = data[k][i+7]; data[k][i+7] = tmp;
            }
            return new Matrix(data);
        }
        return matrix;
    }

    static mutateValue(value, max_mutation) {
        return value + (Math.random() < 0.01 ? max_mutation*2*Math.random()-max_mutation: 0)
    }

    static _keepInRange(value, min, max) {
        return Math.min(max,Math.max(min, value));
    }
}

module.exports = SimpleDna;