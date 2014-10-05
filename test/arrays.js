var assert = require('assert');
var w = require('../dist/warmsea.js');

describe('Arrays', function() {

  describe('w.inArray()', function() {
    it('should return true if the elements is in the array', function() {
      assert.strictEqual(w.inArray([1, 'a', false], 1), true);
      assert.strictEqual(w.inArray([1, 'a', false], 'a'), true);
      assert.strictEqual(w.inArray([1, 'a', false], false), true);
    });
    it('should return false if the elements is not in the array', function() {
      assert.strictEqual(w.inArray([1, 'a', false], 2), false);
      assert.strictEqual(w.inArray([1, 'a', false], 'b'), false);
      assert.strictEqual(w.inArray([1, 'a', false], undefined), false);
      assert.strictEqual(w.inArray([1, 'a', false], null), false);
    });
  });

  describe('w.sort()', function() {
    it('should sort an array', function() {
      var a = [3.1, 1.2, 2.3, 3.2, 1.3, 2.1];
      w.sort(a);
      assert.deepEqual(a, [1.2, 1.3, 2.1, 2.3, 3.1, 3.2]);
    });
    it('should sort an array with a compare function', function() {
      var a = [3.1, 1.2, 2.3, 3.2, 1.3, 2.1];
      var cmp = function(a, b) {
        return w.cmp(w.i(a), w.i(b));
      };
      w.sort(a, cmp);
      assert.deepEqual(a, [1.2, 1.3, 2.3, 2.1, 3.1, 3.2]);
    });
  });

});
