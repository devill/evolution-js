"use strict";

let uuid = require('uuid');

let NeatBrain = require('./neat_brain');
let BaseDna = require('./base_dna');
let NeatDnaMixer = require('./neat_dna_mixer');
let Config = require('./config');

class NeatDna extends BaseDna {
    constructor(dna) {
        super(dna);
    }

    buildBrain() {
        return new NeatBrain(this);
    }

    mix(other_dna) {
        let this_is_primary = Math.random() < 0.5;
        let primary = (this_is_primary) ? this._dna : other_dna._dna;
        let secondary = (!this_is_primary) ? this._dna : other_dna._dna;

        console.log("Mixing:");
        console.log(primary, secondary);

        let mixed = (new NeatDnaMixer(primary,secondary)).mix();

        console.log(mixed);
        return new NeatDna({
            id: uuid.v4(),
            nodes: mixed.nodes,
            connections: mixed.connections,
            egg_color: this._mixEggColor(other_dna),
            color: this._mixColor(other_dna),
            eye_size: this._mixEyeSize(other_dna),
            sight_resolution: this.sightResolution()
        });
    }

    connections() {
        return this._dna.connections;
    }

    inNodes(connections) {
        connections = connections || this.connections();
        return connections.filter(c => {
            return !isInt(c.inNode);
        }).map(c => { return c.inNode; }).unique();
    }

    hiddenNodes(connections) {
        connections = connections || this.connections();
        return connections.filter(c => {
            return isInt(c.inNode);
        }).map(c => { return c.inNode; }).unique();
    }

    outNodes(connections) {
        connections = connections || this.connections();
        return connections.filter(c => {
            return !isInt(c.outNode);
        }).map(c => { return c.outNode; }).unique();
    }

    static generateRandomDna() {
        let sightResolution = 3;
        var connections = NeatDna.randomInitialConnections(sightResolution);
        return NeatDna.buildRandomDnaWithConnections(sightResolution, connections);
    }


    static generateReducedRandomDna() {
        let sightResolution = 3;
        var connections = NeatDna.randomReducedInitialConnections(sightResolution);
        return NeatDna.buildRandomDnaWithConnections(sightResolution, connections);
    }

    static buildRandomDnaWithConnections(sightResolution, connections) {
        return new NeatDna({
            id: uuid.v4(),
            nodes: NeatDna.initialNodes(sightResolution),
            connections: connections,
            egg_color: Math.floor(Math.random() * 360),
            color: Math.floor(Math.random() * 360),
            eye_size: (0.17 + 0.1 * Math.random()) * Math.PI,
            sight_resolution: sightResolution
        });
    }

    static randomInitialConnections(sightResolution) {
        let connections = [];
        for(let i = 0; i < 4+sightResolution*4; i++) {
            for(let j = 0; j < 4; j++) {
                connections.push({
                    enabled: true,
                    inNode: `in_${i}`,
                    outNode: `out_${j}`,
                    weight: chance.normal(),
                    innovation: `initial_${i}_${j}`
                });
            }
        }
        return connections;
    }

    static randomReducedInitialConnections(sightResolution) {
        let connections = [];
        for(let i = 4; i < 4+sightResolution*4; i+=4) {
            for(let j = 0; j < 2; j++) {
                connections.push({
                    enabled: true,
                    inNode: `in_${i+2}`,
                    outNode: `out_${j}`,
                    weight: chance.normal(),
                    innovation: `initial_${i}_${j}`
                });
                connections.push({
                    enabled: true,
                    inNode: `in_${i+3}`,
                    outNode: `out_${j}`,
                    weight: chance.normal(),
                    innovation: `initial_${i}_${j}`
                });
            }
        }
        return connections;
    }

    static initialNodes(sightResolution) {
        let nodes = { 'in': [], 'out':[], 'hidden':[] };
        for(let i = 0; i < 4+sightResolution*4; i++) {
            nodes.in.push({id: `in_${i}`});
        }
        for(let j = 0; j < 4; j++) {
            nodes.out.push({id: `out_${j}`});
        }
        return nodes;
    }


}

module.exports = NeatDna;
