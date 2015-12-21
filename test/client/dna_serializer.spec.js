'use strict';

let expect = require('chai').expect;

let DnaSerializer = require('../../client/js/dna_serializer');
let DnaFactory = require('../../client/js/dna_factory');
let deepSameProto = require('./deep_proto');

describe('DnaSerializer', () => {

  describe('#serialize()', () => {
    it('should throw error on unknown class', (done) => {
      let serializer = new DnaSerializer();
      try {
        let serialized = serializer.serialize({_dna: {}});
      } catch (err) {
        expect(err).to.equal('unknown dna type');
        done();
      }
    });
  });

  describe('#deserialize()', () => {
    it('should return same object as before', () => {
      let factory = new DnaFactory('simple_reduced');
      let dna = factory.build();

      let serializer = new DnaSerializer();
      let serialized = serializer.serialize(dna);

      let deserialized = serializer.deserialize(JSON.parse(JSON.stringify(serialized)));

      expect(deserialized).to.deep.equal(dna);
      deepSameProto(deserialized, dna);
    });

    it('should return same full simple dna as before', () => {
      let factory = new DnaFactory('simple_full');
      let dna = factory.build();

      let serializer = new DnaSerializer();
      let serialized = serializer.serialize(dna);

      let deserialized = serializer.deserialize(JSON.parse(JSON.stringify(serialized)));

      expect(deserialized).to.deep.equal(dna);
      deepSameProto(deserialized, dna);
    });

    it('should return same neat dna as before', () => {
      let factory = new DnaFactory('neat');
      let dna = factory.build();

      let serializer = new DnaSerializer();
      let serialized = serializer.serialize(dna);

      let deserialized = serializer.deserialize(JSON.parse(JSON.stringify(serialized)));

      expect(deserialized).to.deep.equal(dna);
      deepSameProto(deserialized, dna);
    });

  });

});

