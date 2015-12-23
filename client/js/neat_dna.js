"use strict";

let uuid = require('uuid');

let NeatBrain = require('./neat_brain');
let BaseDna = require('./base_dna');
let NeatDnaMixer = require('./neat_dna_mixer');
let Config = require('./config');

class NeatDna extends BaseDna {
    constructor(dna) {
        super(dna);
        Config.instance()
            .setIfNull('node_addition_probability', 0.4)
            .setIfNull('edge_addition_probability', 0.5);
    }

    buildBrain() {
        return new NeatBrain(this);
    }

    mix(other_dna) {
        if(getParameterByName('refactor')) {
            let this_is_primary = Math.random() < 0.5;
            let primary = (this_is_primary) ? this._dna.connections : other_dna._dna.connections;
            let secondary = (!this_is_primary) ? this._dna.connections : other_dna._dna.connections;

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

        return new NeatDna({
            id: uuid.v4(),
            connections: this.evolveConnections(other_dna),
            egg_color: this._mixEggColor(other_dna),
            color: this._mixColor(other_dna),
            eye_size: this._mixEyeSize(other_dna),
            sight_resolution: this.sightResolution()
        });
    }

    evolveConnections(other_dna) {
        return this.evolveTopology(this.mixConnections(other_dna));
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
                return {
                    enabled:true,
                    inNode: connection.inNode,
                    outNode: connection.outNode,
                    weight: Math.bimodalValueMix(connection.weight, innovation_hash[connection.innovation].weight) + chance.normal(),
                    innovation: connection.innovation
                };
            } else {
                return {
                    enabled: connection.enabled,
                    inNode: connection.inNode,
                    outNode: connection.outNode,
                    weight: connection.weight + chance.normal(),
                    innovation: uuid.v4()
                };
            }
        });
    }

    evolveTopology(connections) {
        let p = Math.random();
        if(p < Config.instance().get('node_addition_probability')) {
            return this.evolveTopologyWithNewNode(connections)
        } else if (p < Config.instance().get('node_addition_probability') + Config.instance().get('edge_addition_probability')) {
            return this.evolveTopologyWithNewConnection(connections)
        } else {
            return connections;
        }
    }

    evolveTopologyWithNewConnection(connections) {

        let outNode = this.findOutCandidate(connections);
        let inNode = this.findInCandidate(connections, outNode);

        if(this.connected(outNode,inNode, this.connectionsAsHash(connections))) { return connections; }
        if(connections.filter(c => { return c.inNode == inNode && c.outNode == outNode; }).length > 0) { return connections; }

        connections.push({
            enabled: true,
            inNode: inNode,
            outNode: outNode,
            weight: chance.normal(),
            innovation: uuid.v4()
        });

        return this.topologicalSortConnections(connections);
    }

    findOutCandidate(connections) {
        let nodes = this.outNodes(connections).concat(this.hiddenNodes(connections));
        return nodes[Math.floor(Math.random()*nodes.length)];
    }

    findInCandidate(connections) {
        let nodes = this.inNodes(connections).concat(this.hiddenNodes(connections));
        return nodes[Math.floor(Math.random()*nodes.length)];
    }


    connections() {
        return this._dna.connections;
    }

    connectionsAsHash(connections) {
        let hash = {};
        connections.forEach(c => {
            if(!hash[c.inNode]) { hash[c.inNode] = [] }
            hash[c.inNode].push(c);
        });
        return hash;
    }

    connected(inIndex,outIndex,connectionsHash) {
        if(inIndex == outIndex) { return true; }
        if(!connectionsHash[inIndex]) { return false; }

        for(let i = 0; i < connectionsHash[inIndex].length; ++i) {
            if(this.connected(connectionsHash[inIndex][i].outNode, outIndex, connectionsHash)) {
                return true;
            }
        }
        return false;
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

    topologicalSortConnections(connections) {
        let hash = this.connectionsAsHash(connections);
        let inNodes = this.inNodes(connections);
        let visitedNodes = {};
        let sortedConnections = [];

        function exploreNode(nodeId)
        {
            if(!hash[nodeId] || visitedNodes[nodeId]) { return; }
            hash[nodeId].forEach(c => {
                exploreNode(c.outNode);
                sortedConnections.push(c);
            });
            visitedNodes[nodeId] = true;
        }

        inNodes.forEach(n => {
            exploreNode(n);
        });

        return connections;
    }

    evolveTopologyWithNewNode(connections) {
        let i = Math.floor(Math.random() * connections.length);
        let new_node_index = this.findNextNodeIndex(connections);

        if(!connections[i].enabled) { return connections; }

        connections[i].enabled = false;

        connections.push({
            enabled: true,
            inNode: connections[i].inNode,
            outNode: new_node_index,
            weight: 1,
            innovation: uuid.v4()
        });

        connections.push({
            enabled: true,
            inNode: new_node_index,
            outNode: connections[i].outNode,
            weight: connections[i].weight,
            innovation: uuid.v4()
        });

        return connections;
    }

    findNextNodeIndex(connections) {
        let i = 0;
        connections.forEach(c => {
            if(isInt(c.inNode)) {
                i = Math.max(c.inNode,i);
            }
        });
        return i + 1;
    }

    static generateRandomDna() {
        let sightResolution = 3;
        return new NeatDna({
            id: uuid.v4(),
            nodes: NeatDna.initialNodes(sightResolution),
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

    static initialNodes(sightResolution) {
        let nodes = { 'in': [], 'out':[], 'hidden':[] };
        for(let i = 0; i < 4+sightResolution*4; i++) {
            nodes.in.push(`in_${i}`);
        }
        for(let j = 0; j < 4; j++) {
            nodes.out.push(`out_${j}`);
        }
        return nodes;
    }


}

module.exports = NeatDna;
