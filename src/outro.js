  if ( typeof define === 'function' && define.amd) {
    define(function() {
      return warmsea;
    });
  } else {
      global.warmsea = warmsea;
  }

})(this);
