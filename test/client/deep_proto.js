'use strict';
let expect = require('chai').expect;

function deepSameProto(actual, expected) {
  expect(actual.__proto__).to.equal(expected.__proto__);

  if (typeof expected == 'string') {
    return;
  }

  for (let i in expected) {
    deepSameProto(actual[i], expected[i]);
  }
}

module.exports = deepSameProto;

