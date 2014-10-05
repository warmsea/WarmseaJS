var assert = require('assert');
var w = require('../dist/warmsea.js');

describe('Random', function() {

  it('#randomInt()', function() {
    assert.equal(w.randomInt(), 0);
    assert.equal(w.randomInt(1), 0);
    assert.equal(w.randomInt(-1), 0);
    assert.equal(w.randomInt(2, 3), 2);
    assert.equal(w.randomInt(2, 1), 2);
    assert.equal(w.randomInt(0.8, 1.2), 1);
  });

  it('#randomFloat()', function() {
    assert.ok(w.randomFloat(0.001) < 0.001);
    assert.ok(w.randomFloat(-0.001) > -0.001);
    assert.ok(w.randomFloat(0.001, 0.002) >= 0.001);
    assert.ok(w.randomFloat(0.001, 0.002) < 0.002);
    assert.ok(w.randomFloat(0.002, 0.001) > 0.001);
    assert.ok(w.randomFloat(0.002, 0.001) <= 0.002);
  });

  it('#randomString()', function() {
    assert.equal(w.randomString().length, 8);
    assert.equal(w.randomString(4).length, 4);
    assert.equal(w.randomString(-1).length, 0);
    assert.equal(w.randomString(8, 'a'), 'aaaaaaaa');
  });

});
