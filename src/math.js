// @formatter:off
define([
  './core',
], function(w) {
  'use strict';
// @formatter:on $HEADER$

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

  // $FOOTER$
  return w;

});
