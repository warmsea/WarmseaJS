define(function() {
  return function(w) {
    module('Strings Module');

    var f = w.format;

    test('Simple Conversions', function() {
      ok(f('') === '');
      ok(f('a') === 'a');
      ok(f('%d', 1) === '1');
      ok(f('a%db', 1) === 'a1b');
      // TODO and many more tests
    });

    test('Conversions with mapping keys', function() {
      ok(f('%(b)s%(a)s', {
        a: 1,
        b: 2
      }) === '21');
      // TODO
    });

    test('Function comments as multi-line strings', function() {
      ok(f(function() {
        /*<<<EOD
         hello
         EOD*/
      }) === 'hello');
      // TODO and many more tests
    });

  };
});
