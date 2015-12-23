"use strict";

let SimpleDna = require('./simple_dna');
let NeatDna = require('./neat_dna');
let Matrix = require('./matrix');

class DnaSerializer {

  serialize(dna, mother, father) {
    let serialized = JSON.parse(JSON.stringify(dna._dna));

    if (dna instanceof SimpleDna) { serialized.type = 'simple'; }
    else if (dna instanceof NeatDna) { serialized.type = 'neat'; }
    else { throw 'unknown dna type'; }

    if (mother) { serialized.mother = mother._dna.id; }
    if (father) { serialized.father = father._dna.id; }

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
    if(!dna.nodes) {
        dna.nodes = this._neatNodes(dna.connections);
    }

    return new NeatDna(dna);
  }

  _neatNodes(connections) {
    return {
      'in': this._inNodes(connections),
      'out': this._outNodes(connections),
      'hidden': this._hiddenNodes(connections)
    };
  }

  _inNodes(connections) {
    return connections.filter(c => {
      return !isInt(c.inNode);
    }).map(c => { return c.inNode; }).unique();
  }

  _hiddenNodes(connections) {
    return connections.filter(c => {
      return isInt(c.inNode);
    }).map(c => { return c.inNode; }).unique();
  }

  _outNodes(connections) {
    return connections.filter(c => {
      return !isInt(c.outNode);
    }).map(c => { return c.outNode; }).unique();
  }

}

module.exports = DnaSerializer;

