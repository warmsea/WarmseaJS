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

  var compatibleKeys = ['VERSION', 'noConflict'];
  var overwritten = [];
  _.each(underscoreKeys, function(k) {
    if (_[k] !== w[k] && !w.inArray(compatibleKeys, k)) {
      overwritten.push(k);
    }
  });
  if (overwritten.length) {
    var overwritenMsg = 'The following functions of WarmseaJS ' +
        'is not fully compatible with underscore.js: ';
    overwritenMsg += '"' + overwritten.join('", "') + '"';
    if (global.console) {
      var warn = global.console.warn || global.console.log || w.noop;
      warn.call(global.console, overwritenMsg);
    }
  }

})(this, typeof exports !== 'undefined' ? exports._ : _);
