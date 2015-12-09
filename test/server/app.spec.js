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
      let dummy = {empty:'object', arrayProperty:[1, 2, 3]};
      request.post('/dna/')
        .send(dummy)
        .expect(302)
        .end(function(err, res) {
          if (err) return done(err);
          request.get(res.headers.location)
            .expect(200)
            .expect(function(res) {
              assert.deepEqual(res.body, dummy);
            })
            .end(done);
        });
    });

  });

});

