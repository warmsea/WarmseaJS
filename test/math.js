var assert = require('assert');
var w = require('../dist/warmsea.js');

describe('Math', function() {

  describe('w.cmp()', function() {
    it('should return -1 if a < b', function() {
      assert.equal(w.cmp(1, 2), -1);
    });
    it('should return 1 if a > b', function() {
      assert.equal(w.cmp('ab', 'aa'), 1);
    });
    it('should return 0 if a == b', function() {
      assert.equal(w.cmp(null, undefined), 0);
    });
  });

});
