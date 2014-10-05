var assert = require('assert');
var w = require('../dist/warmsea.js');

describe('Objects', function() {

  describe('w.deepcopy()', function() {
    it('should return undefined with no value passed', function() {
      assert.equal(w.deepcopy(), undefined);
    });
  });

  describe('w.hideProperties()', function() {
    it('should hide properties', function() {
      var obj = {
        a: 1,
        b: 2
      };
      assert.deepEqual(w.keys(obj), ['a', 'b']);
      w.hideProperties(obj, ['a']);
      assert.deepEqual(w.keys(obj), ['b']);
    });
    it('should keep property values', function() {
      var obj = {
        a: 1,
        b: 2
      };
      w.hideProperties(obj, ['a', 'b']);
      assert.deepEqual(obj.a, 1);
      assert.deepEqual(obj.b, 2);
    });
  });

});
