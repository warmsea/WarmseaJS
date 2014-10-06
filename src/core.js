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
     * The unmodified underlying underscore object.
     */
    w._ = w.underscore =  _;

    /**
     * The version of this WarmseaJS.
     * @type {string}
     */
    w.VERSION = '$VERSION$';

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
    w.error = function(msg) {
      throw new Error(msg);
    };

// $FOOTER$
    return w;
  });
})(this);
