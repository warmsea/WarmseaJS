define(function() {
  return function(w) {
    module('Arrays Module');
    test('w.range()', function() {
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
