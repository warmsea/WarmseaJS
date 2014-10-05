var assert = require('assert');
var w = require('../dist/warmsea.js');

describe('Types', function() {

  it('w.bool()', function() {
    var trueCases = [true, 2, '0', [], {}];
    var falseCases = [false, undefined, null, NaN, 0, ''];
    for (var i = 0; i < trueCases.length; ++i) {
      assert.strictEqual(w.bool(trueCases[i]), true);
    }
    for (i = 0; i < falseCases.length; ++i) {
      assert.strictEqual(w.bool(falseCases[i]), false);
    }
  });

  it('w.i()', function() {
    assert.ok(isNaN(w.i(NaN)));
    assert.ok(isNaN(w.i('a')));
    assert.ok(isNaN(w.i('-')));
    assert.ok(isNaN(w.i(undefined)));
    assert.ok(isNaN(w.i(null)));
    assert.ok(isNaN(w.i({})));
    assert.equal(w.i(11), 11);
    assert.equal(w.i(true), 1);
    assert.equal(w.i(false), 0);
    assert.equal(w.i('011'), 11);
    assert.equal(w.i('0xAB'), 171);
    assert.equal(w.i('AB', 16), 171);
    assert.equal(w.i('-9ab'), -9);
    assert.equal(w.i('-9.3'), -9);
    assert.equal(w.i('-9.7'), -10);
  });

  it('w.f()', function() {
    assert.ok(isNaN(w.f(NaN)));
    assert.ok(isNaN(w.f(undefined)));
    assert.ok(isNaN(w.f(null)));
    assert.ok(isNaN(w.f('a')));
    assert.ok(isNaN(w.f('-')));
    assert.ok(isNaN(w.f({})));
    assert.equal(w.f(true), 1.0);
    assert.equal(w.f(false), 0.0);
    assert.equal(w.f(1.7), 1.7);
    assert.equal(w.f('-1.7'), -1.7);
    assert.equal(w.f('-1.7e4'), -1.7e4);
  });

  it('w.str()', function() {
    assert.equal(w.str(NaN), 'NaN');
    assert.equal(w.str(false), 'false');
    assert.equal(w.str('abc'), 'abc');
    assert.equal(w.str(123), '123');
    assert.equal(w.str([1, 2]), '1,2');
  });

  it('w.array()', function() {
    assert.deepEqual(w.array(), []);
    assert.deepEqual(w.array(null), []);
    assert.deepEqual(w.array(1), [1]);
    assert.deepEqual(w.array({}), [
      {}
    ]);
    assert.deepEqual(w.array([]), []);
    assert.deepEqual(w.array([1, 2]), [1, 2]);
  });

  it('w.isInt()', function() {
    var trueCases = [0, 1, -1, 0xabcedf, 1e3, Number(1)];
    var falseCases = [undefined, null, false, true, 1.1, NaN, Infinity,
                      9007199254740994, -9007199254740994, '1', [], {}];
    for (var i = 0; i < trueCases.length; ++i) {
      assert.strictEqual(w.isInt(trueCases[i]), true);
    }
    for (i = 0; i < falseCases.length; ++i) {
      assert.strictEqual(w.isInt(falseCases[i]), false);
    }
  });

  it('w.isPlainObject()', function() {
    var trueCases = [
      {},
      { 0: 0, 1: 1 }
    ];
    var falseCases = [undefined, null, 123, 'a', [], new Date()];
    for (var i = 0; i < trueCases.length; ++i) {
      assert.strictEqual(w.isPlainObject(trueCases[i]), true);
    }
    for (i = 0; i < falseCases.length; ++i) {
      assert.strictEqual(w.isPlainObject(falseCases[i]), false);
    }
  });

});
