"use strict";

let uuid = require('uuid');

let NeatBrain = require('./neat_brain');
let BaseDna = require('./base_dna');
let NeatDnaMixer = require('./neat_dna_mixer');

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

        let mixed = (new NeatDnaMixer(primary,secondary)).mix();

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

    outNodes() {
        return this._dna.nodes['out'];
    }

    nodes() {
        return this._dna.nodes['in'].concat(this._dna.nodes['hidden']).concat(this._dna.nodes['out']);
    }

    nodeLevels() {
        let result = {};
        let currentLevel = 0;
        let lastLevelUsed = 0;
        let currentLevelNodes = [];
        let nextLevelNodes = this._dna.nodes['in'].map(n => { return n.id });
        let connectionsHash = this.connectionsAsHash();

        do {
            currentLevelNodes = nextLevelNodes;
            nextLevelNodes = [];
            currentLevelNodes.forEach(nid => {
                if(!result[nid]) {
                    result[nid] = currentLevel;
                    lastLevelUsed = currentLevel;
                    if(connectionsHash[nid]) {
                        nextLevelNodes = nextLevelNodes.concat(connectionsHash[nid].map(c => { return c.outNode; }));
                    }
                }
            });
            currentLevel += 1;
        } while(nextLevelNodes.length > 0);

        this._dna.nodes['out'].forEach(n => { result[n.id] = lastLevelUsed + 1 });

        return result;
    }

    connectionsAsHash() {
        let hash = {};
        this._dna.connections.forEach(c => {
            if(!hash[c.inNode]) { hash[c.inNode] = [] }
            hash[c.inNode].push(c);
        });
        return hash;
    }

    pixelId(i) {
        return NeatDna.pixelIdForResolution(i, this.sightResolution());
    }

    static pixelIdForResolution(i, resolution) {
        let pixelIndex = i - Math.floor(resolution / 2);
        let pixelSide = (pixelIndex < 0) ? 'l' : ((pixelIndex > 0) ? 'r' : 'c');
        return pixelSide + Math.abs(pixelIndex);
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
        let initialNodes = NeatDna.initialNodes(sightResolution);
        initialNodes['in'].forEach(inNode => {
            initialNodes['out'].forEach(outNode => {
                connections.push({
                    enabled: true,
                    inNode: inNode.id,
                    outNode: outNode.id,
                    weight: chance.normal(),
                    innovation: `initial_${inNode.id}_${outNode.id}`
                });
            });
        });
        return connections;
    }

    static randomReducedInitialConnections(sightResolution) {
        let connections = [];

        let reducedOutputs = ['acceleration_angle', 'acceleration_radius'];
        let reducedInputs = [];
        for(let i = 0; i < sightResolution; i++) {
            let pixelId = NeatDna.pixelIdForResolution(i, sightResolution);
            reducedInputs.push('sight_' + pixelId + 'l');
            reducedInputs.push('sight_' + pixelId + 'd');
        }

        reducedInputs.forEach(inNode => {
            reducedOutputs.forEach(outNode => {
                connections.push({
                    enabled: true,
                    inNode: inNode,
                    outNode: outNode,
                    weight: chance.normal(),
                    innovation: `initial_${inNode}_${outNode}`
                });
            });
        });
        return connections;
    }

    static sightInputIds(sightResolution) {
        let ids = [];
        for(let i = 0; i < sightResolution; i++) {
            let pixelId = NeatDna.pixelIdForResolution(i, sightResolution);
            ids.push('sight_' + pixelId + 'h');
            ids.push('sight_' + pixelId + 's');
            ids.push('sight_' + pixelId + 'l');
            ids.push('sight_' + pixelId + 'd');
        }
        return ids;
    }

    static initialNodes(sightResolution) {
        return {
            'in': NeatDna.inputNodeIds(sightResolution).map(id => { return {id:id}; }),
            'out': NeatDna.outputNodeIds().map(id => { return {id:id}; }),
            'hidden':[]
        };
    }

    static inputNodeIds(sightResolution) {
        return ['energy', 'fire_power', 'speed', 'dna_color'].concat(NeatDna.sightInputIds(sightResolution));
    }

    static outputNodeIds() {
        return ['acceleration_angle', 'acceleration_radius', 'shooting_trigger','sexual_desire'];
    }
}

module.exports = NeatDna;
