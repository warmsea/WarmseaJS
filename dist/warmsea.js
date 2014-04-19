/*!
 * warmsea JavaScript Library v0.3.0
 *
 * Copyright 2009, 2014 Su Su
 * Released under the MIT license
 *
 * Date: 2014-04-19
 */

(function(global) {
  'use strict';

  /**
   * This will be the global <code>warmsea</code> namespace.
   *
   * @namespace
   * @alias warmsea
   */
  var w = {};

  /**
   * A function with no operation.
   */
  w.noop = function() {
  };

  /**
   * An identity function.
   *
   * @param {?} x A value.
   * @return {?} <code>x</code> itself.
   */
  w.identity = function(x) {
    return x;
  };

  /**
   * An unimplemented function that throws an error.
   */
  w.unimplemented = function() {
    var msg = 'Unimplemented function.';
    if (w.isFunction(w.error)) {
      w.error(msg);
    } else {
      throw new Error(msg);
    }
  };

  /**
   * Throws an Error.
   *
   * @param {String} msg The error message.
   * @throws {Error} An error with a message.
   */
  w.error = function(msg) {
    throw new Error(msg);
  };

  /**
   * The default compare function
   *
   * @param {?} a A value.
   * @param {?} b Another value.
   * @return {Number} 1, if a &gt; b; -1, if a &lt; b; 0, otherwise.
   */
  w.cmp = function(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
  };

  /**
   * Returns the keys of an object.
   *
   * Samples:
   *
   * Code: w.keys(['a', 'b', 'c']);
   * Result: ["0", "1", "2"]
   *
   * Code: w.keys({a:1, b:2, c:3});
   * Result: ["a", "b", "c"]
   *
   * @param {Object} obj An Object.
   * @return {Array} The keys of the object.
   */
  w.keys = function(obj) {
    var keys = [];
    for (var k in obj) {
      if (obj.hasOwnProperty(k)) {
        keys.push(k);
      }
    }
    return keys;
  };

  /**
   * Returns the values of an object.
   * No deep copy. Equal sign (=) is used to cope the value.
   *
   * Samples:
   *
   * Code: w.values(['a', 'b', 'c']);
   * Result: ["a", "b", "c"]
   *
   * Code: w.values({a:1, b:'hello', c:[1,2,3]});
   * Result: [1, "hello", [1, 2, 3]]
   *
   * @param {Object} obj An object.
   * @return {Array} The values of the object.
   */
  w.values = function(obj) {
    var values = [];
    for (var k in obj) {
      if (obj.hasOwnProperty(k)) {
        values.push(obj[k]);
      }
    }
    return values;
  };

  /**
   * Generate an array.
   * This is the port of the Python range().
   */
  w.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var i = 0, len = Math.max(Math.ceil((stop - start) / step), 0);
    var range = new Array(len);
    while (i < len) {
      range[i++] = start;
      start += step;
    }

    return range;
  };

  /**
   * In-place stable sort.
   *
   * @param {Array} arr The array to be sorted.
   * @param {Function} cmp The compare function; by default, it's w.cmp。
   * @return {Array} The sorted array.
   */
  w.sort = function(arr, cmp) {
    cmp = cmp || w.cmp;
    var i;
    var len = arr.length;
    for ( i = 0; i < len; ++i) {
      // _wssi stands for Warmsea Stable Sort Id
      arr[i]._wssi = i;
    }
    arr.sort(function(a, b) {
      return cmp(a, b) || a._wssi - b._wssi;
    });
    for ( i = 0; i < len; ++i) {
      delete arr[i]._wssi;
    }
    return arr;
  };

  /**
   * Return the smallest value.
   *
   * @param {Function} cmp A optional compare function.
   * @param {?} values Values as an array or a list of arguments.
   * @return {?} The smallest value.
   */
  w.min = function(/* [cmp,] (values_array | value1,value2,value3,...) */) {
    if (!arguments.length) {
      return undefined;
    }
    var cmp, values;
    if (w.isFunction(arguments[0])) {
      cmp = arguments[0];
      values = Array.prototype.slice.call(arguments, 1);
    } else {
      cmp = w.cmp;
      values = Array.prototype.slice.call(arguments, 0);
    }
    if (!values.length) {
      return undefined;
    }
    var data = w.isArray(values[0]) ? values[0] : values;
    var min = data[0];
    for (var i = 1, len = data.length; i < len; ++i) {
      if (cmp(min, data[i]) > 0) {
        min = data[i];
      }
    }
    return min;
  };

  /**
   * Return the largest value.
   *
   * @param {Function} cmp A optional compare function.
   * @param {?} values Values as an array or a list of arguments.
   * @return {?} The largest value.
   */
  w.max = function(/* [cmp,] (values_array | value1,value2,value3,...) */) {
    if (!arguments.length) {
      return undefined;
    }
    var cmp, values;
    if (w.isFunction(arguments[0])) {
      cmp = arguments[0];
      values = Array.prototype.slice.call(arguments, 1);
    } else {
      cmp = w.cmp;
      values = Array.prototype.slice.call(arguments, 0);
    }
    if (!values.length) {
      return undefined;
    }
    var data = w.isArray(values[0]) ? values[0] : values;
    var max = data[0];
    for (var i = 1, len = data.length; i < len; ++i) {
      if (cmp(max, data[i]) < 0) {
        max = data[i];
      }
    }
    return max;
  };

  /**
   * Cast a value to a Boolean.
   *
   * @param {?} value A value.
   * @return {Boolean} The boolean value.
   */
  w.bool = function(value) {
    var v = value;
    if (w.isObject(v) && '__bool__' in v) {
      return w.bool(w.isFunction(v.__bool__) ? v.__bool__() : v.__bool__);
    } else {
      return !!value;
    }
  };

  /**
   * Cast a value to an Integer.
   *
   * @param {?} value A value.
   * @return {Integer} The integer value.
   */
  w.i = function(value, radix) {
    var v = value;
    if (v === true) {
      return 1;
    } else if (w.isObject(v) && '__int__' in v) {
      return w.i(w.isFunction(v.__int__) ? v.__int__() : v.__int__, radix);
    } else if (!radix && w.isString(v) && //
    (v.indexOf('0x') === 0 || v.indexOf('0X') === 0)) {
      return parseInt(v, 16);
    } else if (!radix || radix === 10) {
      return Math.round(parseFloat(v));
    } else {
      return parseInt(v, radix);
    }
  };

  /**
   * Cast a value to a Float.
   *
   * @param {?} value A value.
   * @return {Float} The float value.
   */
  w.f = function(value) {
    var v = value;
    if (v === true) {
      return 1.0;
    } else if (w.isObject(v) && '__float__' in v) {
      return w.f(w.isFunction(v.__float__) ? v.__float__() : v.__float__);
    } else {
      return parseFloat(v);
    }
  };

  /**
   * Cast a value to a String.
   *
   * @param {?} value A value.
   * @return {String} The string value.
   */
  w.str = function(value) {
    var v = value;
    if (w.isObject(v) && '__str__' in v) {
      return w.str(w.isFunction(v.__str__) ? v.__str__() : v.__str__);
    } else {
      return String(value);
    }
  };

  /**
   * Cast a value to an Array.
   *
   * If <code>value</code> is <code>undefined</code> or <code>null</code>, an
   * empty array will be returned.
   *
   * @param {?} value A value.
   * @return {Array} The array value.
   */
  w.array = function(value) {
    if (w.isArray(value)) {
      return value;
    } else if (value === undefined || value === null) {
      return [];
    } else {
      return [value];
    }
  };

  /**
   * Test whether a value is a number.
   *
   * @param {?} value A value.
   * @return {Boolean} <code>true</code>, if <code>value</code> is a string;
   *         <code>false</code>, otherwise.
   */
  w.isNumber = function(value) {
    return typeof value === 'number';
  };

  /**
   * Test whether a value is a string.
   *
   * @param {?} value A value.
   * @return {Boolean} <code>true</code>, if <code>value</code> is a string;
   *         <code>false</code>, otherwise.
   */
  w.isString = function(value) {
    return typeof value === 'string';
  };

  /**
   * Test whether a value is an array.
   *
   * @param {?} value A value.
   * @return {Boolean} <code>true</code>, if <code>value</code> is an array;
   *         <code>false</code>, otherwise.
   */
  w.isArray = function(value) {
    return value instanceof Array;
  };

  /**
   * Test whether a value is a function.
   *
   * @param {?} value A value.
   * @return {Boolean} <code>true</code>, if <code>value</code> is a function;
   *         <code>false</code>, otherwise.
   */
  w.isFunction = function(value) {
    return typeof value === 'function';
  };

  /**
   * Test whether a value is a plain object.
   * <p>
   * ATTENSION: I'm not pretty sure whether this function works everywhere.
   * Can anyone help me?
   * <p>
   * A plain object is typically an object defined with <code>{}</code> or
   * <code>new Object</code>.
   *
   * @param {?} value A value.
   * @return {Object} <code>true</code>, if <code>value</code> is a plain
   *         object; <code>false</code>, otherwise.
   */
  w.isPlainObject = function(value) {
    if (String(value) !== '[object Object]') {
      return false;
    }
    try {
      if (!value.constructor.prototype.hasOwnProperty('isPrototypeOf')) {
        return false;
      }
    } catch (e) {
      return false;
    }
    return true;
  };

  /**
   * Test whether a value is an object.
   * <p>
   * <code>undefined</code>, <code>null</code>, numbers, strings won't pass
   * this test, everything else will.
   * <p>
   * ATTENSION: <code>typeof null</code> is <code>"object"</code>, but
   * <code>warmsea.isObject(null)</code> returns <code>false</code>. Because
   * using a <code>null</code> object is always error-prone.
   * <p>
   * Arrays pass both <code>warmsea.isArray()</code> and
   * <code>warmsea.isObject()</code>.
   *
   * @param {?} value A value.
   * @return {Object} <code>true</code>, if <code>value</code> is an object;
   *         <code>false</code>, otherwise.
   */
  w.isObject = function(value) {
    return value !== null && typeof value === 'object';
  };

  /**
   * Pad a string to a given length by adding leading characters.
   *
   * @param {Number|String} value The value; usually a number.
   * @param {Integer} length The wanted length. If not given, it's 2.
   * @param {Character} leading The leading character. If not given, it's '0'.
   */
  w.pad = function(value, length, leading) {
    value = w.str(value);
    length = w.max(0, length === undefined ? 2 : length, value.length);
    leading = w.str(leading || '0');
    var a = new Array(Math.ceil((length - value.length) / leading.length) + 1);
    return a.join(leading).substring(0, length - value.length) + value;
  };

  /**
   * Format a string.
   * <p>
   * It is similar to the <code>sprintf()</code> in the C language.
   * <p>
   * A conversion specifiers is of the following format: <br>
   * %[mapping_key][flags][width][.precision][length]conversion_type
   * <p>
   * A mapping key is a parenthesized string (for example, <code>(year)</code>,
   * parenthesis is not allowed inside it).
   * <p>
   * Available flags are listed below:<br>
   * <table><thead>
   * <tr>
   * <th>Flag
   * <th>Meaning</th>
   * <tbody>
   * <tr>
   * <td><code>#</code>
   * <td>Use the "alternate form".
   * <tr>
   * <td><code>0</code>
   * <td>zero padding before a number.
   * <tr>
   * <td><code>-</code>
   * <td>(Overrides "0" flag.) The converted value is left adjusted.
   * <tr>
   * <td><code>(a space)</code>
   * <td>A space will precede a positive number or an empty string produced by
   * a signed conversion.
   * <tr>
   * <td><code>+</code>
   * <td>(Overrides "space" flag.) A sign character ("+" or "-") will precede a
   * number.</td>
   * </table>
   * <p>
   * "width" is an integer indicates the minimum field width, or an "*". If it
   * is an "*", the width is the next <code>arg</code>, and the value to
   * convert comes after the width and the optional precision.
   * <p>
   * "precision" is a dot (".") followed by an integer indicates the precision,
   * or an "*". If it is an "*", the precision is the next <code>arg</code>,
   * and the value to convert comes after the precision. The precision
   * determines the number of digits after the decimal point and defaults to 6.
   * <p>
   * "length" is one of "h", "l" or "L". But it is ignored as it is not
   * neccessary for JavaScript.
   * <p>
   * Available conversion types are listed below:<br>
   * <table><thead>
   * <tr>
   * <th>Conversion
   * <th>Meaning
   * <th>Note</th>
   * <tbody>
   * <tr>
   * <td><code>d</code>
   * <td>Decimal.
   * <td>
   * <tr>
   * <td><code>o</code>
   * <td>Octal.
   * <td>"Alternate form" adds leading zero ("0").
   * <tr>
   * <td><code>x</code>
   * <td>Lowercase hexadecimal.
   * <td>"Alternate form" adds leading "0x".
   * <tr>
   * <td><code>X</code>
   * <td>Uppercase hexadecimal.
   * <td>"Alternate form" adds leading "0X".
   * <tr>
   * <td><code>f</code>
   * <td>Floating point decimal format.
   * <td>"Alternate form" ensures a decimal point, even if no digits follow it.
   * <tr>
   * <td><code>s</code>
   * <td>String
   * <td>
   * <tr>
   * <td><code>%</code>
   * <td>A "%" character.
   * <td>
   * <tr>
   * <td><code>/</code>
   * <td>A "/" character.</td>
   * </table>
   * <p>
   * All integer values are converted with <code>warmsea.int()</code>. And
   * <code>warmsea.float()</code> for floats, <code>warmsea.string()</code>
   * for strings.
   *
   * @param {String|Function} format the format string.
   */
  w.format = (function(w) {

    var f = function(format /* , args_array | args_map | arg1, arg2,  ... */) {
      if (!arguments.length) {
        return '';
      }
      format = func2str(arguments[0]);

      var params;
      if (w.isArray(arguments[1])) {
        params = arguments[1];
      } else if (w.isPlainObject(arguments[1])) {
        params = arguments[1];
      } else {
        params = Array.prototype.slice.call(arguments, 1);
      }

      var convertor = new FormatConvertor(params);

      var specifiers = /%(?:\((.*?)\))?([#|0|\-| |\+]+)?(\d+|\*)?(?:.(\d+|\*))?(?:[h|l|L])?(.)?/g;

      format = format.replace(specifiers, function() {
        return FormatConvertor.prototype.convert.apply(convertor, arguments);
      });

      return format;
    };

    /**
     * Convert a function into a (multi-line) string.
     *
     * @see warmsea#format
     */
    var func2str = function(func) {
      if (w.isString(func)) {
        return func;
      } else if (!w.isFunction(func)) {
        return w.str(func);
      }

      var lines = w.str(func).split(/\r?\n/);
      var i = 0, j = 0, len = lines.length;
      var startIndex, endIndex;
      var endTag, options = {};
      var dent = null;

      // Find the start line.
      while (i < len) {
        var start = lines[i++].match(/^[ \t]*\/\*!?<<<(\w+)(?:;(.+)?)?$/);
        if (!start) {
          continue;
        }
        startIndex = i;
        endTag = start[1];
        var optionTags = (start[2] || '').split(/[ \t]*,[ \t]*/);
        for ( j = 0; j < optionTags.length; ++j) {
          var tag = optionTags[j].toLowerCase().split(/-(.*)/);
          if (tag[0]) {
            options[tag[0]] = tag[1] || true;
          }
        }
        break;
      }
      if (!startIndex) {
        w.error('Format failed: start line missing');
      }

      // The default WS option is "OUTDENT".
      options.ws = options.ws || 'outdent';

      var result = [];

      // Find the end line.
      while (i < len) {
        var line = lines[i];
        if (line.match(new RegExp('^[ \\t]*' + endTag + '\\*\\/'))) {
          endIndex = i;
          break;
        }
        i++;
        // Count the dent here.
        if (options.ws === 'outdent') {
          var match = line.match(/^([ \t]*).*$/);
          var cur = match[1];
          if (dent === null) {
            dent = cur;
          } else {
            j = 0;
            while (j < dent.length && j < cur.length && dent[j] === cur[j]) {
              j++;
            }
            if (dent.length > j) {
              dent = dent.substring(0, j);
            }
          }
        }
        result.push(line);
      }
      if (!endIndex) {
        w.error('Format failed: end line missing');
      }

      var wsFunc;
      switch (options.ws) {
        case 'outdent':
          wsFunc = function(s) {
            return s.substring(dent.length);
          };
          break;
        case 'keep':
          wsFunc = w.identity;
          break;
        case 'trim':
          wsFunc = function(s) {
            return s.trim();
          };
          break;
        default:
          w.error('Format failed: Unsupported WS option');
      }

      for ( i = 0, len = result.length; i < len; ++i) {
        result[i] = wsFunc(result[i]);
      }

      return result.join('\n');
    };

    /**
     * Convertor for <code>format()</code> function.
     *
     * @see warmsea#format
     */
    var FormatConvertor = function(params) {
      this.params = params || [];
      this.index = 0;
    };

    /**
     * Convert a specifier into wanted string.
     *
     * @see warmsea#format
     */
    FormatConvertor.prototype.convert = function(
        specifier, key, flags, width, precision, type, position) {
      if (type === undefined) {
        w.error('format incomplete specifier "%s" in position (%d).', specifier, position);
      }
      if (!this.convertors.hasOwnProperty(type)) {
        w.error('format unsupported type "%s" in position (%d)', type, position);
      }

      var next;

      if (width === '*') {
        next = this.index++;
        if (!this.params.hasOwnProperty(next)) {
          w.error('format key error "%s" in position (%d).', key, position);
        }
        width = this.params[next];
      }
      width = width || 0;

      if (precision === '*') {
        next = this.index++;
        if (!this.params.hasOwnProperty(next)) {
          w.error('format key error "%s" in position (%d).', key, position);
        }
        precision = this.params[next];
      }
      if (precision === undefined) {
        precision = 6;
      }

      if (type === '%' || type === '/') {
        return type;
      }

      key = key === undefined ? this.index++ : key;
      if (!this.params.hasOwnProperty(key)) {
        w.error('format key error "%s" in position (%d).', key, position);
      }
      var value = this.params[key];

      flags = flags || '';
      flags = {
        '#': flags.indexOf('#') >= 0,
        '0': flags.indexOf('0') >= 0 && flags.indexOf('-') < 0,
        '-': flags.indexOf('-') >= 0,
        ' ': flags.indexOf(' ') >= 0 && flags.indexOf('+') < 0,
        '+': flags.indexOf('+') >= 0,
      };

      return this.convertors[type](value, flags, width, precision);
    };

    /**
     * The convertors of each type.
     */
    FormatConvertor.prototype.convertors = {
      'd': function(value, flags, width /*, precision */ ) {
        return FormatConvertor.prototype.convertors.ic('d', value, flags, width);
      },
      'o': function(value, flags, width /*, precision */ ) {
        return FormatConvertor.prototype.convertors.ic('o', value, flags, width);
      },
      'x': function(value, flags, width /*, precision */ ) {
        return FormatConvertor.prototype.convertors.ic('x', value, flags, width);
      },
      'X': function(value, flags, width /*, precision */ ) {
        return FormatConvertor.prototype.convertors.ic('X', value, flags, width);
      },
      'f': function(value, flags, width, precision) {
        value = w.f(value);
        var sign = value < 0 ? '-' : (flags['+'] ? '+' : flags[' '] ? ' ' : '');
        value = Math.abs(value).toFixed(precision);
        if (flags['#'] && precision === 0) {
          value += '.';
        }
        var gap = w.max(0, width - value.length - sign.length);
        if (flags['-']) {
          return sign + value + w.pad('', gap, ' ');
        } else if (flags['0']) {
          return sign + w.pad('', gap, '0') + value;
        } else {
          return w.pad('', gap, ' ') + sign + value;
        }
      },
      's': function(value, flags, width /*, precision */ ) {
        value = w.str(value);
        var gap = w.max(0, width - value.length);
        if (flags['-']) {
          return value + w.pad('', gap, ' ');
        } else {
          return w.pad('', gap, ' ') + value;
        }
      },
      '%': function() {
        this.index--;
        return '%';
      },
      '/': function() {
        this.index--;
        return '/';
      },
      'ic': function(type, value, flags, width) {
        value = w.i(value);
        var sign = value < 0 ? '-' : (flags['+'] ? '+' : flags[' '] ? ' ' : '');
        var prefix = flags['#'] ? {
          'd': '',
          'o': '0',
          'x': '0x',
          'X': '0X'
        }[type] : '';
        value = Math.abs(value).toString({
          'd': 10,
          'o': 8,
          'x': 16,
          'X': 16
        }[type]);
        var gap = w.max(0, width - prefix.length - value.length - sign.length);
        var result = '';
        if (flags['-']) {
          result = sign + prefix + value + w.pad('', gap, ' ');
        } else if (flags['0']) {
          result = sign + prefix + w.pad('', gap, '0') + value;
        } else {
          result = w.pad('', gap, ' ') + sign + prefix + value;
        }
        if (type === 'X') {
          result = result.toUpperCase();
        }
        return result;
      }
    };

    return f;

  })(w);


  /**
   * Choose a random floating-point number in the range of [0.0, 1.0).
   *
   * @return {Number} A floating-point number in the range of [0.0, 1.0).
   */
  w.random = function() {
    return Math.random();
  };

  /**
   * Choose a random integer in the range of [start, end).
   * <p>
   * If end is not passed, the range will be [0, start).
   *
   * @param {Integer} start start of the range.
   * @param {Integer} end end of the range.
   * @return {Integer} A random integer in the range.
   */
  w.randomInt = function(start, stop) {
    if (start === undefined && stop === undefined) {
      return 0;
    } else if (stop === undefined) {
      stop = start;
      start = 0;
    }
    start = Math.ceil(start);
    stop = Math.ceil(stop);
    if (start < stop) {
      return start + Math.floor((stop - start) * Math.random());
    } else if (start > stop) {
      return start - Math.floor((start - stop) * Math.random());
    } else {
      w.error('No integer in the range of [' + start + ', ' + stop + ')');
    }
  };

  /**
   * Choose a random floating-point number in the range of [start, end).
   * <p>
   * If end is not passed, the range will be [0, start).
   *
   * @param {Integer} start start of the range.
   * @param {Integer} end end of the range.
   * @return {Integer} A random number in the range.
   */
  w.randomFloat = function(start, stop) {
    if (start === undefined && stop === undefined) {
      return Math.random();
    } else if (stop === undefined) {
      return Math.random() * start;
    } else if (start < stop) {
      return start + Math.random() * (stop - start);
    } else if (start > stop) {
      return start - Math.random() * (start - stop);
    } else {
      w.error('No number in the range of [' + start + ', ' + stop + ')');
    }
  };

  /**
   * Generate a random string.
   * <p>
   * By default, the string may contain some of the these characters:
   * <code>abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789</code>.
   * And by default, the string has 8 characters.
   *
   * @param {Integer} length The length of the string. Default to 8.
   * @param {String} allowedChars The allowed characters in the string.
   */
  w.randomString = function(length, allowedChars) {
    if (length === undefined) {
      length = 8;
    } else {
      length = w.i(length);
      length = w.max(length, 0);
    }
    if (allowedChars === undefined) {
      allowedChars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    } else {
      allowedChars = w.str(allowedChars);
    }
    var res = '';
    var len = allowedChars.length;
    for (var i = 0; i < length; i++) {
      res += allowedChars[Math.floor(Math.random() * len)];
    }
    return res;
  };


  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = w;
  } else if ( typeof define === 'function' && define.amd) {
    define(function() {
      return w;
    });
  } else {
      global.warmsea = w;
  }

})(this);
