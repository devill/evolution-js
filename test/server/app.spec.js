'use strict';

let assert = require('chai').assert;
var expect = require('chai').expect
let app = require('../../server/app');
let request = require("supertest").agent(app.listen());

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

    it('should return stored data on get', function (done) {
      let dummy = {empty:'object', arrayProperty:[1, 2, 3]};
      request.post('/dna/')
        .send(dummy)
        .expect(302)
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
      let dummy = {empty:'object', arrayProperty:[1, 2, 3]};
      request.post('/dna/')
        .send(dummy)
        .expect(302)
        .end(function(err, res) {
          if (err) return done(err);
          
          request.get('/dna/random/')
            .expect(302)
            .expect(function(res) {
              expect(res.headers.location).to.match(/\/dna\/\d{1,10}\//);
            })
            .end(done);
        });
    });

  });

});

