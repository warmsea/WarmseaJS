/*!
 * warmsea JavaScript Library v0.5.0
 *
 * Copyright 2009, 2014 Su Su
 * Released under the MIT license
 *
 * Date: 2014-06-08
 */


//// START OF THE underscore.js SOURCE CODE

//     Underscore.js 1.6.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.6.0';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return obj;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
    return obj;
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var result;
    any(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);
    each(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, function(value, index, list) {
      return !predicate.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(predicate, context);
    each(obj, function(value, index, list) {
      if (!(result = result && predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(predicate, context);
    each(obj, function(value, index, list) {
      if (result || (result = predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matches(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matches(attrs));
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    var result = -Infinity, lastComputed = -Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed > lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    var result = Infinity, lastComputed = Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed < lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Shuffle an array, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return value;
    return _.property(value);
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    iterator = lookupIterator(iterator);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iterator, context) {
      var result = {};
      iterator = lookupIterator(iterator);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    _.has(result, key) ? result[key].push(value) : result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[0];
    if (n < 0) return [];
    return slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[array.length - 1];
    return slice.call(array, Math.max(array.length - n, 0));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Split an array into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(array, predicate) {
    var pass = [], fail = [];
    each(array, function(elem) {
      (predicate(elem) ? pass : fail).push(elem);
    });
    return [pass, fail];
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.contains(other, item);
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, 'length').concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    return function() {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        if (args[i] === _) args[i] = arguments[position++];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return func.apply(this, args);
    };
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error('bindAll must be passed function names');
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;
      if (last < wait) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))
                        && ('constructor' in a && 'constructor' in b)) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  _.constant = function(value) {
    return function () {
      return value;
    };
  };

  _.property = function(key) {
    return function(obj) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
  _.matches = function(attrs) {
    return function(obj) {
      if (obj === attrs) return true; //avoid comparing an object to itself.
      for (var key in attrs) {
        if (attrs[key] !== obj[key])
          return false;
      }
      return true;
    }
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() { return new Date().getTime(); };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}).call(this);

//// END OF THE underscore.js SOURCE CODE


(function(global, _) {
  'use strict';

    /**
     * This will be the global <code>warmsea</code> namespace.
     *
     * @namespace
     * @alias warmsea
     */
    var w = {};

    /**
     * The global object.
     * @type {Object}
     */
    w.global = global;

    /**
     * A function with no operation.
     */
    w.noop = function() {
    };

    /**
     * An identity function.
     *
     * @param {*} x A value.
     * @returns{*} <code>x</code> itself.
     */
    w.identity = function(x) {
      return x;
    };

    /**
     * An unimplemented function that throws an error.
     */
    w.unimplemented = function() {
      w.error('Unimplemented');
    };

    /**
     * Throws an Error.
     *
     * @function
     * @param {string} msg The error message.
     * @throws {Error} An error with a message.
     */
    w.error = w.error || function(msg) {
      throw new Error(msg);
    };

    /**
     * The default compare function
     *
     * @param {*} a A value.
     * @param {*} b Another value.
     * @returns{number} 1, if a &gt; b; -1, if a &lt; b; 0, otherwise.
     */
    w.cmp = function(a, b) {
      return a > b ? 1 : a < b ? -1 : 0;
    };

    /**
     * Returns the keys of an object.
     *
     * Samples:
     *
     * Code: w.keys(['a', 'b', 'c']);
     * Result: ["0", "1", "2"]
     *
     * Code: w.keys({a:1, b:2, c:3});
     * Result: ["a", "b", "c"]
     *
     * @method
     * @param {object} obj An Object.
     * @returns{Array} The keys of the object.
     */
    w.keys = _.keys;

    /**
     * Returns the values of an object.
     * No deep copy. Equal sign (=) is used to cope the value.
     *
     * Samples:
     *
     * Code: w.values(['a', 'b', 'c']);
     * Result: ["a", "b", "c"]
     *
     * Code: w.values({a:1, b:'hello', c:[1,2,3]});
     * Result: [1, "hello", [1, 2, 3]]
     *
     * @method
     * @param {object} obj An object.
     * @returns{Array} The values of the object.
     */
    w.values = _.values;

  /**
   * Test if an item is in an array.
   *
   * @param {array} arr The array
   * @param {*} item The item
   * @returns {boolean} true, if the item is in the array; false, if not.
   */
  w.inArray = function(arr, item) {
    if (!w.isArray(arr)) {
      return false;
    }
    return _.indexOf(arr, item) >= 0;
  };

  /**
   * In-place stable sort.
   *
   * @param {Array} list The array to be sorted.
   * @param {function} cmp The compare function; by default, it's w.cmp。
   * @param {object} context The context for cmp.
   * @return {Array} The sorted array.
   */
  w.sort = function(list, cmp, context) {
    cmp = cmp || w.cmp;
    var i;
    var len = list.length;
    for (i = 0; i < len; ++i) {
      // _$wssi stands for Warmsea Stable Sort Id
      // I hope no one is using it.
      list[i]._$wssi = i;
    }
    list.sort(function(a, b) {
      return cmp.call(context, a, b) || w.cmp(a._$wssi - b._$wssi);
    });
    for (i = 0; i < len; ++i) {
      delete list[i]._$wssi;
    }
    return list;
  };

  /**
   * indexOf() from underscore.js.
   * @method
   */
  w.indexOf = _.indexOf;

  /**
   * range() from underscore.js.
   * @method
   */
  w.range = _.range;

  /**
   * all() from underscore.js.
   * @method
   */
  w.all = _.all;

  /**
   * any() from underscore.js.
   * @method
   */
  w.any = _.any;

  /**
   * each() from underscore.js.
   * @method
   */
  w.each = _.each;

  /**
   * map() from underscore.js.
   * @method
   */
  w.map = _.map;

  /**
   * reduce() from underscore.js.
   * @method
   */
  w.reduce = _.reduce;

  /**
   * filter() from underscore.js.
   * @method
   */
  w.filter = _.filter;

  w.Queue = (function() {

    /**
     * Queue class. A Queue is a FIFO (First In, First Out) collection.
     *
     * @class
     * @name warmsea.Queue
     * @param {?function} validator A value validation function.
     */
    var Queue = function(validator) {
      this._validator = validator;
      this.clear();
      this.allowEmptyDequeue = true;
    };

    /**
     * Returns number of elements in the Queue.
     *
     * @return {number}
     */
    Queue.prototype.count = function() {
      return this._queue.length - this._offset;
    };

    /**
     * Number of elements in the Queue.
     * @type {number}
     */
    try {
      Object.defineProperty(Queue.prototype, 'length', {
        enumerable: true,
        get: function() {
          return this.count();
        }
      });
    } catch (e) {
      // I'm not interested in fully supporting IE 8.
      // But I don't want it dies in the first place.
    }

    /**
     * Remove all objects from the Queue.
     *
     * @method
     * @name warmsea.Queue.prototype.clear
     */
    Queue.prototype.clear = function() {
      this._queue = [];
      this._offset = 0;
    };

    /**
     * Add an object to the end of the Queue.
     *
     * @method
     * @name warmsea.Queue.prototype.enqueue
     * @param {Object} value An object.
     * @throws {Error} If value can't pass the validation.
     */
    Queue.prototype.enqueue = function(value) {
      if (this._validator && !this._validator(value)) {
        w.error('Value not accepted: ' + value);
      }
      this._queue.push(value);
    };

    /**
     * Remove the object at the beginning of the Queue and return it.
     *
     * @method
     * @name warmsea.Queue.prototype.dequeue
     * @return {*} The object at the beginning of the Queue.
     */
    Queue.prototype.dequeue = function() {
      if (this.length === 0) {
        if (this.allowEmptyDequeue) {
          return undefined;
        } else {
          w.error('The queue is empty');
        }
      }
      var item = this._queue[this._offset++];
      if (this._offset > 16 && this._offset * 2 > this._queue.length) {
        this._queue = this._queue.slice(this._offset);
        this._offset = 0;
      }
      return item;
    };

    /**
     * Return the object at the beginning of the Queue without removing it.
     *
     * @method
     * @name warmsea.Queue.prototype.peek
     * @return {*} The object at the beginning of the Queue.
     */
    Queue.prototype.peek = function() {
      if (this.length === 0) {
        if (this.allowEmptyDequeue) {
          return undefined;
        } else {
          w.error('Dequeueing an empty queue is not allowed');
        }
      }
      return this._queue[this._offset];
    };

    return Queue;

  })();

  w.Stack = (function() {

    /**
     * Stack class. A Stack is a FILO (First In, Last Out) collection.
     *
     * @class
     * @name warmsea.Stack
     * @param {?function} validator A value validation function.
     */
    var Stack = function(validator) {
      this._validator = validator;
      this.clear();
      this.allowEmptyPop = true;
    };

    /**
     * Returns number of elements in the Stack.
     *
     * @return {number}
     */
    Stack.prototype.count = function() {
      return this._top + 1;
    };

    /**
     * Number of elements in the Queue.
     * @type {number}
     */
    try {
      Object.defineProperty(Stack.prototype, 'length', {
        enumerable: true,
        get: function() {
          return this.count();
        }
      });
    } catch (e) {
      // I'm not interested in fully supporting IE 8.
      // But I don't want it dies in the first place.
    }

    /**
     * Remove all objects from the Stack.
     *
     * @method
     * @name warmsea.Stack.prototype.clear
     */
    Stack.prototype.clear = function() {
      this._stack = [];
      this._top = -1;
    };

    /**
     * Add an object to the top of the Stack.
     *
     * @method
     * @name warmsea.Stack.prototype.push
     * @param {Object} value An object.
     * @throws {Error} If value can't pass the validation.
     */
    Stack.prototype.push = function(value) {
      if (this._validator && !this._validator(value)) {
        w.error('Value not accepted: ' + value);
      }
      this._top++;
      if (this._top < this.length) {
        this._stack[this._top] = value;
      } else {
        this._stack.push(value);
      }
    };

    /**
     * Remove the object at the top of the Stack and return it.
     *
     * @method
     * @name warmsea.Stack.prototype.pop
     * @return {*} The object at the top of the Stack.
     */
    Stack.prototype.pop = function() {
      if (this.length === 0) {
        if (this.allowEmptyPop) {
          return undefined;
        } else {
          w.error('The stack is empty');
        }
      }
      var item = this._stack[this._top--];
      if (this._top > 16 && this._top * 2 < this._stack.length) {
        this._stack = this._stack.slice(0, this._top + 1);
      }
      return item;
    };

    /**
     * Return the object at the top of the Stack without removing it.
     *
     * @method
     * @name warmsea.Stack.prototype.peek
     * @return {*} The object at the top of the Stack.
     */
    Stack.prototype.peek = function() {
      if (this.length === 0) {
        if (this.allowEmptyPop) {
          return undefined;
        } else {
          w.error('Popping an empty stack is not allowed');
        }
      }
      return this._stack[this._top];
    };

    return Stack;

  })();


  /**
   * Return the smallest value.
   *
   * @param {function} cmp A optional compare function.
   * @param {*} values Values as an array or a list of arguments.
   * @return {*} The smallest value.
   */
  w.min = function(/* [cmp,] (values_array | value1,value2,value3,...) */) {
    if (!arguments.length) {
      return undefined;
    }
    var cmp, values;
    if (w.isFunction(arguments[0])) {
      cmp = arguments[0];
      values = Array.prototype.slice.call(arguments, 1);
    } else {
      cmp = w.cmp;
      values = Array.prototype.slice.call(arguments, 0);
    }
    if (!values.length) {
      return undefined;
    }
    var data = w.isArray(values[0]) ? values[0] : values;
    var min = data[0];
    for (var i = 1, len = data.length; i < len; ++i) {
      if (cmp(min, data[i]) > 0) {
        min = data[i];
      }
    }
    return min;
  };
  w.min = _.min;

  /**
   * Return the largest value.
   *
   * @param {function} cmp A optional compare function.
   * @param {*} values Values as an array or a list of arguments.
   * @return {*} The largest value.
   */
  w.max = function(/* [cmp,] (values_array | value1,value2,value3,...) */) {
    if (!arguments.length) {
      return undefined;
    }
    var cmp, values;
    if (w.isFunction(arguments[0])) {
      cmp = arguments[0];
      values = Array.prototype.slice.call(arguments, 1);
    } else {
      cmp = w.cmp;
      values = Array.prototype.slice.call(arguments, 0);
    }
    if (!values.length) {
      return undefined;
    }
    var data = w.isArray(values[0]) ? values[0] : values;
    var max = data[0];
    for (var i = 1, len = data.length; i < len; ++i) {
      if (cmp(max, data[i]) < 0) {
        max = data[i];
      }
    }
    return max;
  };
  w.max = _.max;

  /**
   * Cast a value to a Boolean.
   *
   * @param {*} value A value.
   * @return {boolean} The boolean value.
   */
  w.bool = function(value) {
    var v = value;
    if (w.isObject(v) && '__bool__' in v) {
      return w.bool(w.isFunction(v.__bool__) ? v.__bool__() : v.__bool__);
    } else {
      return !!value;
    }
  };

  /**
   * Cast a value to an Integer.
   *
   * @param {*} value A value.
   * @param {number} radix An integer between 2 and 32.
   * @return {number} The integer value.
   */
  w.i = function(value, radix) {
    var v = value;
    if (v === true) {
      return 1;
    } else if (w.isObject(v) && '__int__' in v) {
      return w.i(w.isFunction(v.__int__) ? v.__int__() : v.__int__, radix);
    } else if (!radix && w.isString(v) && (v.indexOf('0x') === 0 || v.indexOf('0X') === 0)) {
      return parseInt(v, 16);
    } else if (!radix || radix === 10) {
      return Math.round(parseFloat(v));
    } else {
      return parseInt(v, radix);
    }
  };

  /**
   * Cast a value to a Float.
   *
   * @param {*} value A value.
   * @return {number} The float value.
   */
  w.f = function(value) {
    var v = value;
    if (v === true) {
      return 1.0;
    } else if (w.isObject(v) && '__float__' in v) {
      return w.f(w.isFunction(v.__float__) ? v.__float__() : v.__float__);
    } else {
      return parseFloat(v);
    }
  };

  /**
   * Cast a value to a String.
   *
   * @param {*} value A value.
   * @return {string} The string value.
   */
  w.str = function(value) {
    var v = value;
    if (w.isObject(v) && '__str__' in v) {
      return w.str(w.isFunction(v.__str__) ? v.__str__() : v.__str__);
    } else {
      return String(value);
    }
  };

  /**
   * Cast a value to an Array.
   * <p>
   * If <code>value</code> is <code>undefined</code> or <code>null</code>, an empty array will be returned.
   *
   * @param {*} value A value.
   * @return {Array} The array value.
   */
  w.array = function(value) {
    if (w.isArray(value)) {
      return value;
    } else if (value === undefined || value === null) {
      return [];
    } else {
      return [value];
    }
  };

  /**
   * Test whether a value is NaN.
   *
   * @method
   * @param {*} A value.
   * @return {boolean} <code>true</code>, if <code>value</code> is NaN; <code>false</code>, otherwise.
   */
  w.isNaN = _.isNaN;

  /**
   * Test whether a value is a number.
   *
   * @method
   * @param {*} value A value.
   * @return {boolean} <code>true</code>, if <code>value</code> is a string; <code>false</code>, otherwise.
   */
  w.isNumber = _.isNumber;

  /**
   * Test whether a value is an integer.
   * <p>
   * JavaScript has only one number type, that is 64-bit floating-point number. So we test whether the value is an
   * integer in that system. Which means 1.0 and 1 are both integers, but 9007199254740994 is not an integer because it
   * exceeds the max integer value a 64-bit floating-point number can present (±2^53).
   *
   * @param {*} value A value.
   * @return {boolean} <code>true</code>, if <code>value</code> is a string; <code>false</code>, otherwise.
   */
  w.isInt = function(value) {
    return typeof value === 'number' && value % 1 === 0 && value >= -9007199254740992 && value <= 9007199254740992;
  };

  /**
   * Test whether a value is a string.
   *
   * @method
   * @param {*} value A value.
   * @return {boolean} <code>true</code>, if <code>value</code> is a string; <code>false</code>, otherwise.
   */
  w.isString = _.isString;

  /**
   * Test whether a value is an array.
   *
   * @method
   * @param {*} value A value.
   * @return {boolean} <code>true</code>, if <code>value</code> is an array; <code>false</code>, otherwise.
   */
  w.isArray = _.isArray;

  /**
   * Test whether a value is a function.
   *
   * @method
   * @param {*} value A value.
   * @return {boolean} <code>true</code>, if <code>value</code> is a function; <code>false</code>, otherwise.
   */
  w.isFunction = _.isFunction;

  /**
   * Test whether a value is a plain object.
   * <p>
   * ATTENSION: I'm not pretty sure whether this function works everywhere. Can anyone help me?
   * <p>
   * A plain object is typically an object defined with <code>{}</code> or <code>new Object</code>.
   *
   * @param {*} value A value.
   * @return {boolean} <code>true</code>, if <code>value</code> is a plain object; <code>false</code>, otherwise.
   */
  w.isPlainObject = function(value) {
    if (String(value) !== '[object Object]') {
      return false;
    }
    try {
      if (!value.constructor.prototype.hasOwnProperty('isPrototypeOf')) {
        return false;
      }
    } catch (e) {
      return false;
    }
    return true;
  };

  /**
   * Test whether a value is an object.
   * <p>
   * <code>undefined</code>, <code>null</code>, numbers, strings won't pass this test, everything else will.
   * <p>
   * ATTENSION: <code>typeof null</code> is <code>"object"</code>, but <code>warmsea.isObject(null)</code> returns
   * <code>false</code>. Because using a <code>null</code> object is always error-prone.
   * <p>
   * Arrays pass both <code>warmsea.isArray()</code> and <code>warmsea.isObject()</code>.
   *
   * @method
   * @param {*} value A value.
   * @return {boolean} <code>true</code>, if <code>value</code> is an object; <code>false</code>, otherwise.
   */
  w.isObject = _.isObject;

  /**
   * Deep copy a value (to target).
   *
   * @param {*} value
   * @param {?*} target
   * @return {*} the copied value.
   */
  w.deepcopy = function(value, target) {
    if (w.isArray(value)) {
      target = value.slice();
    } else if (w.isPlainObject(value)) {
      target = target || {};
      for (var i in value) {
        if (value.hasOwnProperty(i)) {
          target[i] = w.deepcopy(value[i]);
        }
      }
    } else {
      target = value;
    }
    return target;
  };

  /**
   * Merge the contents of two or more objects together into the first object.
   *
   * @param {?boolean} deep true for deep merge.
   * @param {object} target the target object.
   * @param {...object} source the source objects.
   * @param {object} the extended target.
   */
  w.extend = function() {
    var i, deep, target, source;
    if (typeof arguments[0] === 'boolean') {
      deep = arguments[0];
      target = arguments[1] || {};
      i = 2;
    } else {
      deep = false;
      target = arguments[0] || {};
      i = 1;
    }

    // If target is not an object, return {}.
    if (!w.isObject(target)) {
      return {};
    }

    for (; i < arguments.length; ++i) {
      source = arguments[i];
      // If source is not an object, ignore it.
      if (!w.isObject(source)) {
        continue;
      }

      for (var p in source) {
        if (source.hasOwnProperty(p)) {
          if (deep) {
            target[p] = w.deepcopy(source[p]);
          } else {
            target[p] = source[p];
          }
        }
      }
    }
    return target;
  };

  /**
   * Pad a string to a given length by adding leading characters.
   *
   * @param {number|string} value The value; usually a number.
   * @param {int} length The wanted length. If not given, it's 2.
   * @param {string} leading The leading character. If not given, it's '0'.
   */
  w.pad = function(value, length, leading) {
    value = w.str(value);
    length = w.max([0, length === undefined ? 2 : length, value.length]);
    leading = w.str(leading || '0');
    var a = new Array(Math.ceil((length - value.length) / leading.length) + 1);
    return a.join(leading).substring(0, length - value.length) + value;
  };

  /**
   * Format a string.
   * <p>
   * It is similar to the <code>sprintf()</code> in the C language.
   * <p>
   * A conversion specifiers is of the following format: <br>
   * %[mapping_key][flags][width][.precision][length]conversion_type
   * <p>
   * A mapping key is a parenthesized string (for example, <code>(year)</code>,
   * parenthesis is not allowed inside it).
   * <p>
   * Available flags are listed below:<br>
   * <table><thead>
   * <tr>
   * <th>Flag
   * <th>Meaning</th>
   * <tbody>
   * <tr>
   * <td><code>#</code>
   * <td>Use the "alternate form".
   * <tr>
   * <td><code>0</code>
   * <td>zero padding before a number.
   * <tr>
   * <td><code>-</code>
   * <td>(Overrides "0" flag.) The converted value is left adjusted.
   * <tr>
   * <td><code>(a space)</code>
   * <td>A space will precede a positive number or an empty string produced by
   * a signed conversion.
   * <tr>
   * <td><code>+</code>
   * <td>(Overrides "space" flag.) A sign character ("+" or "-") will precede a
   * number.</td>
   * </table>
   * <p>
   * "width" is an integer indicates the minimum field width, or an "*". If it
   * is an "*", the width is the next <code>arg</code>, and the value to
   * convert comes after the width and the optional precision.
   * <p>
   * "precision" is a dot (".") followed by an integer indicates the precision,
   * or an "*". If it is an "*", the precision is the next <code>arg</code>,
   * and the value to convert comes after the precision. The precision
   * determines the number of digits after the decimal point and defaults to 6.
   * <p>
   * "length" is one of "h", "l" or "L". But it is ignored as it is not
   * necessary for JavaScript.
   * <p>
   * Available conversion types are listed below:<br>
   * <table><thead>
   * <tr>
   * <th>Conversion
   * <th>Meaning
   * <th>Note</th>
   * <tbody>
   * <tr>
   * <td><code>d</code>
   * <td>Decimal.
   * <td>
   * <tr>
   * <td><code>o</code>
   * <td>Octal.
   * <td>"Alternate form" adds leading zero ("0").
   * <tr>
   * <td><code>x</code>
   * <td>Lowercase hexadecimal.
   * <td>"Alternate form" adds leading "0x".
   * <tr>
   * <td><code>X</code>
   * <td>Uppercase hexadecimal.
   * <td>"Alternate form" adds leading "0X".
   * <tr>
   * <td><code>f</code>
   * <td>Floating point decimal format.
   * <td>"Alternate form" ensures a decimal point, even if no digits follow it.
   * <tr>
   * <td><code>s</code>
   * <td>String
   * <td>
   * <tr>
   * <td><code>%</code>
   * <td>A "%" character.
   * <td>
   * <tr>
   * <td><code>/</code>
   * <td>A "/" character.</td>
   * </table>
   * <p>
   * All integer values are converted with <code>warmsea.int()</code>. And
   * <code>warmsea.float()</code> for floats, <code>warmsea.string()</code>
   * for strings.
   *
   * @function
   * @param {string|function} format the format string.
   * @param {...*} args Arguments one by one, or a list.
   * @return {string} The formatted string.
   */
  w.format = (function(w) {

    var f = function(format /* , args_array | args_map | arg1, arg2,  ... */) {
      if (!arguments.length) {
        return '';
      }
      format = func2str(arguments[0]);

      var params;
      if (w.isArray(arguments[1])) {
        params = arguments[1];
      } else if (w.isPlainObject(arguments[1])) {
        params = arguments[1];
      } else {
        params = Array.prototype.slice.call(arguments, 1);
      }

      var converter = new FormatConverter(params);

      var specifiers = /%(?:\((.*?)\))?([#|0|\-| |\+]+)?(\d+|\*)?(?:.(\d+|\*))?(?:[h|l|L])?(.)?/g;

      format = format.replace(specifiers, function() {
        return FormatConverter.prototype.convert.apply(converter, arguments);
      });

      return format;
    };

    /**
     * Convert a function into a (multi-line) string.
     *
     * @see warmsea#format
     */
    var func2str = function(func) {
      if (w.isString(func)) {
        return func;
      } else if (!w.isFunction(func)) {
        return w.str(func);
      }

      var lines = w.str(func).split(/\r?\n/);
      var i = 0, j = 0, len = lines.length;
      var startIndex, endIndex;
      var endTag, options = {};
      var dent = null;

      // Find the start line.
      while (i < len) {
        var start = lines[i++].match(/^[ \t]*\/\*!?<<<(\w+)(?:;(.+)?)?$/);
        if (!start) {
          continue;
        }
        startIndex = i;
        endTag = start[1];
        var optionTags = (start[2] || '').split(/[ \t]*,[ \t]*/);
        for (j = 0; j < optionTags.length; ++j) {
          var tag = optionTags[j].toLowerCase().split(/-(.*)/);
          if (tag[0]) {
            options[tag[0]] = tag[1] || true;
          }
        }
        break;
      }
      if (!startIndex) {
        w.error('Format failed: start line missing');
      }

      // The default WS option is "OUTDENT".
      options.ws = options.ws || 'outdent';

      var result = [];

      // Find the end line.
      while (i < len) {
        var line = lines[i];
        if (line.match(new RegExp('^[ \\t]*' + endTag + '\\*\\/'))) {
          endIndex = i;
          break;
        }
        i++;
        // Count the dent here.
        if (options.ws === 'outdent') {
          var match = line.match(/^([ \t]*).*$/);
          var cur = match[1];
          if (dent === null) {
            dent = cur;
          } else {
            j = 0;
            while (j < dent.length && j < cur.length && dent[j] === cur[j]) {
              j++;
            }
            if (dent.length > j) {
              dent = dent.substring(0, j);
            }
          }
        }
        result.push(line);
      }
      if (!endIndex) {
        w.error('Format failed: end line missing');
      }

      var wsFunc;
      switch (options.ws) {
        case 'outdent':
          wsFunc = function(s) {
            return s.substring(dent.length);
          };
          break;
        case 'keep':
          wsFunc = w.identity;
          break;
        case 'trim':
          wsFunc = function(s) {
            return s.trim();
          };
          break;
        default:
          w.error('Format failed: Unsupported WS option');
      }

      for (i = 0, len = result.length; i < len; ++i) {
        result[i] = wsFunc(result[i]);
      }

      return result.join('\n');
    };

    /**
     * Convertor for <code>format()</code> function.
     *
     * @see warmsea#format
     */
    var FormatConverter = function(params) {
      this.params = params || [];
      this.index = 0;
    };

    /**
     * Convert a specifier into wanted string.
     *
     * @see warmsea#format
     */
    FormatConverter.prototype.convert = function(specifier, key, flags, width, precision, type, position) {
      if (type === undefined) {
        w.error('format incomplete specifier "%s" in position (%d).', specifier, position);
      }
      if (!this.convertors.hasOwnProperty(type)) {
        w.error('format unsupported type "%s" in position (%d)', type, position);
      }

      var next;

      if (width === '*') {
        next = this.index++;
        if (!this.params.hasOwnProperty(next)) {
          w.error('format key error "%s" in position (%d).', key, position);
        }
        width = this.params[next];
      }
      width = width || 0;

      if (precision === '*') {
        next = this.index++;
        if (!this.params.hasOwnProperty(next)) {
          w.error('format key error "%s" in position (%d).', key, position);
        }
        precision = this.params[next];
      }
      if (precision === undefined) {
        precision = 6;
      }

      if (type === '%' || type === '/') {
        return type;
      }

      key = key === undefined ? this.index++ : key;
      if (!this.params.hasOwnProperty(key)) {
        w.error('format key error "%s" in position (%d).', key, position);
      }
      var value = this.params[key];

      flags = flags || '';
      flags = {
        '#': flags.indexOf('#') >= 0,
        '0': flags.indexOf('0') >= 0 && flags.indexOf('-') < 0,
        '-': flags.indexOf('-') >= 0,
        ' ': flags.indexOf(' ') >= 0 && flags.indexOf('+') < 0,
        '+': flags.indexOf('+') >= 0
      };

      return this.convertors[type](value, flags, width, precision);
    };

    /**
     * The convertors of each type.
     */
    FormatConverter.prototype.convertors = {
      'd': function(value, flags, width /*, precision */) {
        return FormatConverter.prototype.convertors.ic('d', value, flags, width);
      },
      'o': function(value, flags, width /*, precision */) {
        return FormatConverter.prototype.convertors.ic('o', value, flags, width);
      },
      'x': function(value, flags, width /*, precision */) {
        return FormatConverter.prototype.convertors.ic('x', value, flags, width);
      },
      'X': function(value, flags, width /*, precision */) {
        return FormatConverter.prototype.convertors.ic('X', value, flags, width);
      },
      'f': function(value, flags, width, precision) {
        value = w.f(value);
        var sign = value < 0 ? '-' : (flags['+'] ? '+' : flags[' '] ? ' ' : '');
        value = Math.abs(value).toFixed(precision);
        if (flags['#'] && precision === 0) {
          value += '.';
        }
        var gap = w.max([0, width - value.length - sign.length]);
        if (flags['-']) {
          return sign + value + w.pad('', gap, ' ');
        } else if (flags['0']) {
          return sign + w.pad('', gap, '0') + value;
        } else {
          return w.pad('', gap, ' ') + sign + value;
        }
      },
      's': function(value, flags, width /*, precision */) {
        value = w.str(value);
        var gap = w.max([0, width - value.length]);
        if (flags['-']) {
          return value + w.pad('', gap, ' ');
        } else {
          return w.pad('', gap, ' ') + value;
        }
      },
      '%': function() {
        this.index--;
        return '%';
      },
      '/': function() {
        this.index--;
        return '/';
      },
      'ic': function(type, value, flags, width) {
        value = w.i(value);
        var sign = value < 0 ? '-' : (flags['+'] ? '+' : flags[' '] ? ' ' : '');
        var prefix = flags['#'] ? {
          'd': '',
          'o': '0',
          'x': '0x',
          'X': '0X'
        }[type] : '';
        value = Math.abs(value).toString({
          'd': 10,
          'o': 8,
          'x': 16,
          'X': 16
        }[type]);
        var gap = w.max([0, width - prefix.length - value.length - sign.length]);
        var result = '';
        if (flags['-']) {
          result = sign + prefix + value + w.pad('', gap, ' ');
        } else if (flags['0']) {
          result = sign + prefix + w.pad('', gap, '0') + value;
        } else {
          result = w.pad('', gap, ' ') + sign + prefix + value;
        }
        if (type === 'X') {
          result = result.toUpperCase();
        }
        return result;
      }
    };

    return f;

  })(w);


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
     * Create a debugger with the given `name`.
     *
     * @param {string} name the name.
     * @return {function} the debugger.
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
     * Humanize the given `ms`.
     *
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
     * Enable debug modes.
     *
     * @param {string} name debug mode name
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
     * Disable debug modes.
     * Call this function without an argument to disable all debug modes.
     *
     * @param {?string} name debug mode name
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
     *
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
      length = w.max([length, 0]);
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
