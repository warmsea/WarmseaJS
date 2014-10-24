define([
  './core',
  './math'
], function(w) {
  'use strict';
// $HEADER$

  /**
   * Tests if an item is in an array.
   *
   * @param {Array} arr The array
   * @param {*} item The item
   * @returns {Boolean} true, if the item is in the array; false, if not.
   */
  w.inArray = function(arr, item) {
    if (!w.isArray(arr)) {
      return false;
    }
    return w.indexOf(arr, item) >= 0;
  };

  /**
   * In-place stable sort.
   *
   * @param {Array} list The array to be sorted.
   * @param {Function} cmp The compare function; by default, it's w.cmp。
   * @param {Object} context The context for cmp.
   * @returns {Array} The sorted array.
   */
  w.sort = function(list, cmp, context) {
    cmp = cmp || w.cmp;
    var i;
    var len = list.length;
    for (i = 0; i < len; ++i) {
      // _$wssi stands for Warmsea Stable Sort Id
      // I hope no one is using it.
      list[i]._$wssi = i;
    }
    list.sort(function(a, b) {
      return cmp.call(context, a, b) || w.cmp(a._$wssi - b._$wssi);
    });
    for (i = 0; i < len; ++i) {
      delete list[i]._$wssi;
    }
    return list;
  };

  /**
   * Returns a (stably) sorted (shallow) copy of an array.
   *
   * @param {Array} list The array to be sorted.
   * @param {Function} cmp The compare function; by default, it's w.cmp.
   * @param {Object} context The context for cmp.
   * @returns {Array} A sorted copy.
   */
  w.sorted = function(list, cmp, context) {
    var copy = w.clone(list);
    w.sort(copy, cmp, context);
    return copy;
  };

// $FOOTER$
  return w;
});
