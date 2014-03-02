define(function() {
  return function(w) {
    // jshint -W009
    // jshint -W010
    module('Types Module');

    var testTypeChecker = function(name, checker, trueCases, falseCases) {
      test(name, function() {
        var i, v;
        for ( i = 0; i < trueCases.length; ++i) {
          v = trueCases[i];
          ok(checker(v));
        }
        for ( i = 0; i < falseCases.length; ++i) {
          v = falseCases[i];
          ok(!checker(v));
        }
      });
    };
    var trueCases, falseCases;
    trueCases = [0, 1, 0xabcedf, 1.1, 1e3, NaN, Infinity, Number(1)];
    falseCases = [undefined, null, false, true, '123', [], {}];
    testTypeChecker('warmsea.isNumber()', w.isNumber, trueCases, falseCases);
    trueCases = ['', '1', 'a\nb', ( typeof 1), String(1)];
    falseCases = [undefined, null, 123, /a/];
    testTypeChecker('warmsea.isString()', w.isString, trueCases, falseCases);
    trueCases = [[], [1, []], new Array()];
    falseCases = [undefined, null, {}, {
      0: 0,
      1: 1
    }, '[1, 2]'];
    testTypeChecker('warmsea.isArray()', w.isArray, trueCases, falseCases);
    trueCases = [define, testTypeChecker];
    falseCases = [undefined, null, 123, 'a', [], {}];
    testTypeChecker('warmsea.isFunction()', w.isFunction, trueCases, falseCases);
    trueCases = [{}, new Object(), {
      0: 0,
      1: 1
    }];
    falseCases = [undefined, null, 123, 'a', [], new Date()];
    testTypeChecker('warmsea.isPlainObject()', w.isPlainObject, trueCases, falseCases);

    // TODO test the type casters.

    // jshint +W009
    // jshint +W010
  };
});
