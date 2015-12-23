"use strict";

let uuid = require('uuid');

class NeatDnaMixer {
    constructor(primary, secondary) {
        this.primary = primary;
        this.secondary = secondary;
    }

    mix() {
        return this.mixConnections();
    }

    mixConnections() {
        let innovation_hash = {};
        this.secondary.forEach(connection => {
            innovation_hash[connection.innovation] = connection;
        });

        return {
            nodes: this.primary.nodes,
            connections: this.primary.map(connection => {
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
}

module.exports = NeatDnaMixer;