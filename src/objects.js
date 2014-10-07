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
    if (!w.isFunction(Object.defineProperty)) {
      obj[name] = getter();
    }
    var cachedValue = null;

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
