"use strict";

let request = require('superagent');

class OnlineStorage {

  addDna(dna) {
    request.post('/dna/').send(dna).end();
  }

  addChild(parent, child) {
  }

  getDna() {
    let dna = this._cachedDna;
    this._load();
    if (!dna) return null;
    return dna;
  }

  _load() {
    request.get('/dna/random/').end((err, res) => {
        this._cachedDna = res.body;
    });
  }

}

module.exports = OnlineStorage;

