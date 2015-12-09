'use strict';

let assert = require('assert');
let app = require('../../server/app');
var request = require("supertest").agent(app.listen());

describe('server', function () {

  describe('/', function() {

    it('should return 200', function (done) {
      request.get('/')
        .expect(200)
        .end(done);
    });

  });

  describe('/dna/', function() {

    it('should return stored data on get', function (done) {
      let dummy = {empty:'object'};
      request.post('/dna/')
        .send('dummy')
        .expect(302)
        .end(function(err, res) {
          if (err) return done(err);
          request.get('/dna/1/')
            .expect(200)
            .expect(function(res) {
              assert.deepEqual(dummy, res.body);
            })
            .end(done);
        });
    });

  });

  describe('/random-dna/', function() {

    it('should return some dna', function (done) {
      request.get('/random-dna/')
        .expect(200)
        .expect(function(res) {
          assert.equal(20, res.body.first_layer.length);
          assert.equal(4, res.body.second_layer.length);
        })
        .end(done);
    });

  });

});

