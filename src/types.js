// @formatter:off
define([
	'./core'
], function(w) { 'use strict';
// @formatter:on $HEADER$

  /**
   * Cast a value to a Boolean.
   *
   * @param {?} value A value.
   * @return {Boolean} The boolean value.
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
   * Cast a value to an Integer.
   * <p>
   * I choose {@code w.i} instead of {@code w.int} to void the possible
   * conflict with the future reserved word {@code int}.
   *
   * @param {?} value A value.
   * @return {Integer} The integer value.
   */
  w.i = function(value, radix) {
    var v = value;
    if (w.isObject(v) && '__int__' in v) {
      return w.i(w.isFunction(v.__int__) ? v.__int__() : v.__int__, radix);
    } else if (!radix || radix === 10) {
      return Math.round(parseFloat(v));
    } else {
      return parseInt(v, radix);
    }
  };

  /**
   * Cast a value to a Float.
   * <p>
   * I choose {@code w.f} instead of {@code w.float} to void the possible
   * conflict with the future reserved word {@code float}.
   *
   * @param {?} value A value.
   * @return {Float} The float value.
   */
  w.f = function(value) {
    var v = value;
    if (w.isObject(v) && '__float__' in v) {
      return w.f(w.isFunction(v.__float__) ? v.__float__() : v.__float__);
    } else {
      return parseFloat(v);
    }
  };

  /**
   * Cast a value to a String.
   *
   * @param {?} value A value.
   * @return {Float} The string value.
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
   * Cast a value to an Array.
   *
   * If {@code value} is {@code undefined} or {@code null}, an empty array
   * will be returned.
   *
   * @param {?} value A value.
   * @return {Array} The array value.
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
   * Test whether a value is a number.
   *
   * @param {?} value A value.
   * @return {Boolean} {@code true}, if {@code value} is a string;
   *         {@code false}, otherwise.
   */
  w.isNumber = function(value) {
    return typeof value === 'number';
  };

  /**
   * Test whether a value is a string.
   *
   * @param {?} value A value.
   * @return {Boolean} {@code true}, if {@code value} is a string;
   *         {@code false}, otherwise.
   */
  w.isString = function(value) {
    return typeof value === 'string';
  };

  /**
   * Test whether a value is an array.
   *
   * @param {?} value A value.
   * @return {Boolean} {@code true}, if {@code value} is an array;
   *         {@code false}, otherwise.
   */
  w.isArray = function(value) {
    return value instanceof Array;
  };

  /**
   * Test whether a value is a function.
   *
   * @param {?} value A value.
   * @return {Boolean} {@code true}, if {@code value} is a function;
   *         {@code false}, otherwise.
   */
  w.isFunction = function(value) {
    return typeof value === 'function';
  };

  /**
   * Test whether a value is a plain object.
   * <p>
   * ATTENSION: I'm not pretty sure whether this function works everywhere.
   * Can anyone help me?
   * <p>
   * A plain object is typically an object defined with <code>{}</code> or
   * <code>new Object</code>.
   *
   * @param {?} value A value.
   * @return {Object} {@code true}, if {@code value} is a plain object;
   *         {@code false}, otherwise.
   */
  w.isPlainObject = function(value) {
    if (String(value) !== '[object Object]') {
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

  /**
   * Test whether a value is an object.
   * <p>
   * {@code undefined}, {@code null}, numbers, strings won't pass this test,
   * everything else will.
   * <p>
   * ATTENSION: <code>typeof null</code> is <code>"object"</code>, but
   * <code>warmsea.isObject(null)</code> returns <code>false</code>. Because
   * using a {@code null} object is always error-prone.
   * <p>
   * Arrays pass both {@code warmsea.isArray()} and {@code warmsea.isObject}.
   *
   * @param {?} value A value.
   * @return {Object} {@code true}, if {@code value} is an object;
   *         {@code false}, otherwise.
   */
  w.isObject = function(value) {
    return value !== null && typeof value === 'object';
  };

  // $FOOTER$
  return w;

});
