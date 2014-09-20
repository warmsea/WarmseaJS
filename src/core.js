(function(global) {
  'use strict';
  define([
  ], function() {
// $HEADER$

    /**
     * This will be the <code>warmsea</code> namespace.
     * @namespace
     * @alias warmsea
     */
    var w = _.extend({}, _);

    /**
     * The global object of the executing environment.
     * @type {object}
     */
    w.global = global;

    /**
     * A function that throws an error with the message "Unimplemented".
     */
    w.unimplemented = function() {
      w.error('Unimplemented');
    };

    /**
     * Throws an Error.
     * @method
     * @param {string} msg
     * @throws {Error}
     */
    w.error = w.error || function(msg) {
      throw new Error(msg);
    };

    /**
     * A compare function returns 1, if a &lt; b; -1, if a &gt; b; 0, otherwise.
     * @param {any} a
     * @param {any} b
     * @return {number}
     */
    w.cmp = function(a, b) {
      return a > b ? 1 : a < b ? -1 : 0;
    };

// $FOOTER$
    return w;
  });
})(this);
