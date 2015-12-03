'use strict';

let Bullet = require('../js/bullet');

describe('Bullet', function() {
  describe('#position()', function() {
    it('should return position from constructor', function() {
      let dummyPosition = 123;
      let dummyDirection = 456;
      var bullet = new Bullet(dummyPosition, dummyDirection);
      bullet.position();
    });
  });
});
