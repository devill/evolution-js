"use strict";

let SimpleDna = require('./simple_dna');
let Matrix = require('./matrix');

class DnaSerializer {

  serialize(dna) {
    return dna._dna;
  }

  deserialize(dna) {
    dna.first_layer.__proto__ = Matrix.prototype;
    dna.second_layer.__proto__ = Matrix.prototype;
    return new SimpleDna(dna);
  }

}

module.exports = DnaSerializer;

