"use strict";

let NeatBrain = require('./neat_brain');
let BaseDna = require('./base_dna');

class NeatDna extends BaseDna {
    constructor(dna) {
        super(dna);
    }

    buildBrain() {
        return new NeatBrain(this._dna);
    }

    mix(other_dna) {
        return new NeatDna({
            connections: this.mixConnections(other_dna),
            egg_color: this._mixEggColor(other_dna),
            color: this._mixColor(other_dna),
            eye_size: this._mixEyeSize(other_dna),
            sight_resolution: this.sightResolution()
        });
    }

    mixConnections(other_dna) {
        let result = [];
        for(let i = 0; i < this._dna.connections.length; i++) {
            result.push(Math.random() < 0.5 ? this._dna.connections[i] : other_dna._dna.connections[i]);
        }
        return result;
    }

    static generateRandomDna() {
        return new NeatDna({
            connections: NeatDna.randomInitialConnections(),
            egg_color: Math.random() * 360,
            color: Math.random() * 360,
            eye_size: (0.17 + 0.1*Math.random())*Math.PI,
            sight_resolution: 1
        });
    }

    static randomInitialConnections() {
        let connections = [];
        for(let i = 0; i < 5; i++) {
            for(let j = 0; j < 4; j++) {
                connections.push({
                    enabled:true,
                    inNode: `in_${j}`,
                    outNode: `out_${j}`,
                    weight: 2*Math.random()-1,
                    innovation: Math.uuid()
                });
            }
        }
        return connections;
    }


}

module.exports = NeatDna;