  if ( typeof define === 'function' && define.amd) {
    define(function() {
      return w;
    });
  } else {
      global.warmsea = w;
  }

})(this);
