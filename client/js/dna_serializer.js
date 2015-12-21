"use strict";

let SimpleDna = require('./simple_dna');
let NeatDna = require('./neat_dna');
let Matrix = require('./matrix');

class DnaSerializer {

  serialize(dna, mother, father) {
    let serialized = JSON.parse(JSON.stringify(dna._dna));

    if (dna instanceof SimpleDna) { serialized.type = 'simple'; }
    else if (dna instanceof NeatDna) { serialized.type = 'neat'; }
    else { throw new 'unknown dna type'; }

    if (mother) { serialized.mother = mother._dna.id; }
    if (father) { serialized.father = father._dna.id; }

    return serialized;
  }

  deserialize(dna) {
    let deserialized = JSON.parse(JSON.stringify(dna));
    delete deserialized.type;
    delete deserialized.mother;
    delete deserialized.father;
    deserialized.first_layer.__proto__ = Matrix.prototype;
    deserialized.second_layer.__proto__ = Matrix.prototype;
    return new SimpleDna(deserialized);
  }

}

module.exports = DnaSerializer;

