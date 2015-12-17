"use strict";

let request = require('superagent');

class OnlineStorage {

    addDna(dna) {
        request.post('/dna/').send(dna);
    }

    addChild(parent, child) {
        this.dnas[parent._dna.id].children.push(child._dna.id);
    }

    getDna() {
        let dna = this._cachedDna;
        this._load();
        return dna;
    }

    _load() {
        request.get('/dna/1/').end((err, res) => {
            this._cachedDna = res;
        });
    }

}

module.exports = OnlineStorage;

