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
  };
});
