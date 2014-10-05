define([
  './core',
  './math'
], function(w) {
  'use strict';
// $HEADER$

  /**
   * Test if an item is in an array.
   *
   * @param {array} arr The array
   * @param {any} item The item
   * @return {boolean} true, if the item is in the array; false, if not.
   */
  w.inArray = function(arr, item) {
    if (!w.isArray(arr)) {
      return false;
    }
    return _.indexOf(arr, item) >= 0;
  };

  /**
   * In-place stable sort.
   *
   * @param {Array} list The array to be sorted.
   * @param {function} cmp The compare function; by default, it's w.cmp。
   * @param {object} context The context for cmp.
   * @return {Array} The sorted array.
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

// $FOOTER$
  return w;
});
