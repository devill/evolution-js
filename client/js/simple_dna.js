"use strict";

let SimpleBrain = require('./simple_brain');
let BaseDna = require('./base_dna');
let Matrix = require('./matrix');

class SimpleDna extends BaseDna {
    constructor(dna) {
        super(dna);
    }

    buildBrain() {
        return new SimpleBrain(this._dna);
    }

    mix(other_dna) {
        return new SimpleDna({
            first_layer: this.mutateEye((this._dna.first_layer.mix(other_dna._dna.first_layer)).mutate(1)),
            second_layer: (this._dna.second_layer.mix(other_dna._dna.second_layer)).mutate(0.1),
            egg_color: this._mixEggColor(other_dna),
            color: this._mixColor(other_dna),
            eye_size: this._mixEyeSize(other_dna),
            sight_resolution: this.sightResolution()
        });
    }

    mutateEye(matrix) {
        if(Math.random() > 0.9) {
            let data = matrix._data;
            let i = (data[0].length - 4*this.sightResolution()) + 4*Math.floor(Math.random()*(this.sightResolution() - 1));
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

    static generateRandomDna() {
        let mid_layer_size = 20;
        let sight_resolution = 7;
        return new SimpleDna({
            first_layer: Matrix.random(mid_layer_size, sight_resolution*4+4),
            second_layer: Matrix.random(4, mid_layer_size),
            egg_color: Math.random() * 360,
            color: Math.random() * 360,
            eye_size: (0.17 + 0.1*Math.random())*Math.PI,
            sight_resolution: sight_resolution
        });
    }

    static generateRandomDnaWithReducedComplexity() {
        let mid_layer_size = 20;
        let sight_resolution = 7;
        return new SimpleDna({
            first_layer: SimpleDna.reducedComplexityFirstLayer(mid_layer_size, 4, sight_resolution),
            second_layer: Matrix.randomDiagonal(4, mid_layer_size),
            egg_color: Math.random() * 360,
            color: Math.random() * 360,
            eye_size: (0.17 + 0.1*Math.random())*Math.PI,
            sight_resolution: sight_resolution
        });
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