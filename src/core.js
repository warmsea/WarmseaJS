// jshint -W098
// Disable the warning: 'w' is defined but never used.
// Across the WarmseaJS source files, 'w' is used as the shortcut for
// 'warmsea'. After compile the source files into a single file, here is where
// 'w' is defined.
// @formatter:off
define([
], function() { 'use strict';
// @formatter:on $HEADER$

  /**
   * This will be the global {@code warmsea} namespace in CommonJS, or the
   * module in AMD.
   *
   * @namespace The main namespace of the warmsea JavaScript library.
   */
  var warmsea = function() {
  };

  /**
   * A shortcut for {@warmsea}.
   */
  var w = warmsea;

  // $FOOTER$
  return warmsea;

});
