var assert = require('assert');
var w = require('../dist/warmsea.js');

describe('Strings', function() {

  describe('w.pad()', function() {
    it('should pad a number to correct length', function() {
      assert.equal(w.pad(135, 6, 0), '000135');
    });
    it('should pad a string to correct length', function() {
      assert.equal(w.pad('value', 6, '_'), '_value');
      assert.equal(w.pad('value', 2, '_'), 'value');
      assert.equal(w.pad('value', -2, '_'), 'value');
    });
    it('should pad with spaces by default', function() {
      assert.equal(w.pad(135), '135');
      assert.equal(w.pad(135, 6), '   135');
    });
    it('should pad with more than one character', function() {
      assert.equal(w.pad(1, 6, 'ab'), 'ababa1');
      assert.equal(w.pad(1, 3, 'abcd'), 'ab1');
    });
  });

  describe('w.format()', function() {
    it('should return an empty string if nothing is passed', function() {
      assert.equal(w.format(), '');
    });
    it('should return a string if there\'s no conversions', function() {
      assert.equal(w.format(''), '');
      assert.equal(w.format('hello'), 'hello');
      assert.equal(w.format(135), '135');
    });
  });

  describe('w.format() for special characters', function() {
    it('should unescape "%"', function() {
      assert.equal(w.format('%%'), '%');
    });
    it('should unescape "/"', function() {
      assert.equal(w.format('%/'), '/');
    });
    it('should recognise "/"', function() {
      assert.equal(w.format('/'), '/');
    });
  });

  describe('w.format() for strings', function() {
    it('should format simple conversions', function() {
      assert.equal(w.format('%s', 'a'), 'a');
      assert.equal(w.format('%s', 'abc'), 'abc');
      assert.equal(w.format('a%sc', 'b'), 'abc');
      assert.equal(w.format('%s', 135), '135');
      assert.equal(w.format('%s%%', 35), '35%');
    });
    it('should pad strings', function() {
      assert.equal(w.format('%1s', 'abc'), 'abc');
      assert.equal(w.format('%6s', 'abc'), '   abc');
      assert.equal(w.format('%-6s', 'abc'), 'abc   ');
    });
  });

  describe('w.foramt() for numbers', function() {
    it('should format integers', function() {
      assert.equal(w.format('%d', 135), '135');
      assert.equal(w.format('%hd', 135), '135');
      assert.equal(w.format('%ld', 135), '135');
      assert.equal(w.format('%Ld', 135), '135');
    });
    it('should format octal numbers', function() {
      assert.equal(w.format('%o', 29), '35');
      assert.equal(w.format('%#o', 29), '035');
    });
    it('should format hex numbers', function() {
      assert.equal(w.format('%x', 29), '1d');
      assert.equal(w.format('%#x', 29), '0x1d');
      assert.equal(w.format('%X', 29), '1D');
      assert.equal(w.format('%#X', 29), '0X1D');
    });
    it('should format floating-point numbers', function() {
      assert.equal(w.format('%f', 29), '29.000000');
      assert.equal(w.format('%f', -29), '-29.000000');
    });
    it('should pad floating-point numbers', function() {
      assert.equal(w.format('%1.3f', 29), '29.000');
      assert.equal(w.format('%6.1f', 12.3456), '  12.3');
      assert.equal(w.format('%6.2f', 12.3456), ' 12.35');
      assert.equal(w.format('%6.2f', -12.3456), '-12.35');
      assert.equal(w.format('% 6.1f', 12.3456), '  12.3');
      assert.equal(w.format('%+6.1f', 12.3456), ' +12.3');
      assert.equal(w.format('%06.1f', 12.3456), '0012.3');
      assert.equal(w.format('% 06.1f', 12.3456), ' 012.3');
      assert.equal(w.format('%0-6.1f', 12.3456), '12.3  ');
      assert.equal(w.format('%- 6.1f', 12.3456), ' 12.3 ');
    });
  });

  describe('w.format() with multiple conversions', function() {
    it('should format multiple arguments', function() {
      assert.equal(w.format('%s %s %s', 1, 2, 3), '1 2 3');
    });
    it('should format values with mapping keys', function() {
      assert.equal(w.format('%(b)s%(a)s%(b)s', {
        a: 1,
        b: 2
      }), '212');
      assert.equal(w.format('%(year)s%(month)02d%(day)02d', {
        year: 2000,
        month: 9,
        day: 1
      }), '20000901');
    });
  });

  describe('w.format() with multi-line strings', function() {
    it('should format comments as multi-line strings', function() {
      assert.equal(w.format(function() {
        /*<<<EOD
         hello
         EOD*/
      }), 'hello');
      assert.equal(w.format(function() {
        /**<<<EOD;
         hello
         EOD*/
      }), 'hello');
      assert.equal(w.format(function() {
        /*!<<<EOD;
         hello
         EOD*/
      }), 'hello');
      assert.equal(w.format(function() {
        /**!<<<EOD
         hello
         EOD*/
      }), 'hello');
    });
    it('should format conversions', function() {
      assert.equal(w.format(function() {
        /*!<<<ABC
         %s
         ABC*/
      }, 'hello'), 'hello');
      assert.equal(w.format(function() {
        /*!<<<ABC
         %s
         %s
         ABC*/
      }, 'hello', 'world'), 'hello\nworld');
    });
    it('should format with WS-OUTDENT', function() {
      assert.equal(w.format(function() {
        /*<<<EOD;
         hello
            world
         EOD*/
      }), 'hello\n   world');
      assert.equal(w.format(function() {
        /*<<<EOD;WS-OUTDENT
         hello
            world
         EOD*/
      }), 'hello\n   world');
      assert.equal(w.format(function() {
        // jshint -W099
        /*<<<EOD;WS-OUTDENT
         hello
    		two tabs before
         EOD*/
        // jshint +W099
      }), '     hello\n		two tabs before');
    });
    it('should format with WS-KEEP', function() {
      assert.equal(w.format(function() {
        /*<<<EOD;WS-KEEP
         hello
            world
         EOD*/
      }), '         hello\n            world');
    });
    it('should format with WS-TRIM', function() {
      assert.equal(w.format(function() {
        /*<<<EOD;WS-TRIM
         hello
            world
         EOD*/
      }), 'hello\nworld');
    });
  });

});
