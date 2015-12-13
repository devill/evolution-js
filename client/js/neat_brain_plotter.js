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
            let color = (c.weight < 0) ? '#ff0000' : '#0000ff';
            return {from: c.inNode, to: c.outNode, value: Math.abs(c.weight), color: { highlight: color } };
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
                color: {
                    color: '#aaaaaa',
                    highlight: '#0000ff'
                }
            },
            interaction: {
                selectConnectedEdges: true
            },
            layout: {
                hierarchical: {
                    direction: 'LR'
                }
            }
        };
        let network = new vis.Network(this._container, data, options);
    }

}

module.exports = NeatBrainPlotter;