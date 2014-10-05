var assert = require('assert');
var w = require('../dist/warmsea.js');

describe('Collections', function() {

  describe('Queue', function() {
    it('w.Queue() should create an empty queue', function() {
      var q = new w.Queue();
      assert.equal(q.length, 0);
    });
    it('#enqueue() and #dequeue()', function() {
      var q = new w.Queue();
      q.enqueue(1);
      q.enqueue('a');
      assert.equal(q.length, 2);
      assert.equal(q.dequeue(), 1);
      q.enqueue(new Date());
      assert.equal(q.dequeue(), 'a');
      assert.equal(q.length, 1);
    });
    it('#clear()', function() {
      var q = new w.Queue();
      q.enqueue(1);
      q.enqueue('a');
      q.clear();
      assert.equal(q.length, 0);
      assert.equal(q.dequeue(), undefined);
    });
    it('#dequeu() with #allowEmptyDequeue set to false', function() {
      var q = new w.Queue();
      q.allowEmptyDequeue = false;
      assert.throws(function() {
        q.dequeue();
      });
      assert.equal(q.length, 0);
    });
    it('#peek()', function() {
      var q = new w.Queue();
      q.enqueue('a');
      assert.equal(q.length, 1);
      assert.equal(q.peek(), 'a');
      assert.equal(q.length, 1);
    });
    it('100 times of enqueue and dequeue', function() {
      var q = new w.Queue();
      var pass100 = true;
      var i = 0;
      q.clear();
      for (i = 0; i < 100; ++i) {
        q.enqueue(i);
      }
      for (i = 0; i < 100; ++i) {
        if (q.dequeue() !== i) {
          pass100 = false;
        }
      }
      assert.ok(pass100);
    });
  });

  describe('Queue with validator', function() {
    it('should forbid invalid values', function() {
      var q = new w.Queue(function(value) {
        return value < 10;
      });
      q.enqueue(1);
      assert.throws(function() {
        q.enqueue(11);
      });
      assert.equal(q.length, 1);
    });
  });

  describe('Stack', function() {
    it('w.Stack() should create an empty stack', function() {
      var s = new w.Stack();
      assert.equal(s.length, 0);
    });
    it('#push() and #pop()', function() {
      var s = new w.Stack();
      s.push(new Date());
      s.push(1);
      assert.equal(s.length, 2);
      assert.equal(s.pop(), 1);
      s.push('a');
      assert.equal(s.pop(), 'a');
      assert.equal(s.length, 1);
    });
    it('#clear()', function() {
      var s = new w.Stack();
      assert.equal(s.pop(), undefined);
      assert.equal(s.length, 0);
    });
    it('#clear() with #allowEmptyPop set to false', function() {
      var s = new w.Stack();
      s.allowEmptyPop = false;
      assert.throws(function() {
        s.pop();
      });
      assert.equal(s.length, 0);
    });
    it('#peek()', function() {
      var s = new w.Stack();
      s.push('a');
      assert.equal(s.length, 1);
      assert.equal(s.peek(), 'a');
      assert.equal(s.length, 1);
    });
    it('100 times of push and pop', function() {
      var s = new w.Stack();
      var pass100 = true;
      var i;
      s.clear();
      for (i = 0; i < 100; ++i) {
        s.push(i);
      }
      for (i = 99; i >= 0; --i) {
        if (s.pop() !== i) {
          pass100 = false;
        }
      }
      assert.ok(pass100);
    });
  });

  describe('Stack with validator', function() {
    it('should forbid invalid values', function() {
      var s = new w.Stack(function(value) {
        return value < 10;
      });
      s.push(1);
      assert.throws(function() {
        s.push(11);
      });
      assert.equal(s.length, 1);
    });
  });

});
