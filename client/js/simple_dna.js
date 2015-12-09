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

    sightResolution() {
        return this._sight_resolution;
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
            egg_color: SimpleDna.mutateValue(Math.random() < 0.5 ? this._dna.egg_color : other_dna._dna.egg_color, 0.01),
            color: SimpleDna.mutateValue(Math.random() < 0.5 ? this._dna.color : other_dna._dna.color, 0.01),
            eye_size: SimpleDna._keepInRange(SimpleDna.mutateValue(Math.random() < 0.5 ? this._dna.eye_size : other_dna._dna.eye_size, 0.01*Math.PI), 0.17*Math.PI, 0.27*Math.PI)
        }, this._sight_resolution);
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

    static generateRandomDna() {
        let mid_layer_size = 20;
        let sight_resolution = 7;
        return new SimpleDna({
            first_layer: Matrix.random(mid_layer_size, sight_resolution*4+4),
            second_layer: Matrix.random(4, mid_layer_size),
            egg_color: Math.random() * 360,
            color: Math.random() * 360,
            eye_size: (0.17 + 0.1*Math.random())*Math.PI
        }, sight_resolution);
    }

    static generateRandomDnaWithReducedComplexity() {
        let mid_layer_size = 20;
        let sight_resolution = 7;
        return new SimpleDna({
            first_layer: SimpleDna.reducedComplexityFirstLayer(mid_layer_size, 4, sight_resolution),//Matrix.random(mid_layer_size, sight_resolution*4+4),
            second_layer: Matrix.randomDiagonal(4, mid_layer_size),
            egg_color: Math.random() * 360,
            color: Math.random() * 360,
            eye_size: (0.17 + 0.1*Math.random())*Math.PI
        }, sight_resolution);
    }

    static reducedComplexityFirstLayer(rows, random_columns, sight_resolution) {
        let result = [];
        for(let i = 0; i < rows; ++i) {
            let v = [];
            for(let j = 0; j < random_columns; ++j) {
                v.push(2*Math.random()-1);
            }

            let sight_functions = SimpleDna.generateSightFunctions(sight_resolution);
            for(let j = 0; j < sight_resolution; ++j) {
                sight_functions.forEach(func => {
                    let x = 2*(j/sight_resolution)-1;
                    v.push(func(x));
                });
            }

            result.push(v);
        }
        return new Matrix(result);
    }

    static generateSightFunctions() {
        let rnd = () => {
            return 2 * Math.random() - 1
        };

        return [0,0,0,0].map(nope => {
            let type = Math.floor(Math.random() * 5) - 1;
            console.log(type);
            switch (type) {
                case -1:
                    return (x) => { return x < 0.01 ? rnd() : 0; };
                case 0:
                    return (x) => { return rnd(); };
                case 1:
                    return (x) => { return rnd() * x; };
                case 2:
                    return (x) => { return rnd() * x * x + rnd(); };
                case 3:
                    return (x) => { return rnd() * x * x * x; };
                default:
                    return (x) => { return 0; };
            }
        });

    }
}

module.exports = SimpleDna;