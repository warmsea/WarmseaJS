define([
  './core',
  './types',
  './math'
], function(w) {
  'use strict';
// $HEADER$

  /**
   * Return a random number in the range of [0.0, 1.0).
   * Identical to Math.random().
   * @method
   * @return {number}
   */
  w.random = Math.random;

  /**
   * Return a random integer in the range of [start, end).
   * If end is not passed, the range will be [0, start).
   * @param {number} start
   * @param {number} end
   * @return {number}
   */
  w.randomInt = function(start, end) {
    if (start === undefined && end === undefined) {
      return 0;
    } else if (end === undefined) {
      end = start;
      start = 0;
    }
    start = Math.ceil(start);
    end = Math.ceil(end);
    if (start < end) {
      return start + Math.floor((end - start) * Math.random());
    } else if (start > end) {
      return start - Math.floor((start - end) * Math.random());
    } else {
      return NaN;
    }
  };

  /**
   * Choose a random floating-point number in the range of [start, end).
   * <p>
   * If end is not passed, the range will be [0, start).
   *
   * @param {number} start start of the range.
   * @param {number} end end of the range.
   * @return {number} A random number in the range.
   */
  w.randomFloat = function(start, end) {
    if (start === undefined && end === undefined) {
      return Math.random();
    } else if (end === undefined) {
      return Math.random() * start;
    } else if (start < end) {
      return start + Math.random() * (end - start);
    } else if (start > end) {
      return start - Math.random() * (start - end);
    } else {
      return NaN;
    }
  };

  /**
   * Return a random string.
   * @param {number} length Default to 8.
   * @param {string} allowedChars Default to "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"
   */
  w.randomString = function(length, allowedChars) {
    if (length === undefined) {
      length = 8;
    } else {
      length = w.i(length);
      length = w.max([length, 0]);
    }
    if (allowedChars === undefined) {
      allowedChars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    } else {
      allowedChars = w.str(allowedChars);
    }
    var res = '';
    var len = allowedChars.length;

    if (!len) {
      return '';
    }

    for (var i = 0; i < length; i++) {
      res += allowedChars[Math.floor(Math.random() * len)];
    }
    return res;
  };

// $FOOTER$
  return w;
});
