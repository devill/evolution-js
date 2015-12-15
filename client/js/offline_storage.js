"use strict";

class OfflineStorage {
    constructor() {
        this.dnas = {};
        this.maxPopulation = 200;
    }

    addDna(dna) {
        this.dnas[dna._dna.id] = { dna:dna, children: [], lives: 1 };
    }

    getDna() {
        let item = this._randomItem();
        item.lives += 1;
        return item.dna;
    }

    addChild(parent, child) {
        this.dnas[parent._dna.id].children.push(child._dna.id);
    }

    size() {
        return Object.keys(this.dnas).length;
    }

    _randomItem() {
        let keys = Object.keys(this.dnas);
        return this.dnas[keys[Math.floor(Math.random() * keys.length)]];
    }

    _fittness(item) {
        return this._grandChildrenCount(item) / item.lives;
    }

    _grandChildrenCount(item) {
        return item.children.reduce((sum, child) => { return sum + this.dnas[child].children.length }, 0);
    }

    reduce() {
        if(Object.keys(this.dnas).length > this.maxPopulation) {
            let dnas_list = Object.values(this.dnas).sort((lhs, rhs) => {
                return this._fittness(lhs) - this._fittness(rhs);
            });
            dnas_list.slice(0, Math.floor(this.maxPopulation/2)).forEach(item => {
                delete this.dnas[item.id];
            });
        }
    }
}

module.exports = OfflineStorage;