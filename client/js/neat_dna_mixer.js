"use strict";

let uuid = require('uuid');
let Config = require('./config');

class NeatDnaMixer {
    constructor(primary, secondary) {
        this.primary = primary;
        this.secondary = secondary;
    }

    mix() {
        return this.evolveTopology(this.mixConnections());
    }

    mixConnections() {
        let innovation_hash = {};
        this.secondary.connections.forEach(connection => {
            innovation_hash[connection.innovation] = connection;
        });

        return {
            nodes: this.primary.nodes,
            connections: this.primary.connections.map(connection => {
                if (connection.enabled && innovation_hash[connection.innovation]) {
                    return {
                        enabled: true,
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
            })
        };
    }

    evolveTopology(network_dna) {
        let p = Math.random();
        if(p < Config.instance().get('node_addition_probability')) {
            return this.evolveTopologyWithNewNode(network_dna);
        //} else if (p < Config.instance().get('node_addition_probability') + Config.instance().get('edge_addition_probability')) {
        //    return this.evolveTopologyWithNewConnection(network_dna);
        } else {
            return network_dna;
        }
    }

    evolveTopologyWithNewNode(network_dna) {
        let connections = network_dna['connections'];
        let nodes = this.cloneNodes(network_dna['nodes']);

        let i = Math.floor(Math.random() * connections.length);
        let new_node_index = this._findNextHiddenNodeIndex(network_dna);

        if(!connections[i].enabled) { return network_dna; }

        connections[i].enabled = false;

        nodes.hidden.push({id: new_node_index});

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

        return {
            nodes: nodes,
            connections: connections
        };
    }

    _findNextHiddenNodeIndex(network_dna) {
        if(network_dna['nodes']['hidden'].length == 0) {
            return 0;
        }

        return network_dna['nodes']['hidden'].reduce((max, n) => { return Math.max(parseInt(n.id) || 0, max); }, 0) + 1;
    }

    cloneNodes(nodes) {
        return JSON.parse(JSON.stringify(nodes));
    }

}

module.exports = NeatDnaMixer;