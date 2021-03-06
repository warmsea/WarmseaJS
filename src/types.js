// @formatter:off
define([
  './core',
  './math'
], function(w) {
  'use strict';
// @formatter:on $HEADER$

  /**
   * Convert an arbitrary value to a boolean value.
   * @param {any} value
   * @return {boolean}
   */
  w.bool = function(value) {
    var v = value;
    if (w.isObject(v) && '__bool__' in v) {
      return w.bool(w.isFunction(v.__bool__) ? v.__bool__() : v.__bool__);
    } else {
      return !!value;
    }
  };

  /**
   * Convert a value to an Integer.
   * @param {any} value
   * @param {number} radix An integer between 2 and 32.
   * @return {number}
   */
  w.i = function(value, radix) {
    var v = value;
    if (v === false) {
      return 0;
    } else if (v === true) {
      return 1;
    } else if (w.isObject(v) && '__int__' in v) {
      return w.i(w.isFunction(v.__int__) ? v.__int__() : v.__int__, radix);
    } else if (!radix && w.isString(v) && (v.indexOf('0x') === 0 || v.indexOf('0X') === 0)) {
      return parseInt(v, 16);
    } else if (!radix || radix === 10) {
      return Math.round(parseFloat(v));
    } else {
      return parseInt(v, radix);
    }
  };

  /**
   * Convert a value to a number.
   * @param {any} valueq
   * @return {number}
   */
  w.f = function(value) {
    var v = value;
    if (v === false) {
      return 0.0;
    } else if (v === true) {
      return 1.0;
    } else if (w.isObject(v) && '__float__' in v) {
      return w.f(w.isFunction(v.__float__) ? v.__float__() : v.__float__);
    } else {
      return parseFloat(v);
    }
  };

  /**
   * Convert a value to a String.
   * @param {any} value
   * @return {string}
   */
  w.str = function(value) {
    var v = value;
    if (w.isObject(v) && '__str__' in v) {
      return w.str(w.isFunction(v.__str__) ? v.__str__() : v.__str__);
    } else {
      return String(value);
    }
  };

  /**
   * Convert a value to an array.
   * @param {any} value
   * @return {Array}
   */
  w.array = function(value) {
    if (w.isArray(value)) {
      return value;
    } else if (value === undefined || value === null) {
      return [];
    } else {
      return [value];
    }
  };

  /**
   * Test whether a value is an safe integer.
   * <p>
   * JavaScript has only one number type, that is 64-bit floating-point number. So we test whether the value is an
   * integer in that system. Which means 1.0 and 1 are both integers, but 9007199254740994 is not an integer because it
   * exceeds the max/min safe integer value a 64-bit floating-point number can present.
   * @param {any} value
   * @return {boolean}
   */
  w.isInt = function(value) {
    // return w.isNumber(value) && value % 1 === 0 &&
    // value >= Number.MIN_SAFE_INTEGER && value <= Number.MAX_SAFE_INTEGER;
    return w.isNumber(value) && value % 1 === 0 && value >= -9007199254740991 && value <= 9007199254740991;
  };

  /**
   * Test whether a value is a plain object.
   * <p>
   * ATTENSION: I'm not pretty sure whether this function works everywhere. Can anyone help me?
   * <p>
   * A plain object is typically an object defined with <code>{}</code> or <code>new Object</code>.
   *
   * @param {any} value
   * @return {boolean}
   */
  w.isPlainObject = function(value) {
    if (!w.isObject(value)) {
      return false;
    }
    try {
      if (!value.constructor.prototype.hasOwnProperty('isPrototypeOf')) {
        return false;
      }
    } catch (e) {
      return false;
    }
    return true;
  };

  // $FOOTER$
  return w;
});
