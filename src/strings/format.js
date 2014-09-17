define([
  '../core',
  '../types'
], function(w) {
  'use strict';
// $HEADER$

  /**
   * Pad a string to a given length by adding leading characters.
   * @method
   * @param {number|string} value The value; it can be a number.
   * @param {int} length The wanted length. Defaults to 2.
   * @param {string} leading The leading character. Defaults to '0'.
   */
  w.pad = function(value, length, leading) {
    value = w.str(value);
    length = w.max([0, length === undefined ? 2 : length, value.length]);
    leading = w.str(leading || '0');
    var a = new Array(Math.ceil((length - value.length) / leading.length) + 1);
    return a.join(leading).substring(0, length - value.length) + value;
  };

  /**
   * Replace each conversion specifier of a format string with the string representation of a specified object.
   * @method
   * @param {string|function} format the format string.
   * @param {...any|any[]|PlainObject} args Arguments one by one, or a list, or a map.
   * @return {string} The formatted string.
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

      var converter = new FormatConverter(params);

      var specifiers = /%(?:\((.*?)\))?([#|0|\-| |\+]+)?(\d+|\*)?(?:.(\d+|\*))?(?:[h|l|L])?(.)?/g;

      format = format.replace(specifiers, function() {
        return FormatConverter.prototype.convert.apply(converter, arguments);
      });

      return format;
    };

    /**
     * Convert a function into a (multi-line) string.
     * @method
     * @param {function} func
     * @return {string}
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
        for (j = 0; j < optionTags.length; ++j) {
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

      for (i = 0, len = result.length; i < len; ++i) {
        result[i] = wsFunc(result[i]);
      }

      return result.join('\n');
    };

    /**
     * Converter for <code>warmsea.format()</code> function.
     * @class
     * @param {string[]} params
     */
    var FormatConverter = function(params) {
      this.params = params || [];
      this.index = 0;
    };

    /**
     * Convert a specifier to wanted string.
     * @method
     * @param {string} specifier
     * @param {string} key
     * @param {string} flags
     * @param {string} width
     * @param {string} precision
     * @param {string} type
     * @param {string} position
     */
    FormatConverter.prototype.convert = function(specifier, key, flags, width, precision, type, position) {
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
        '+': flags.indexOf('+') >= 0
      };

      return this.convertors[type](value, flags, width, precision);
    };

    /**
     * The converters of each type.
     */
    FormatConverter.prototype.convertors = {
      'd': function(value, flags, width /*, precision */) {
        return FormatConverter.prototype.convertors.ic('d', value, flags, width);
      },
      'o': function(value, flags, width /*, precision */) {
        return FormatConverter.prototype.convertors.ic('o', value, flags, width);
      },
      'x': function(value, flags, width /*, precision */) {
        return FormatConverter.prototype.convertors.ic('x', value, flags, width);
      },
      'X': function(value, flags, width /*, precision */) {
        return FormatConverter.prototype.convertors.ic('X', value, flags, width);
      },
      'f': function(value, flags, width, precision) {
        value = w.f(value);
        var sign = value < 0 ? '-' : (flags['+'] ? '+' : flags[' '] ? ' ' : '');
        value = Math.abs(value).toFixed(precision);
        if (flags['#'] && precision === 0) {
          value += '.';
        }
        var gap = w.max([0, width - value.length - sign.length]);
        if (flags['-']) {
          return sign + value + w.pad('', gap, ' ');
        } else if (flags['0']) {
          return sign + w.pad('', gap, '0') + value;
        } else {
          return w.pad('', gap, ' ') + sign + value;
        }
      },
      's': function(value, flags, width /*, precision */) {
        value = w.str(value);
        var gap = w.max([0, width - value.length]);
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
        var gap = w.max([0, width - prefix.length - value.length - sign.length]);
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

// $FOOTER$
  return w;
});
