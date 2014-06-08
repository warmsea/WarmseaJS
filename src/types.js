// @formatter:off
define([
  './core',
  './math'
], function(w) {
  'use strict';
// @formatter:on $HEADER$

  /**
   * Cast a value to a Boolean.
   *
   * @param {*} value A value.
   * @return {boolean} The boolean value.
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
   *
   * @param {*} value A value.
   * @param {number} radix An integer between 2 and 32.
   * @return {number} The integer value.
   */
  w.i = function(value, radix) {
    var v = value;
    if (v === true) {
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
   * Cast a value to a Float.
   *
   * @param {*} value A value.
   * @return {number} The float value.
   */
  w.f = function(value) {
    var v = value;
    if (v === true) {
      return 1.0;
    } else if (w.isObject(v) && '__float__' in v) {
      return w.f(w.isFunction(v.__float__) ? v.__float__() : v.__float__);
    } else {
      return parseFloat(v);
    }
  };

  /**
   * Cast a value to a String.
   *
   * @param {*} value A value.
   * @return {string} The string value.
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
   * <p>
   * If <code>value</code> is <code>undefined</code> or <code>null</code>, an empty array will be returned.
   *
   * @param {*} value A value.
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
   * Test whether a value is NaN.
   *
   * @method
   * @param {*} A value.
   * @return {boolean} <code>true</code>, if <code>value</code> is NaN; <code>false</code>, otherwise.
   */
  w.isNaN = _.isNaN;

  /**
   * Test whether a value is a number.
   *
   * @method
   * @param {*} value A value.
   * @return {boolean} <code>true</code>, if <code>value</code> is a string; <code>false</code>, otherwise.
   */
  w.isNumber = _.isNumber;

  /**
   * Test whether a value is an integer.
   * <p>
   * JavaScript has only one number type, that is 64-bit floating-point number. So we test whether the value is an
   * integer in that system. Which means 1.0 and 1 are both integers, but 9007199254740994 is not an integer because it
   * exceeds the max integer value a 64-bit floating-point number can present (±2^53).
   *
   * @param {*} value A value.
   * @return {boolean} <code>true</code>, if <code>value</code> is a string; <code>false</code>, otherwise.
   */
  w.isInt = function(value) {
    return typeof value === 'number' && value % 1 === 0 && value >= -9007199254740992 && value <= 9007199254740992;
  };

  /**
   * Test whether a value is a string.
   *
   * @method
   * @param {*} value A value.
   * @return {boolean} <code>true</code>, if <code>value</code> is a string; <code>false</code>, otherwise.
   */
  w.isString = _.isString;

  /**
   * Test whether a value is an array.
   *
   * @method
   * @param {*} value A value.
   * @return {boolean} <code>true</code>, if <code>value</code> is an array; <code>false</code>, otherwise.
   */
  w.isArray = _.isArray;

  /**
   * Test whether a value is a function.
   *
   * @method
   * @param {*} value A value.
   * @return {boolean} <code>true</code>, if <code>value</code> is a function; <code>false</code>, otherwise.
   */
  w.isFunction = _.isFunction;

  /**
   * Test whether a value is a plain object.
   * <p>
   * ATTENSION: I'm not pretty sure whether this function works everywhere. Can anyone help me?
   * <p>
   * A plain object is typically an object defined with <code>{}</code> or <code>new Object</code>.
   *
   * @param {*} value A value.
   * @return {boolean} <code>true</code>, if <code>value</code> is a plain object; <code>false</code>, otherwise.
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
   * <code>undefined</code>, <code>null</code>, numbers, strings won't pass this test, everything else will.
   * <p>
   * ATTENSION: <code>typeof null</code> is <code>"object"</code>, but <code>warmsea.isObject(null)</code> returns
   * <code>false</code>. Because using a <code>null</code> object is always error-prone.
   * <p>
   * Arrays pass both <code>warmsea.isArray()</code> and <code>warmsea.isObject()</code>.
   *
   * @method
   * @param {*} value A value.
   * @return {boolean} <code>true</code>, if <code>value</code> is an object; <code>false</code>, otherwise.
   */
  w.isObject = _.isObject;

  /**
   * Deep copy a value (to target).
   *
   * @param {*} value
   * @param {?*} target
   * @return {*} the copied value.
   */
  w.deepcopy = function(value, target) {
    if (w.isArray(value)) {
      target = value.slice();
    } else if (w.isPlainObject(value)) {
      target = target || {};
      for (var i in value) {
        if (value.hasOwnProperty(i)) {
          target[i] = w.deepcopy(value[i]);
        }
      }
    } else {
      target = value;
    }
    return target;
  };

  /**
   * Merge the contents of two or more objects together into the first object.
   *
   * @param {?boolean} deep true for deep merge.
   * @param {object} target the target object.
   * @param {...object} source the source objects.
   * @param {object} the extended target.
   */
  w.extend = function() {
    var i, deep, target, source;
    if (typeof arguments[0] === 'boolean') {
      deep = arguments[0];
      target = arguments[1] || {};
      i = 2;
    } else {
      deep = false;
      target = arguments[0] || {};
      i = 1;
    }

    // If target is not an object, return {}.
    if (!w.isObject(target)) {
      return {};
    }

    for (; i < arguments.length; ++i) {
      source = arguments[i];
      // If source is not an object, ignore it.
      if (!w.isObject(source)) {
        continue;
      }

      for (var p in source) {
        if (source.hasOwnProperty(p)) {
          if (deep) {
            target[p] = w.deepcopy(source[p]);
          } else {
            target[p] = source[p];
          }
        }
      }
    }
    return target;
  };

  // $FOOTER$
  return w;
});
