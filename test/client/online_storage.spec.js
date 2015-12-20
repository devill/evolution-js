'use strict';

let expect = require('chai').expect;

let DnaFactory = require('../../client/js/dna_factory');
let OnlineStorage = require('../../client/js/online_storage');
let deepSameProto = require('./deep_proto');

describe('OnlineStorage', () => {

  let server;

  beforeEach(function () {
    server = sinon.fakeServer.create();
  });

  afterEach(function () {
    server.restore();
  });

  describe('#getDna()', function() {

    it('should return null if uninitialized', () => {
      let storage = new OnlineStorage();
      expect(storage.getDna()).to.be.null;
    });

    it('should refresh cache through http', function() {
      let factory = new DnaFactory('simple_reduced');
      let dummyDna = factory.build();
      let okResponse = [ 200, { 'Content-type': 'application/json' }, JSON.stringify(dummyDna) ];
      server.respondWith('GET', '/dna/random/', okResponse);
      let storage = new OnlineStorage();
      storage.getDna();
      server.respond();

      let dna = storage.getDna();

      expect(dna).to.deep.equal(dummyDna);
      deepSameProto(dna, dummyDna);
    });

  });

  describe('#addDna()', function() {

    it('should post data through http', function(done) {
      let dummyDna = { dummy: 'dna' };
      server.respondWith('POST', '/dna/', (request) => {
        expect(JSON.parse(request.requestBody)).to.deep.equal(dummyDna);
        done();
      });

      let storage = new OnlineStorage();
      storage.addDna(dummyDna);
      server.respond();
    });

  });

});

