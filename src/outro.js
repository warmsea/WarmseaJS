  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = w;
  } else if ( typeof define === 'function' && define.amd) {
    define(function() {
      return w;
    });
  } else {
      global.warmsea = w;
  }

})(this);
