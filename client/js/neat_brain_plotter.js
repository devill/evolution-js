"use strict";

class NeatBrainPlotter {
    constructor(container, brain) {
        this._container = container;
        this._brain = brain;

    }

    draw() {

        let nodeLevels = this._brain.nodeLevels();

        let nodes = this._brain.nodes().map(n => {
            return { id: n.id, label: n.id, level: nodeLevels[n.id], group: nodeLevels[n.id]};
        });

        let edges = this._brain.connections()
            .filter(c => { return c.enabled; })
            .map(c => {
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