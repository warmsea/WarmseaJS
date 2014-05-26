(function(global) {
  'use strict';
  define([
  ], function() {
// $HEADER$

    /**
     * This will be the global <code>warmsea</code> namespace.
     *
     * @namespace
     * @alias warmsea
     */
    var w = {};

    /**
     * The global object.
     */
    w.global = global;

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
      w.error('Unimplemented');
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
    w.keys = _.keys;

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
    w.values = _.values;

// $FOOTER$
    return w;
  });
})(this);
