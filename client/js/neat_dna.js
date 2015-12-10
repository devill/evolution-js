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
        let this_is_primary = Math.random() < 0.5;
        let primary = (this_is_primary) ? this._dna.connections : other_dna._dna.connections;
        let secondary = (!this_is_primary) ? this._dna.connections : other_dna._dna.connections;

        let innovation_hash = {};
        secondary.forEach(connection => {
            innovation_hash[connection.innovation] = connection;
        });

        return primary.map(connection => {
            if(connection.enabled && innovation_hash[connection.innovation]) {
                return Math.random() < 0.5 ? connection : innovation_hash[connection.innovation];
            } else {
                return connection;
            }
        });
    }

    static generateRandomDna() {
        let sightResolution = 3;
        return new NeatDna({
            connections: NeatDna.randomInitialConnections(sightResolution),
            egg_color: Math.floor(Math.random() * 360),
            color: Math.floor(Math.random() * 360),
            eye_size: (0.17 + 0.1*Math.random())*Math.PI,
            sight_resolution: sightResolution
        });
    }

    static randomInitialConnections(sightResolution) {
        let connections = [];
        for(let i = 0; i < 4+sightResolution*4; i++) {
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