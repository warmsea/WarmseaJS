define([
  './core',
  './types'
], function(w) {
  'use strict';
// $HEADER$

  /**
   * Deep copy a value (to a target).
   * @param {any} value
   * @param {?any} target
   * @return {any} the copied value.
   */
  w.deepcopy = function(value, target) {
    if (w.isArray(value)) {
      target = value.slice();
    } else if (w.isPlainObject(value)) {
      target = target || {};
      for (var i in value) {
        if (value.hasOwnProperty(i)) {
          target[i] = w.deepcopy(value[i], target[i]);
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
   * @return {object} the extended target.
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

  /**
   * Hide specified properties of an object.
   * @param {Object} obj the object
   * @param {Array<String>} props names of the properties
   */
  w.hideProperties = function(obj, props) {
    if (!w.isFunction(Object.defineProperty)) {
      return;
    }

    w.each(props, function(key) {
      Object.defineProperty(obj, key, {
        enumerable: false,
        writable: true,
        configurable: true
      });
    });
  };

  /**
   * Add a memoized property to an object.
   * @param {Object} obj the object
   * @param {String} name name of the property
   * @param {Function} getter getter function of the property
   * @param {Boolean} enumerable whether the property if enumerable
   */
  w.memoizedProperty = function(obj, name, getter, enumerable) {
    var cachedValue = null;

    // build enumerable attribute for each value with lazy accessor.
    Object.defineProperty(obj, name, {
      get: function() {
        if (cachedValue === null) {
          cachedValue = getter();
        }
        return cachedValue;
      },
      enumerable: enumerable
    });
  };

// $FOOTER$
  return w;
});
