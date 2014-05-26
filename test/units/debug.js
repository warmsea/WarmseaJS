define(function() {
  return function(w) {
    module('Debug Module');
    test('Enable and disable', function() {
      equal(w.debug.enabled('a'), false);
      w.debug.enable('*');
      equal(w.debug.enabled('a'), true);
      equal(w.debug.enabled('b'), true);
      w.debug.disable('b');
      equal(w.debug.enabled('a'), true);
      equal(w.debug.enabled('b'), false);
    });
  };
});
