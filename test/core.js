var assert = require('assert');
var w = require('../dist/warmsea.min.js');

describe('Core', function() {

  describe('w.unimplemented()', function() {
    it('should throw an error', function() {
      assert.throws(function() {
        w.unimplemented();
      });
    });
  });

  describe('w.error()', function() {
    it('should throw an error with specified message', function() {
      assert.throws(function() {
        w.error('specified message');
      }, /specified message/);
    });
  });

});
