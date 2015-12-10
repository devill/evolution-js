"use strict";

let NeatBrain = require('./neat_brain');
let BaseDna = require('./base_dna');

class NeatDna extends BaseDna {
    constructor(dna) {
        super(dna);
        this.node_addition_probability = 0.01;
        this.edge_addition_probability = 0.05;
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
                    weight: this._bimodalValueMix(connection.weight, innovation_hash[connection.innovation].weight),
                    innovation: connection.innovation
                };
            } else {
                return {
                    enabled: connection.enabled,
                    inNode: connection.inNode,
                    outNode: connection.outNode,
                    weight: connection.weight + Math.normal()/25,
                    innovation: Math.uuid()
                };
            }
        });
    }

    evolveTopology(connections) {
        let p = Math.random();
        if(p < this.node_addition_probability) {
            return this.evolveTopologyWithNewNode(connections)
        } else if (p < this.node_addition_probability + this.edge_addition_probability) {
            return this.evolveTopologyWithNewConnection(connections)
        } else {
            return connections;
        }
    }

    evolveTopologyWithNewConnection(connections) {
        let outNode = this.findOutCandidate(connections);
        let inNode = this.findInCandidate(connections, outNode);

        connections.push({
            enabled: true,
            inNode: outNode,
            outNode: inNode,
            weight: Math.normal()*2,
            innovation: Math.uuid()
        });

        return this.topologicalSortConnections(connections);
    }

    findOutCandidate(connections) {
        return this.outNodes(connections).concat(this.hiddenNodes());
    }

    findInCandidate(connections, outIndex) {
        let nodes = this.inNodes(connections).concat(this.hiddenNodes());
        let inIndex = 0;
        do {
            inIndex = nodes[Math.floor(Math.random()*nodes.length)];
        } while(!this.connected(outIndex,inIndex, this.connectionsAsHash(connections)));

        return inIndex;
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
        for(let i = 0; i < connectionsHash[inIndex].length; ++i) {
            if(this.connected(connectionsHash[inIndex][i].outNode, outIndex, connectionsHash)) {
                return true;
            }
        }
        return false;
    }

    inNodes(connections) {
        return connections.filter(c => {
            return !isInt(c.inNode);
        });
    }

    hiddenNodes(connections) {
        return connections.filter(c => {
            return isInt(c.inNode);
        });
    }

    outNodes(connections) {
        return connections.filter(c => {
            return !isInt(c.outNode);
        });
    }

    topologicalSortConnections(connections) {
        let hash = connectionsAsHash(connections);
        let inNodes = this.inNodes(connections);
        let visitedNodes = {};
        let sortedConnections = [];

        function exploreNode(nodeId)
        {
            if(visitedNodes[nodeId]) { return; }
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

        connections[i].enabled = false;

        connections.push({
            enabled: true,
            inNode: connections[i].inNode,
            outNode: new_node_index,
            weight: 1,
            innovation: Math.uuid()
        });

        connections.push({
            enabled: true,
            inNode: new_node_index,
            outNode: connections[i].outNode,
            weight: connections[i].weight,
            innovation: Math.uuid()
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
                    weight: Math.normal()*2,
                    innovation: Math.uuid()
                });
            }
        }
        return connections;
    }


}

module.exports = NeatDna;