'use strict';

let expect = require('chai').expect;

let DnaFactory = require('../../client/js/dna_factory');
let OnlineStorage = require('../../client/js/online_storage');
let deepSameProto = require('./deep_proto');

describe('OnlineStorage', () => {

  let server;
  let factory = new DnaFactory('simple_reduced');
  let dummyDna, dummyMother, dummyFather;

  beforeEach(() => {
    server = sinon.fakeServer.create();
    server.respondImmediately = true;
    dummyDna = factory.build();
    dummyMother = factory.build();
    dummyFather = factory.build();
  });

  afterEach(() => {
    server.restore();
  });

  describe('#getDna()', () => {

    it('should return null if uninitialized', () => {
      let storage = new OnlineStorage();
      expect(storage.getDna()).to.be.null;
    });

    it('should refresh cache through http', () => {
      let response = JSON.parse(JSON.stringify(dummyDna._dna));
      response.type = 'simple';
      let okResponse = [ 200, { 'Content-type': 'application/json' }, JSON.stringify(response)];
      server.respondWith('GET', '/dna/random/', okResponse);
      let storage = new OnlineStorage();
      storage.getDna();

      let dna = storage.getDna();

      expect(dna).to.deep.equal(dummyDna);
      deepSameProto(dna, dummyDna);
    });

    it('should increment lives of dna through http when downloading', (done) => {
      let okResponse = [ 200, { 'Content-type': 'application/json' }, JSON.stringify(dummyDna._dna) ];
      server.respondWith('GET', '/dna/random/', okResponse);
      server.respondWith('PATCH', `/dna/${dummyDna._dna.id}/`, (request) => {
        expect(JSON.parse(request.requestBody)).to.deep.equal({
          operator: '+',
          field: 'lives',
          operand: 1
        });
        done();
      });
      let storage = new OnlineStorage();
      storage.getDna();
      storage.getDna();
    });

  });

  describe('#addDna()', () => {

    it('should post data through http', (done) => {
      let shouldSent = JSON.parse(JSON.stringify(dummyDna._dna));
      shouldSent.type = 'simple';
      server.respondWith('PUT', `/dna/${dummyDna._dna.id}/`, (request) => {
        expect(JSON.parse(request.requestBody)).to.deep.equal(shouldSent);
        done();
      });

      let storage = new OnlineStorage();
      storage.addDna(dummyDna);
    });

    it('should post data through http for neat dna', (done) => {
      let factory = new DnaFactory('neat');
      let dummyNeatDna = factory.build();
      let shouldSent = JSON.parse(JSON.stringify(dummyNeatDna._dna));
      shouldSent.type = 'neat';
      server.respondWith('PUT', `/dna/${dummyNeatDna._dna.id}/`, (request) => {
        expect(JSON.parse(request.requestBody)).to.deep.equal(shouldSent);
        done();
      });

      let storage = new OnlineStorage();
      storage.addDna(dummyNeatDna);
    });

    it('should post data with parents through http', (done) => {
      let shouldSent = JSON.parse(JSON.stringify(dummyDna._dna));
      shouldSent.mother = dummyMother._dna.id;
      shouldSent.father = dummyFather._dna.id;
      shouldSent.type = 'simple';
      server.respondWith('PUT', `/dna/${dummyDna._dna.id}/`, (request) => {
        expect(JSON.parse(request.requestBody)).to.deep.equal(shouldSent);
        done();
      });

      let storage = new OnlineStorage();
      storage.addDna(dummyDna, dummyMother, dummyFather);
    });

  });

});

