"use strict";

let NeatBrainPlotter = require('./neat_brain_plotter');

class NeatBrain {
    constructor(dna) {
        this._dna = dna;
    }

    think(input) {
        let nodes = {};
        input.forEach((neuron,index) => {
            nodes[`in_${index}`] = neuron;
        });
        this._dna.connections().forEach(connection => {
            if(connection.enabled) {
                let inValue = Math.sigmoid(nodes[connection.inNode]) || 0;
                let outValue = nodes[connection.outNode] || 0;
                nodes[connection.outNode] = outValue + connection.weight * inValue;
            }
        });
        let result = [];
        for(let i = 0; i < 4; i++) {
            result.push(Math.sigmoid(nodes[`out_${i}`]));
        }
        return result;
    }

    possessed() {
        return false;
    }

    nodes() { return this._dna.nodes(); }
    inNodes() { return this._dna.inNodes(); }
    hiddenNodes() { return this._dna.hiddenNodes(); }
    outNodes() { return this._dna.outNodes(); }

    connections() {
        return this._dna.connections();
    }

    draw() {
        (new NeatBrainPlotter(document.getElementById('brain-viewer'), this)).draw();
    }

}

module.exports = NeatBrain;