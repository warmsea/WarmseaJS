var assert = require('assert');
var w = require('../dist/warmsea.js');

describe('Debug', function() {

  describe('debuggers', function() {
    it('should be disabled by default', function() {
      assert.ok(!w.debug.enabled('a'));
    });
    it('should be able to created', function() {
      assert.ok(w.isFunction(w.debug('a')));
    });
  });

  beforeEach(function() {
    w.debug.disable('*');
  });

  afterEach(function() {
    w.debug.disable('*');
  });

  describe('w.debug.enable()', function() {
    it('should enable a single debugger with a name', function() {
      w.debug.enable('a:a');
      assert.ok(w.debug.enabled('a:a'));
      assert.ok(!w.debug.enabled('a:b'));
    });
    it('should enable multiple debuggers with a pattern', function() {
      w.debug.enable('b:*');
      assert.ok(w.debug.enabled('b:a'));
      assert.ok(w.debug.enabled('b:b'));
    });
  });

  describe('w.debug.disable()', function() {
    it('should disable a single debugger with a name', function() {
      w.debug.enable('*');
      w.debug.disable('a:a');
      assert.ok(!w.debug.enabled('a:a'));
      assert.ok(w.debug.enabled('a:b'));
    });
    it('should disable multiple debuggers with a pattern', function() {
      w.debug.enable('*');
      w.debug.disable('b:*');
      assert.ok(!w.debug.enabled('b:a'));
      assert.ok(!w.debug.enabled('b:b'));
      assert.ok(w.debug.enabled('c:a'));
    });
  });

});
