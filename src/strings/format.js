// @formatter:off
define([
	'../core',
	'../types',
	'../math.js'
], function(w) { 'use strict';
// @formatter:on $HEADER$

  /**
   * Pad a string to a given length by adding leading characters.
   *
   * @param {Number|String} value The value; usually a number.
   * @param {Integer} length The wanted length. If not given, it's 2.
   * @param {Character} leading The leading character. If not given, it's '0'.
   */
  w.pad = function(value, length, leading) {
    value = w.str(value);
    length = w.max(0, length === undefined ? 2 : length);
    leading = (leading || '0')[0];
    return new Array(length - value.length + 1).join(leading) + value;
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
  w.format = function(format /* , args_array | args_map | arg1, arg2, arg3, ...
   * */) {
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
    var i = 0, len = lines.length;
    var startIndex, endIndex;
    var endTag, options = {};
    var dent = Infinity;

    // Find the start line.
    while (i < len) {
      var start = lines[i++].match(/^[ \t]*\/\*<<<(\w+)(?:;(.+)?)?$/);
      if (!start) {
        continue;
      }
      startIndex = i;
      endTag = start[1];
      var optionTags = (start[2] || '').split(/[ \t],[ \t]/);
      for (var j = 0, jLen = optionTags.length; j < jLen; ++j) {
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
    // The default TAB dent count is 4.
    options.tab = w.i(options.tab) || 4;

    var result = [];
    var tabReplacement = w.pad('', options.tab, ' ');

    // Find the end line.
    while (i < len) {
      var line = lines[i];
      if (line.match(new RegExp('^[ \\t]*' + endTag + '\\*\\/$'))) {
        endIndex = i;
        break;
      }++i;
      // Count the dent here.
      if (options.ws === 'outdent') {
        var match = line.match(/^([ \t]*)(.*)$/);
        match[1] = match[1].replace(/\t/g, tabReplacement);
        var cur = match[1].length;
        if (dent > cur) {
          dent = cur;
        }
        result.push(match[1] + match[2]);
      } else {
        result.push(line);
      }
    }
    if (!endIndex) {
      w.error('Format failed: end line missing');
    }

    var wsFunc;
    switch (options.ws) {
      case 'outdent':
        wsFunc = function(s) {
          return s.substring(dent);
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
  FormatConvertor.prototype.convert = function(specifier, key, flags, width, precision, type, position) {
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
      return FormatConvertor.prototype.convertors.int('d', value, flags, width);
    },
    'o': function(value, flags, width /*, precision */ ) {
      return FormatConvertor.prototype.convertors.int('o', value, flags, width);
    },
    'x': function(value, flags, width /*, precision */ ) {
      return FormatConvertor.prototype.convertors.int('x', value, flags, width);
    },
    'X': function(value, flags, width /*, precision */ ) {
      return FormatConvertor.prototype.convertors.int('X', value, flags, width);
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
    'int': function(type, value, flags, width) {
      value = w.i(value);
      var sign = value < 0 ? '-' : (flags['+'] ? '+' : flags[' '] ? ' ' : '');
      var prefix = flags['#'] ? {
      'd' : '',
      'o' : '0',
      'x' : '0x',
      'X' : '0X'
      }[type] : '';
      value = Math.abs(value).toString({
      'd' : 10,
      'o' : 8,
      'x' : 16,
      'X' : 16
      }[type]);
      var gap = w.max(0, width - prefix.length - value.length - sign.length);
      if (flags['-']) {
        return sign + prefix + value + w.pad('', gap, ' ');
      } else if (flags['0']) {
        return sign + prefix + w.pad('', gap, '0') + value;
      } else {
        return w.pad('', gap, ' ') + sign + prefix + value;
      }
    }
  };

  // $FOOTER$
  return w;

});
