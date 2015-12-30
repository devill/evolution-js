"use strict";

let NeatBrainPlotter = require('./neat_brain_plotter');

class NeatBrain {
    constructor(dna) {
        this._dna = dna;
    }

    think(input) {
        let nodes = JSON.parse(JSON.stringify(input));

        this._dna.connections().forEach(connection => {
            if(connection.enabled) {
                let inValue = Math.sigmoid(nodes[connection.inNode]) || 0;
                let outValue = nodes[connection.outNode] || 0;
                nodes[connection.outNode] = outValue + connection.weight * inValue;
            }
        });
        let result = {};
        this._dna.outNodes().forEach(n => {
            result[n.id] = Math.sigmoid(nodes[n.id]);
        });
        return result;
    }

    possessed() {
        return false;
    }

    nodeLevels() { return this._dna.nodeLevels(); }
    nodes() { return this._dna.nodes(); }

    connections() {
        return this._dna.connections();
    }

    draw() {
        (new NeatBrainPlotter(document.getElementById('brain-viewer'), this)).draw();
    }

}

module.exports = NeatBrain;