define(function() {
  return function(w) {
    module('Random Module');
    test('Random numbers', function() {
      equal(w.randomInt(), 0);
      equal(w.randomInt(1), 0);
      equal(w.randomInt(-1), 0);
      equal(w.randomInt(2, 3), 2);
      equal(w.randomInt(2, 1), 2);
      equal(w.randomInt(0.8, 1.2), 1);
      ok(w.randomFloat(0.001) < 0.001);
      ok(w.randomFloat(-0.001) > -0.001);
      ok(w.randomFloat(0.001, 0.002) >= 0.001);
      ok(w.randomFloat(0.001, 0.002) < 0.002);
      ok(w.randomFloat(0.002, 0.001) > 0.001);
      ok(w.randomFloat(0.002, 0.001) <= 0.002);
    });
    test('Random strings', function() {
      equal(w.randomString().length, 8);
      equal(w.randomString(4).length, 4);
      equal(w.randomString(-1).length, 0);
      equal(w.randomString(8, 'a'), 'aaaaaaaa');
    });
  };
});
