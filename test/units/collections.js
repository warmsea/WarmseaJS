define(function() {
  return function(w) {
    module('Collection Module');
    test('Queue', function() {
      var q = new w.Queue();
      equal(q.length, 0);
      q.enqueue(1);
      q.enqueue('a');
      equal(q.length, 2);
      equal(q.dequeue(), 1);
      q.enqueue(new Date());
      equal(q.dequeue(), 'a');
      equal(q.length, 1);
      q.clear();
      equal(q.length, 0);
      equal(q.dequeue(), undefined);
      q.allowEmptyDequeue = false;
      throws(function() {
        q.dequeue();
      });
      equal(q.length, 0);
      q.enqueue('a');
      equal(q.length, 1);
      equal(q.peek(), 'a');
      equal(q.length, 1);
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
      ok(pass100);
    });
    test('Queue with validator', function() {
      var q = new w.Queue(function(value) {
        return value < 10;
      });
      q.enqueue(1);
      throws(function() {
        q.enqueue(11);
      });
      equal(q.length, 1);
    });

    test('Stack', function() {
      var s = new w.Stack();
      equal(s.length, 0);
      s.push(new Date());
      s.push(1);
      equal(s.length, 2);
      equal(s.pop(), 1);
      s.push('a');
      equal(s.pop(), 'a');
      equal(s.length, 1);
      s.clear();
      equal(s.length, 0);
      equal(s.pop(), undefined);
      s.allowEmptyPop = false;
      throws(function() {
        s.pop();
      });
      equal(s.length, 0);
      s.push('a');
      equal(s.length, 1);
      equal(s.peek(), 'a');
      equal(s.length, 1);
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
      ok(pass100);
    });
  };
});
