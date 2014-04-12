define(function() {
  return function(w) {
    module('Strings Module');

    var f = w.format;

    test('w.pad()', function() {
      strictEqual(w.pad(1), '01');
      strictEqual(w.pad(135), '135');
      strictEqual(w.pad(135, 6), '000135');
      strictEqual(w.pad(1, 6, 'ab'), 'ababa1');
      strictEqual(w.pad(1, 3, 'abcd'), 'ab1');
      strictEqual(w.pad('value', 6, '_'), '_value');
      strictEqual(w.pad('value', 2, '_'), 'value');
      strictEqual(w.pad('value', -2, '_'), 'value');
    });

    test('String conversions', function() {
      strictEqual(f(''), '');
      strictEqual(f('%%%s', 'a'), '%a');
      strictEqual(f('%/%s', 'a'), '/a');
      strictEqual(f('a%sd', 'a'), 'aad');
      strictEqual(f('/%s', 'abc'), '/abc');
      strictEqual(f('%s', 29), '29');
      strictEqual(f('%s', 'abc'), 'abc');
      strictEqual(f('%/%s', 'abc'), '/abc');
      strictEqual(f('%6s', 'abc'), '   abc');
      strictEqual(f('%-6s', 'abc'), 'abc   ');
    });

    test('Number conversions', function() {
      strictEqual(f('%d', 29), '29');
      strictEqual(f('%hd', 29), '29');
      strictEqual(f('%ld', 29), '29');
      strictEqual(f('%Ld', 29), '29');
      strictEqual(f('%o', 29), '35');
      strictEqual(f('%#o', 29), '035');
      strictEqual(f('%x', 29), '1d');
      strictEqual(f('%#x', 29), '0x1d');
      strictEqual(f('%X', 29), '1D');
      strictEqual(f('%#X', 29), '0X1D');
      strictEqual(f('%f', 29), '29.000000');
      strictEqual(f('%f', -29), '-29.000000');
      strictEqual(f('%1.3f', 29), '29.000');
      strictEqual(f('%6.1f', 12.3456), '  12.3');
      strictEqual(f('%6.2f', 12.3456), ' 12.35');
      strictEqual(f('%6.2f', -12.3456), '-12.35');
      strictEqual(f('% 6.1f', 12.3456), '  12.3');
      strictEqual(f('%+6.1f', 12.3456), ' +12.3');
      strictEqual(f('%06.1f', 12.3456), '0012.3');
      strictEqual(f('% 06.1f', 12.3456), ' 012.3');
      strictEqual(f('%0-6.1f', 12.3456), '12.3  ');
      strictEqual(f('%- 6.1f', 12.3456), ' 12.3 ');
    });

    test('Multi-part conversions', function() {
      strictEqual(f('%s %s %s', 1, 2, 3), '1 2 3');
      strictEqual(f('%s %s %s', [1, 2, 3]), '1 2 3');
    });

    test('Conversions with mapping keys', function() {
      strictEqual(f('%(b)s%(a)s%(b)s', {
        a: 1,
        b: 2
      }), '212');
      strictEqual(f('%(year)s%(month)02d%(day)02d', {
        year: 2014,
        month: 3,
        day: 12
      }), '20140312');
    });

    test('Function comments as multi-line strings', function() {
      strictEqual(f(function() {
        /*<<<EOD
         hello
         EOD*/
      }), 'hello');
      strictEqual(f(function() {
        /*!<<<ABC
         %s
         ABC*/
      }, 'hello'), 'hello');
      strictEqual(f(function() {
        /*<<<EOD;
         hello
         EOD*/
      }), 'hello');
      strictEqual(f(function() {
        /*<<<EOD;
         hello
            world
         EOD*/
      }), 'hello\n   world');
      strictEqual(f(function() {
        /*<<<EOD;WS-OUTDENT
         hello
            world
         EOD*/
      }), 'hello\n   world');
      strictEqual(f(function() {
        // jshint -W099
        /*<<<EOD;WS-OUTDENT
         hello
    		two tabs before
         EOD*/
        // jshint +W099
      }), '     hello\n		two tabs before');
      strictEqual(f(function() {
        /*<<<EOD;WS-KEEP
         hello
            world
         EOD*/
      }), '         hello\n            world');
      strictEqual(f(function() {
        /*<<<EOD;WS-TRIM
         hello
            world
         EOD*/
      }), 'hello\nworld');
    });

  };
});
