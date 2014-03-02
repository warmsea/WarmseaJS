define(function() {
  return function(w) {
    module('Core Module');
    test('Basic', function() {
      ok(w, 'Core module returns a module.');
    });
  };
});
