'use strict';

let expect = require('chai').expect;

let DnaSerializer = require('../../client/js/dna_serializer');
let DnaFactory = require('../../client/js/dna_factory');
require('../../client/js/js_ext.js');
let deepSameProto = require('./deep_proto');

describe('DnaSerializer', function() {

  describe('#deserialize()', function() {
    it('should return same object as before', function() {
      let factory = new DnaFactory('simple_reduced');
      let dna = factory.build();

      let serializer = new DnaSerializer();
      let serialized = serializer.serialize(dna);

      let deserialized = serializer.deserialize(serialized);

      expect(deserialized).to.deep.equal(dna);
      deepSameProto(deserialized, dna);
    });

    it('should return same full simple dna as before', function() {
      let factory = new DnaFactory('simple_full');
      let dna = factory.build();

      let serializer = new DnaSerializer();
      let serialized = serializer.serialize(dna);

      let deserialized = serializer.deserialize(serialized);

      expect(deserialized).to.deep.equal(dna);
      deepSameProto(deserialized, dna);
    });
  });

});

