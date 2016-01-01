"use strict";

let uuid = require('uuid');
let Config = require('./config');

class NeatDnaMixer {
    constructor(primary, secondary) {
        this.primary = primary;
        this.secondary = secondary;

        Config.instance()
            .setIfNull('node_addition_probability', 0.2)
            .setIfNull('edge_addition_probability', 0.4)
            .setIfNull('edge_removal_probability', 0.05)
            .setIfNull('deviation_of_weight_mutation_distribution', 0.5)
            .setIfNull('deviation_of_new_connection_weight_distribution', 15)
            .setIfNull('deviation_of_weight_mutation_for_unpaired_connection_distribution', 15);
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
                        weight: Math.bimodalValueMix(connection.weight, innovation_hash[connection.innovation].weight) + chance.normal({mean:0, dev:Config.instance().get('deviation_of_weight_mutation_distribution')}),
                        innovation: connection.innovation
                    };
                } else {
                    return {
                        enabled: connection.enabled,
                        inNode: connection.inNode,
                        outNode: connection.outNode,
                        weight: Math.bimodalValueMix(connection.weight, chance.normal({mean:0, dev:Config.instance().get('deviation_of_weight_mutation_for_unpaired_connection_distribution')})),
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
        } else if (p < Config.instance().get('node_addition_probability') + Config.instance().get('edge_addition_probability')) {
            return this.evolveTopologyWithNewConnection(network_dna);
        } else if (p < Config.instance().get('node_addition_probability') + Config.instance().get('edge_addition_probability') + Config.instance().get('edge_removal_probability')) {
            return this.evolveTopologyByRemovingConnection(network_dna)
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

    evolveTopologyWithNewConnection(network_dna) {
        let connections = network_dna.connections;

        let outNode = this.findOutCandidate(network_dna);
        let inNode = this.findInCandidate(network_dna, outNode);

        if(this.connected(outNode,inNode, NeatDnaMixer.outConnectionsAsHash(connections))) { return network_dna; }
        if(connections.filter(c => { return c.inNode == inNode && c.outNode == outNode; }).length > 0) { return network_dna; }

        connections.push({
            enabled: true,
            inNode: inNode,
            outNode: outNode,
            weight: chance.normal({mean: 0, dev: Config.instance().get('deviation_of_new_connection_weight_distribution')}),
            innovation: uuid.v4()
        });

        return {
            nodes: network_dna.nodes,
            connections: NeatDnaMixer.topologicalSortConnections(network_dna)
        };
    }

    evolveTopologyByRemovingConnection(network_dna) {
        let index = Math.floor(network_dna.connections.length * Math.random());
        network_dna.connections[index].enabled = false;
        return network_dna;
    }

    findOutCandidate(network_dna) {
        let nodes = network_dna.nodes['hidden'].concat(network_dna.nodes['out']);
        return nodes[Math.floor(Math.random()*nodes.length)]['id'];
    }

    findInCandidate(network_dna) {
        let nodes = network_dna.nodes['in'].concat(network_dna.nodes['hidden']);
        return nodes[Math.floor(Math.random()*nodes.length)]['id'];
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

    static outConnectionsAsHash(connections) {
        let hash = {};
        connections.forEach(c => {
            if(!hash[c.inNode]) { hash[c.inNode] = [] }
            hash[c.inNode].push(c);
        });
        return hash;
    }

    static topologicalSortConnections(network_dna) {
        let hash = NeatDnaMixer.outConnectionsAsHash(network_dna.connections);
        let inNodes = network_dna.nodes['in'];
        let visitedNodes = {};
        let sortedConnections = [];

        function exploreNode(nodeId)
        {
            if(!hash[nodeId] || visitedNodes[nodeId]) { return; }
            visitedNodes[nodeId] = true;
            hash[nodeId].forEach(c => {
                exploreNode(c.outNode);
                sortedConnections.push(c);
            });
        }

        inNodes.forEach(n => {
            exploreNode(n.id);
        });

        return sortedConnections.reverse();
    }

}

module.exports = NeatDnaMixer;