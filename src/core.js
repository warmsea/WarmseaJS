define([
], function() {
  'use strict';
// $HEADER$

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
   * @param {*} x A value.
   * @returns{*} <code>x</code> itself.
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
   * @function
   * @param {string} msg The error message.
   * @throws {Error} An error with a message.
   */
  w.error = w.error || function(msg) {
    throw new Error(msg);
  };

  /**
   * The default compare function
   *
   * @param {*} a A value.
   * @param {*} b Another value.
   * @returns{number} 1, if a &gt; b; -1, if a &lt; b; 0, otherwise.
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
   * @param {object} obj An Object.
   * @returns{Array} The keys of the object.
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
   * @param {object} obj An object.
   * @returns{Array} The values of the object.
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
   * @param {function} cmp The compare function; by default, it's w.cmp。
   * @return {Array} The sorted array.
   */
  w.sort = function(arr, cmp) {
    cmp = cmp || w.cmp;
    var i;
    var len = arr.length;
    for (i = 0; i < len; ++i) {
      // _wssi stands for Warmsea Stable Sort Id
      arr[i]._wssi = i;
    }
    arr.sort(function(a, b) {
      return cmp(a, b) || a._wssi - b._wssi;
    });
    for (i = 0; i < len; ++i) {
      delete arr[i]._wssi;
    }
    return arr;
  };

// $FOOTER$
  return w;
});
