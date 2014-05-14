  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = w;
    } else {
      exports.warmsea = w;
    }
  } else if ( typeof define === 'function' && define.amd) {
    define(function() {
      return w;
    });
  } else {
    global.warmsea = w;
  }

})(this, typeof exports !== 'undefined' ? exports._ : _);
