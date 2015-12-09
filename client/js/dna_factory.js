"use strict";

let SimpleDna = require('./simple_dna');
let NeatDna = require('./neat_dna');

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

            case 'neat':
                return NeatDna.generateRandomDna();

            default:
                throw "Unknown dna factory mode";
        }

    }
}

module.exports = DnaFactory;