define([
  './core',
  './arrays',
  './strings'
], function(w) {
  'use strict';
// $HEADER$

  /**
   * Create a debugger function with a name.
   * @method
   * @param {string} name
   * @return {function}
   */
  w.debug = (function() {

    /**
     * Hold all the debuggers.
     * @type {object}
     */
    var debuggers = {};

    /**
     * Hold the enable status for all debuggers.
     * @type {object}
     */
    var enableStatus = {};

    /**
     * Debug modes.
     * @type {string[]}
     */
    var modes = [];

    /**
     * RegExp matchers for debug modes.
     * @type {object}
     */
    var modeMatchers = {};

    /**
     * Themes for styled logging.
     * @type {object}
     */
    var themes = {
      'tomorrow': [
        'color:#8e908c',  // The first style is for message.
        'color:#f5871f',  // Others for debugger name and time.
        'color:#8959a8',
        'color:#4271ae',
        'color:#718c00',
        'color:#eab700',
        'color:#c82829'
      ]
    };

    /**
     * Styles for styled logging.
     * @type {Array}
     */
    var styles = themes.tomorrow;

    /**
     * Current color position.
     * @type {number}
     */
    var pStyle = 0;

    /**
     * Detect Chrome browser.
     * Enable color for Chrome browser.
     * @type {boolean}
     */
    var isChrome = w.global.navigator && w.global.navigator.userAgent.toLowerCase().indexOf('chrome') !== -1;

    /**
     * Create a debugger function with a name.
     * @param {string} name
     * @return {function}
     */
    var debug = function(name) {
      if (debuggers[name]) {
        return debuggers[name];
      }
      var dbg = function(fmt) {
        // if this debugger is not enabled, do nothing.
        // Check it every time so we can enable or disable a debugger at runtime.
        // It won't be slow.
        if (!enableStatus[this._name]) {
          return;
        }

        fmt = coerce.apply(this, arguments);

        var curr = +new Date();  // IE8 don't have `Date.now()`
        var ms = curr - (this._timestamp || curr);
        this._timestamp = curr;

        if (isChrome) {
          fmt = '%c' + name + '%c ' + fmt + ' %c+' + humanize(ms);
          w.global.console.log(fmt, this._style, this._msgStyle, this._style);
        } else {
          fmt = name + ' ' + fmt + ' +' + humanize(ms);
          if (w.global.console && w.global.console.log) {
            w.global.console.log(fmt);
          }
          // Any one want to alert debug message? I think it's annoying.
        }
      };
      dbg._name = name;
      dbg._msgStyle = styles[0];
      dbg._style = style();
      enableStatus[name] = debug.enabled(name);
      debuggers[name] = dbg.bind(dbg);
      return debuggers[name];
    };

    /**
     * Coerce `fmt`.
     */
    var coerce = function(fmt) {
      if (fmt instanceof Error) {
        return fmt.stack || fmt.message;
      } else {
        return w.format.apply(this, arguments);
      }
    };

    /**
     * Get a style for styled logging.
     */
    var style = function() {
      return styles[pStyle++ % (styles.length - 1) + 1];
    };

    /**
     * Humanize the given milliseconds.
     * @param {number} ms number of milliseconds.
     * @return {string} A human readable representation.
     */
    var humanize = function(ms) {
      var sec = 1000;
      var min = 60 * 1000;
      var hour = 60 * min;

      if (ms >= hour) {
        return (ms / hour).toFixed(1) + 'h';
      }
      if (ms >= min) {
        return (ms / min).toFixed(1) + 'm';
      }
      if (ms >= sec) {
        return (ms / sec | 0) + 's';
      }
      return ms + 'ms';
    };

    /**
     * Enable debugger(s) with the specified name.
     * @param {string} name
     */
    debug.enable = function(name) {
      w.each((name || '').split(/[\s,]+/), function(mode) {
        if (mode[0] !== '+' && mode[0] !== '-') {
          mode = '+' + mode;
        }
        if (!modeMatchers[mode]) {
          modeMatchers[mode] = new RegExp('^' + mode.substring(1).replace('*', '.*') + '$');
        }
        var newModes = [];
        for (var i = 0, len = modes.length; i < len; ++i) {
          var m = modes[i];
          if ((m === mode) || (m.indexOf('*') < 0 && m.match(modeMatchers[mode]))) {
            continue;
          }
          newModes.push(m);
        }
        modes = newModes;
        modes.push(mode);
      });
      refreshEnableStatus();
    };

    /**
     * Enable debugger(s) with the specified name.
     * Call this function without an argument to disable all debug modes.
     * @param {?string} name
     */
    debug.disable = function(name) {
      if (name === undefined) {
        modes = [];
        modeMatchers = {};
      } else {
        var enableName = '';
        w.each(name.split(/[\s,]+/), function(n) {
          if (n[0] === '+' || n[1] === '-') {
            n = n.substring(1);
          }
          enableName += ', -' + n;
        });
        enableName = enableName.substring(2);
        debug.enable(enableName);
      }
      refreshEnableStatus();
    };

    /**
     * Return true if the given mode name is enabled, false otherwise.
     * @param {string} name
     * @return {boolean}
     */
    debug.enabled = function(name) {
      for (var i = modes.length - 1; i >= 0; --i) {
        if (name.match(modeMatchers[modes[i]])) {
          return modes[i][0] === '+';
        }
      }
      return false;
    };

    /**
     * Reset the enable status of all debuggers.
     */
    var refreshEnableStatus = function() {
      for (var name in debuggers) {
        enableStatus[name] = debug.enabled(name);
      }
    };

    return debug;

  })();

// $FOOTER$
  return w;
});
