"use strict";

let request = require('superagent');
let Serializer = require('./dna_serializer');

class OnlineStorage {

  constructor() {
    this._cache = [];
  }  

  addDna(dna, mother, father) {
    let serializer = new Serializer();
    let serialized = serializer.serialize(dna, mother, father);
    request.put(`/dna/${serialized.id}/`).send(serialized).end();
  }

  getDna() {
    let dna = this._cache.shift();
    this._load();
    if (!dna) return null;
    this._addLive(dna.id);
    let serializer = new Serializer();
    return serializer.deserialize(dna);
  }

  _load() {
    request.get('/dna/random/').end((err, res) => {
        this._cache.push(res.body);
        if (this._cache.length < 10) {
          this._load();
        }
    });
  }

  _addLive(id) {
    let operation = {operator: '+', operand: 1, field: 'lives'};
    request.patch(`/dna/${id}/`).send(operation).end();
  }

}

module.exports = OnlineStorage;

