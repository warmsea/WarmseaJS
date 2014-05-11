define([
  './core'
], function(w) {
  'use strict';
// $HEADER$

  /**
   * The <code>arrays</code> namespace in <code>warmsea</code>.
   */
  w.arrays = {};

  /**
   * Test if an item is in an array.
   *
   * @param {array} arr The array
   * @param {*} item The item
   * @returns {boolean} true, if the item is in the array; false, if not.
   */
  w.inArray = w.arrays.in = function(arr, item) {
    if (!w.isArray(arr)) {
      return false;
    }
    return _.indexOf(arr, item) >= 0;
  };

  w.each = w.arrays.each = _.each;

  w.map = w.arrays.map = _.map;

  w.range = w.arrays.range = _.range;

// $FOOTER$
  return w;
});
