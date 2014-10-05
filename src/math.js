define([
  './core'
], function(w) {
  'use strict';
// $HEADER$

  /**
   * A compare function returns 1, if a &lt; b; -1, if a &gt; b; 0, otherwise.
   * @param {any} a
   * @param {any} b
   * @return {number}
   */
  w.cmp = function(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
  };

// $FOOTER$
  return w;
});
