'use strict';

let expect = require('chai').expect;

let Creature = require('../../client/js/creature');
let Egg = require('../../client/js/egg');
let NeatDna = require('../../client/js/neat_dna');
let SimpleDna = require('../../client/js/simple_dna');

describe('Creature', function() {
  describe('#canTakeEgg()', function() {
    it('should return false for egg having other dna type', function() {
      let neatDna = NeatDna.generateRandomDna();      
      let simpleDna = SimpleDna.generateRandomDna();      

      let creature = new Creature({}, neatDna, {}, 123);
      let egg = new Egg({}, {}, simpleDna);

      expect(creature.canTakeEgg(egg)).to.be.false;
    });
  });
});

