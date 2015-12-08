"use strict";

let SimpleDna = require('./simple_dna');

class DnaFactory {
    constructor(mode) {
        this._mode = mode
    }

    build() {
        switch (this._mode) {
            case 'simple_full':
                return SimpleDna.generateRandomDna();

            case 'simple_reduced':
                return SimpleDna.generateRandomDnaWithReducedComplexity();

            default:
                throw "Unknown dna factory mode";
        }

    }
}

module.exports = DnaFactory;