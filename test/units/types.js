define(function() {
  return function(w) {
    // jshint -W009
    // jshint -W010
    // jshint -W053

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

    test('warmsea.bool()', function() {
      var trueCases = [true, 2, '0', [], {}, new Object(), new Boolean(false)];
      var falseCases = [false, undefined, null, NaN, 0, ''];
      for (var i = 0; i < trueCases.length; ++i) {
        strictEqual(w.bool(trueCases[i]), true);
      }
      for ( i = 0; i < falseCases.length; ++i) {
        strictEqual(w.bool(falseCases[i]), false);
      }
    });

    test('warmsea.i()', function() {
      ok(isNaN(w.i(NaN)));
      ok(isNaN(w.i('a')));
      ok(isNaN(w.i('-')));
      ok(isNaN(w.i(undefined)));
      ok(isNaN(w.i(null)));
      ok(isNaN(w.i(false)));
      ok(isNaN(w.i({})));
      equal(w.i(11), 11);
      equal(w.i(true), 1);
      equal(w.i('011'), 11);
      equal(w.i('0xAB'), 171);
      equal(w.i('AB', 16), 171);
      equal(w.i('-9ab'), -9);
      equal(w.i('-9.3'), -9);
      equal(w.i('-9.7'), -10);
    });

    test('warmsea.f()', function() {
      ok(isNaN(w.f(NaN)));
      ok(isNaN(w.f(undefined)));
      ok(isNaN(w.f(null)));
      ok(isNaN(w.f('a')));
      ok(isNaN(w.f('-')));
      ok(isNaN(w.f(false)));
      ok(isNaN(w.f({})));
      equal(w.f(true), 1.0);
      equal(w.f(1.7), 1.7);
      equal(w.f('-1.7'), -1.7);
      equal(w.f('-1.7e4'), -1.7e4);
    });

    test('warmsea.str()', function() {
      equal(w.str(NaN), 'NaN');
      equal(w.str(false), 'false');
      equal(w.str('abc'), 'abc');
      equal(w.str(123), '123');
      equal(w.str([1, 2]), '1,2');
    });

    test('warmsea.array()', function() {
      deepEqual (w.array(), []);
      deepEqual(w.array(null), []);
      deepEqual(w.array(1), [1]);
      deepEqual(w.array({}), [{}]);
      deepEqual(w.array([]), []);
      deepEqual(w.array([1, 2]), [1, 2]);
    });

    test('"__*__" style type cast', function() {
      var obj = new Object();
      obj.__bool__ = 9;
      obj.__int__ = 9;
      obj.__float__ = 9;
      obj.__str__ = 9;
      strictEqual(w.bool(obj), true);
      equal(w.i(obj), 9);
      equal(w.f(obj), 9.0);
      equal(w.str(obj), '9');
      var temp = function() {
        return 9;
      };
      obj.__bool__ = temp;
      obj.__int__ = temp;
      obj.__float__ = temp;
      obj.__str__ = temp;
      strictEqual(w.bool(obj), true);
      equal(w.i(obj), 9);
      equal(w.f(obj), 9.0);
      equal(w.str(obj), '9');
    });

    // jshint +W009
    // jshint +W010
    // jshint +W053
  };
});
