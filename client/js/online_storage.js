"use strict";

let request = require('superagent');
let Serializer = require('./dna_serializer');

class OnlineStorage {

  addDna(dna, mother, father) {
    let serializer = new Serializer();
    let serialized = serializer.serialize(dna, mother, father);
    request.post('/dna/').send(serialized).end();
  }

  addChild(parent, child) {
  }

  getDna() {
    let dna = this._cachedDna;
    this._cachedDna = null;
    this._load();
    if (!dna) return null;
    let serializer = new Serializer();
    return serializer.deserialize(dna);
  }

  _load() {
    request.get('/dna/random/').end((err, res) => {
        this._cachedDna = res.body;
    });
  }

}

module.exports = OnlineStorage;

