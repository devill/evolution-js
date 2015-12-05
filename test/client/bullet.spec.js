'use strict';

let assert  = require('assert');

let Bullet = require('../../client/js/bullet');

describe('Bullet', function() {
  describe('#position()', function() {
    it('should return position from constructor', function() {
      let expectedPosition = 123;
      let dummyDirection = 456;
      var dummyWalls = [];
      var bullet = new Bullet(expectedPosition, dummyDirection, dummyWalls);
      assert.equal(expectedPosition, bullet.position());
    });
  });
});

