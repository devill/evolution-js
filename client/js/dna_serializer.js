"use strict";

let SimpleDna = require('./simple_dna');
let NeatDna = require('./neat_dna');
let Matrix = require('./matrix');

class DnaSerializer {

    serialize(dna, mother, father) {
        let serialized = JSON.parse(JSON.stringify(dna._dna));

        if (dna instanceof SimpleDna) {
            serialized.type = 'simple';
        }
        else if (dna instanceof NeatDna) {
            serialized.type = 'neat';
        }
        else {
            throw 'unknown dna type';
        }

        if (mother) {
            serialized.mother = mother._dna.id;
        }
        if (father) {
            serialized.father = father._dna.id;
        }

        return serialized;
    }

    deserialize(dna) {
        let clone = JSON.parse(JSON.stringify(dna));
        let type = clone.type;

        delete clone.type;
        delete clone.mother;
        delete clone.father;

        if (type == 'neat') {
            return this._neatDna(clone);
        }

        return this._simpleDna(clone);
    }

    _simpleDna(dna) {
        dna.first_layer.__proto__ = Matrix.prototype;
        dna.second_layer.__proto__ = Matrix.prototype;
        return new SimpleDna(dna);
    }

    _neatDna(dna) {
        console.log(dna);

        let newNodeId =  this._newNodeIdMap(dna.sight_resolution);
        console.log(newNodeId);
        dna.nodes['in'] = dna.nodes['in'].map(n => {
            if(newNodeId[n.id]) { n.id = newNodeId[n.id]; }
            return n;
        });
        dna.nodes['out'] = dna.nodes['out'].map(n => {
            if(newNodeId[n.id]) { n.id = newNodeId[n.id]; }
            return n;
        });
        dna.connections = dna.connections.map(c => {
            if(newNodeId[c.inNode]) { c.inNode = newNodeId[c.inNode]; }
            if(newNodeId[c.outNode]) { c.outNode = newNodeId[c.outNode]; }
            let innovationId = this._newInnovationId(c.innovation, dna.sight_resolution);
            if(innovationId) { c.innovation = innovationId; }
            return c;
        });

        console.log(dna);

        return new NeatDna(dna);
    }

    _newNodeIdMap(sightResolution) {
        let map = {};
        NeatDna.inputNodeIds(sightResolution).forEach((id, index) => {
            map[`in_${index}`] = id;
        });
        NeatDna.outputNodeIds().forEach((id, index) => {
            map[`out_${index}`] = id;
        });
        return map;
    }

    _newInnovationId(oldId, sightResolution) {
        let regExp = /initial_(\d+)_(\d+)/;
        let match = regExp.exec(oldId);
        if(match) {
            return `initial_${NeatDna.inputNodeIds(sightResolution)[match[1]]}_${NeatDna.outputNodeIds()[match[2]]}`
        } else {
            return null;
        }
    }
}

module.exports = DnaSerializer;

