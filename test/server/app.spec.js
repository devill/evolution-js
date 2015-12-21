'use strict';

let assert = require('chai').assert;
var expect = require('chai').expect
let app = require('../../server/app');
let request = require("supertest").agent(app.listen());
let uuid = require('uuid');
let randomUrlMatch = /\/dna\/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}\//;


describe('server', function () {

  describe('/', function() {

    it('should return 200', function (done) {
      request.get('/')
        .expect(200)
        .end(done);
    });

  });

  describe('/unknown-url/', function() {

    it('should return 404', function (done) {
      request.get('/unknown-url/')
        .expect(404)
        .end(done);
    });

  });

  describe('/dna/', function() {

    it('should return 400 on mismatching ids', function (done) {
      let id = uuid.v4();
      let badId = uuid.v4();
      let dummy = {id: id, empty:'object', arrayProperty:[1, 2, 3]};
      request.put(`/dna/${badId}/`)
        .send(dummy)
        .expect(400)
        .end(done);
    });

    it('should return stored data on get', function (done) {
      let id = uuid.v4();
      let dummy = {id: id, empty:'object', arrayProperty:[1, 2, 3]};
      request.put(`/dna/${id}/`)
        .send(dummy)
        .expect(201)
        .end(function(err, res) {
          if (err) return done(err);
          request.get(res.headers.location)
            .expect(200)
            .expect(function(res) {
              expect(res.body).to.deep.equal(res.body, dummy);
            })
            .end(done);
        });
    });

    it('should be able to store parents', function (done) {
      let dummy = {id: uuid.v4(), father: uuid.v4(), mother: uuid.v4(), empty:'object', arrayProperty:[1, 2, 3]};
      request.put(`/dna/${dummy.id}/`)
        .send(dummy)
        .expect(201)
        .end(function(err, res) {
          if (err) return done(err);
          request.get(res.headers.location)
            .expect(200)
            .expect(function(res) {
              expect(res.body).to.deep.equal(res.body, dummy);
            })
            .end(done);
        });
    });

  });

  describe('/dna/random/', function() {

    it('should return link to random dna', function (done) {
      let dummy = {id: uuid.v4(), empty:'object', arrayProperty:[1, 2, 3]};
      request.put(`/dna/${dummy.id}/`)
        .send(dummy)
        .expect(201)
        .end(function(err, res) {
          if (err) return done(err);
          
          request.get('/dna/random/')
            .expect(302)
            .expect(function(res) {
              expect(res.headers.location).to.match(randomUrlMatch);
            })
            .end(done);
        });
    });

  });

  describe('/dna/<uuid>/', function() {

    it('should be able to increment lives with patch', function (done) {
      let dummy = {id: uuid.v4(), empty:'object', lives: 1, arrayProperty:[1, 2, 3]};
      let operation = {field: 'lives', operator: '+', operand: 1};
      request.put(`/dna/${dummy.id}/`)
        .send(dummy)
        .expect(201)
        .end(function(err, res) {
          if (err) return done(err);
          request.patch(res.headers.location)
            .send(operation)
            .expect(200)
            .end(done);
        });
    });

  });

});

