"use strict";

let SimpleDna = require('./simple_dna');

class DnaSerializer {

  serialize(dna) {
    return JSON.stringify(dna);
  }

  deserialize(json) {
    let dna = JSON.parse(json)
    dna.__proto__ = require('../../client/js/simple_dna').prototype;
    dna._dna.first_layer.__proto__ = require('../../client/js/matrix').prototype;
    dna._dna.second_layer.__proto__ = require('../../client/js/matrix').prototype;
    return dna;
  }

}

module.exports = DnaSerializer;

