define([
  './core',
  './types',
  './math'
], function(w) {
  'use strict';
// $HEADER$

  /**
   * Choose a random floating-point number in the range of [0.0, 1.0).
   *
   * @return {number} A floating-point number in the range of [0.0, 1.0).
   */
  w.random = function() {
    return Math.random();
  };

  /**
   * Choose a random integer in the range of [start, end).
   * <p>
   * If end is not passed, the range will be [0, start).
   *
   * @param {number} start start of the range.
   * @param {number} stop end of the range.
   * @return {number} A random integer in the range.
   */
  w.randomInt = function(start, stop) {
    if (start === undefined && stop === undefined) {
      return 0;
    } else if (stop === undefined) {
      stop = start;
      start = 0;
    }
    start = Math.ceil(start);
    stop = Math.ceil(stop);
    if (start < stop) {
      return start + Math.floor((stop - start) * Math.random());
    } else if (start > stop) {
      return start - Math.floor((start - stop) * Math.random());
    } else {
      w.error('No integer in the range of [' + start + ', ' + stop + ')');
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
  w.randomFloat = function(start, stop) {
    if (start === undefined && stop === undefined) {
      return Math.random();
    } else if (stop === undefined) {
      return Math.random() * start;
    } else if (start < stop) {
      return start + Math.random() * (stop - start);
    } else if (start > stop) {
      return start - Math.random() * (start - stop);
    } else {
      w.error('No number in the range of [' + start + ', ' + stop + ')');
    }
  };

  /**
   * Generate a random string.
   * <p>
   * By default, the string may contain some of the these characters:
   * <code>abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789</code>.
   * And by default, the string has 8 characters.
   *
   * @param {number} length The length of the string. Default to 8.
   * @param {string} allowedChars The allowed characters in the string.
   */
  w.randomString = function(length, allowedChars) {
    if (length === undefined) {
      length = 8;
    } else {
      length = w.i(length);
      length = w.max(length, 0);
    }
    if (allowedChars === undefined) {
      allowedChars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    } else {
      allowedChars = w.str(allowedChars);
    }
    var res = '';
    var len = allowedChars.length;
    for (var i = 0; i < length; i++) {
      res += allowedChars[Math.floor(Math.random() * len)];
    }
    return res;
  };

// $FOOTER$
  return w;
});
