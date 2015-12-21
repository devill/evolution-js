"use strict";

let request = require('superagent');
let Serializer = require('./dna_serializer');

class OnlineStorage {

  addDna(dna, mother, father) {
    let serializer = new Serializer();
    let serialized = serializer.serialize(dna, mother, father);
    request.put(`/dna/${serialized.id}/`).send(serialized).end();
  }

  addChild(parent, child) {
  }

  getDna() {
    let dna = this._cachedDna;
    this._cachedDna = null;
    this._load();
    if (!dna) return null;
    this._addLive(dna.id);
    let serializer = new Serializer();
    return serializer.deserialize(dna);
  }

  _load() {
    request.get('/dna/random/').end((err, res) => {
        this._cachedDna = res.body;
    });
  }

  _addLive(id) {
    let operation = {operator: '+', operand: 1, field: 'lives'};
    request.patch(`/dna/${id}/`).send(operation).end();
  }

}

module.exports = OnlineStorage;

