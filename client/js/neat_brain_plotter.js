"use strict";

class NeatBrainPlotter {
    constructor(container, brain) {
        this._container = container;
        this._brain = brain;

    }

    draw() {

        let nodes = this._brain.inNodes().map(n => {
            return { id: n, label: n, level: 0, group: 0};
        });

        nodes = nodes.concat(this._brain.hiddenNodes().map(n => {
            return { id: n, label: n, level: 1, group: 1};
        }));

        nodes = nodes.concat(this._brain.outNodes().map(n => {
            return { id: n, label: n, level: 2, group: 2};
        }));

        let edges = this._brain.connections().map(c => {
            return {from: c.inNode, to: c.outNode, value: c.weight };
        });

        let data = {
            nodes: new vis.DataSet(nodes),
            edges: new vis.DataSet(edges)
        };
        let options = {
            nodes: {
                shape: 'dot',
                size: 10,
                font: {
                    size: 32,
                    color: '#000000'
                },
                borderWidth: 2
            },
            edges: {
                width: 2
            },
            layout: {
                hierarchical: {
                    direction: 'UD'
                }
            }
        };
        let network = new vis.Network(this._container, data, options);
    }

}

module.exports = NeatBrainPlotter;