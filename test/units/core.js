define(function() {
  return function(w) {
    module('Core Module');
    test('Basic', function() {
      ok(w, 'Core module returns a module.');
    });
    test('object functions', function() {
      deepEqual(w.keys([2, -1, 3]), ['0', '1', '2']);
      deepEqual(w.values([2, -1, 3]), [2, -1, 3]);
      deepEqual(w.keys({
        a: 3,
        c: '5',
        b: {}
      }), ['a', 'c', 'b']);
      deepEqual(w.values({
        a: 3,
        c: '5',
        b: {}
      }), [3, '5', {}]);
      var obj = {};
      obj.a = 3;
      obj.x = 4;
      obj.c = '5';
      obj.b = {};
      delete obj.x;
      deepEqual(w.keys(obj), ['a', 'c', 'b']);
      deepEqual(w.values(obj), [3, '5', {}]);
    });
    test('array functions', function() {
      deepEqual(w.range(0, 3), [0, 1, 2]);
      deepEqual(w.range(3, -3, -2), [3, 1, -1]);
      var arr = [3, 5, 9, 4, 1, 7, 11];
      var res = w.sort(arr);
      // Array.prototype.sort() results [1, 11, 3, 4, 5, 7, 9];
      var expected = [1, 3, 4, 5, 7, 9, 11];
      deepEqual(arr, expected);
      deepEqual(res, expected);
    });
  };
});
