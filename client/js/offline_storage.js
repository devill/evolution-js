"use strict";

class OfflineStorage {
    constructor() {
        this.dnas = {};
        this.maxPopulation = 50;
    }

    addDna(dna, father, mother) {
        this.dnas[dna._dna.id] = { dna:dna, children: [], parents:[], grand_child_count: 0, lives: 1 };
        if (father) { this._addChild(father, dna); }
        if (mother) { this._addChild(mother, dna); }
    }

    getDna() {
        if (this._size() < 20) {
            return null;
        }
        let item = this._randomItem();
        item.lives += 1;
        return item.dna;
    }

    _addChild(parent, child) {
        if(this.dnas[child._dna.id]) {
            this.dnas[child._dna.id].parents.push(parent._dna.id);
        }
        if(this.dnas[parent._dna.id]) {
            this.dnas[parent._dna.id].children.push(child._dna.id);
            this.dnas[parent._dna.id].parents.forEach(parent => {
                if (this.dnas[parent]) {
                    this.dnas[parent].grand_child_count += 1;
                }
            });
        }
    }

    _size() {
        return Object.keys(this.dnas).length;
    }

    _randomItem() {
        let keys = Object.keys(this.dnas);
        return this.dnas[keys[Math.floor(Math.random() * keys.length)]];
    }

    _fitness(item) {
        return (item.grand_child_count + item.children.length) / item.lives;
    }

    reduce() {

        if(Object.keys(this.dnas).length > this.maxPopulation) {
            console.log('Reducing');
            let dnas_list = Object.values(this.dnas).sort((lhs, rhs) => {
                return this._fitness(lhs) - this._fitness(rhs);
            });
            dnas_list.slice(0, Math.floor(this.maxPopulation/2)).forEach(item => {
                console.log(`Deleted: ${item.dna._dna.id} (fittnes: ${this._fitness(item)})`);
                delete this.dnas[item.dna._dna.id];
            });
            dnas_list.slice(Math.floor(this.maxPopulation/2)).forEach(item => {
                console.log(`Kept: ${item.dna._dna.id} (fittnes: ${this._fitness(item)})`);
            });
        }
    }
}

module.exports = OfflineStorage;
