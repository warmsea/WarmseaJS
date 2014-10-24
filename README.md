WarmseaJS
=========


Features
--------

**WarmseaJS** is yet another JavaScript utility library.

WarmseaJS v1.0.0 is designed to be a drop-in replacement of underscore.js with
`var _ = warmsea;` executed. It is fully compatible with underscore.js v1.7.0
with two exceptions, `.VERSION` and `.noConflict()`. Both functions works for
warmsea but underscore.

It provides more feature besides underscore functions, such as:

1. Type casting and testing
1. String formatting
1. Debugger
1. Collections
1. And more...


Get Started
-----------

### Node.js

Install **WarmseaJS** with NPM:

```bash
npm install warmsea
```

Then, you can use all the APIs from **WarmseaJS**. For example:

```javascript
var w = require('warmsea');

var name = 'warmsea';
var msg = w.format('Hello, %s!', name);
console.log(msg);  // `Hello, warmsea!` will be printed.
```

### Browser

Download **WarmseaJS**:

* [The compressed, production WarmseaJS, as a single JS file](https://raw.githubusercontent.com/warmsea/WarmseaJS/master/dist/warmsea.min.js)
* [The uncompressed, development WarmseaJS, as a single JS file](https://raw.githubusercontent.com/warmsea/WarmseaJS/master/dist/warmsea.js)

Include the JS file with `<script>` tag or [**RequireJS**](http://requirejs.org/).
When included with `<script>` tag, a global namespace `warmsea` will be
introduced. Personally, I use `_` or `w` as a shortcut of `warmsea`. You can
use anything else you like, or just use `warmsea`. In this README file, `w` is
used as the shortcut of `warmsea`.


```html
<script src="path/to/warmsea.min.js"></script>
<script>
  var _ = warmsea;
  ...
</script>
```

```javascript
require(['warmsea'], function(_) {
  ...
});
```

You may need to configure **RequireJS** before you can require **WarmseaJS**
with it.

Then, you can use all the APIs from **WarmseaJS**. For example:

```javascript
var name = 'warmsea';
var msg = w.format('Hello, %s!', name);
console.log(msg);  // `Hello, warmsea!` will be printed.
```


Features not in underscore
--------------------------

### Core Module

#### w.error()

Throws an Error with a specified message.

```javascript
w.error();
// throw new Error();

w.error('invalid');
// throw new Error('invalid');

w.error('[%s] invalid', (new Date()).toISOString());
// throw new Error('[2014-10-09T11:27:19.158Z] invalid');
// w.error() is powered by w.format(), so format feature is provided.
```

#### w.unimplemented()

Throws an Error says "Unimplemented".

### Arrays Module

#### w.inArray()

`w.inArray()` is powered by `_.indexOf()`.

```javascript
w.inArray([1, 2, 3], 2);  // Returns true
w.inArray([1, 2, 3], 4);  // Returns false
```

#### w.sort()

`w.sort(list, cmp, context)` is a in-place sort function. It returns `list`
after it is sorted.

```javascript
w.sort([-3, -1, 2, 4], function(a, b) {
  return w.cmp(a * a, b * b);
});
// Returns [-1, 2, -3, 4]
```

#### w.sorted()

Almost the same as `w.sorted()` except it doesn't change the original array,
but returns a sorted shallow copied one.

### Collections Module

Collections module provides two classes: `w.Stack` and `w.Queue`.

* Collections
  * w.Queue - (*Queue, the class*)
    * w.Queue.prototype.allowEmptyDequeue
    * w.Queue.prototype.length
    * w.Queue.prototype.clear()
    * w.Queue.prototype.count()
    * w.Queue.prototype.enqueue()
    * w.Queue.prototype.dequeue()
    * w.Queue.prototype.peek()
  * w.Stack - (*Stack, the class*)
    * w.Stack.prototype.allowEmptyPop
    * w.Stack.prototype.length
    * w.Stack.prototype.clear()
    * w.Stack.prototype.count()
    * w.Stack.prototype.push()
    * w.Stack.prototype.pop()
    * w.Stack.prototype.peek()

### Debug Modele

```javascript
// Create a debugger with the specified name.
var dbg = w.debug('business:account');

// All debuggers are disabled by default.

// Enable a debugger.
w.debug.enable('business:account');

// Enable all debuggers start with "business:".
w.debug.enable('business:*');

// Disable a debugger.
w.debug.disable('business:someName');

// Call a debugger. If it is enabled, it will print the debug message.
// If not, nothing happens.
dbg('Debug Message');

// Debuggers can be enabled or disabled before OR after their creations.
w.debug.enable('*');          // Enable all debuggers.
var dbg1 = w.debug('hello');  // It is enabled.

// Check if a name is enabled.
w.debug.enabled('someName');
```

### Math Module

#### w.cmp()

```javascript
w.cmp = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
};
```

### Objects Module

#### w.hideProperties()

Make some properties not enumerable. Only works in ES5.

```javascript
var obj = {
  a: 1,
  b: 2
};

w.keys(obj);  // Returns ["a", "b"]

w.hideProperties(obj, ['a']);

w.keys(obj);  // Returns ["b"]
```

#### w.memoizedProperty()

`w.memoizedProperty(obj, name, getter, enumerable=true)` adds a memoized property
to an object.

In ES5, the property is initialized with `getter` during the first access, and
then the value is remembered. But in ES4, the property is initialized
immediately.

```javascript
var obj = {};
w.memoizedProperty(obj, '_date', function() {
  return new Date();
}, false);

```

### Random Module

Random module contains 3 functions: `w.randomInt()`, `w.randomFloat`, and
`randomString()`.

Function                             | Description
-------------------------------------|------------
w.randomInt(stop)                    | Returns an integer in [0, stop)
w.randomInt(start, stop)             | Returns an integer in [start, stop)
w.randomFloat(stop)                  | Returns a number in [0, stop)
w.randomFloat(start, stop)           | Returns a number in [start, stop)
w.randomString(length, allowedChars) | Returns a random string

### Strings Module

#### w.pad()

```javascript
// pad
w.pad('hello', 8, '#'); // '###hello'
w.pad(7, 3, 0);         // '007'
w.pad('x', 5, 'abc');   // 'abcax'
```

#### w.format()

```javascript
// format
w.format('Hello, %s!', 'warmsea');     // 'Hello, warmsea!'
w.format('%04d%02d%02d', 2004, 4, 1);  // '20040401'
w.format('%x', 255);                   // 'ff'
w.format('%#X', 255);                  // '0XFF'
w.format('%+8.2f', 123.456);           // ' +123.46'

w.format('%(year)04d-%(month)02d-%(day)02d',
         {year: 2004, month: 4, day: 1});        // '2014-04-01'
w.format('To %(action)s, or not to %(action)s.',
         {action: 'do'});                        // 'To do, or not to do.'
```

```javascript
// Multi-line format
var template = function() {
    /*!<<<EOD
     Hello,
       %s!
     EOD*/
};
w.format(template, 'warmsea');  // 'Hello,
                                // '  warmsea!

w.format(function() {
    /*<<<EOD;WS-KEEP
     Hello,
       space!
     EOD*/
});                             // '     Hello,
                                // '       space!
```

### Types Module

```javascript
// type casting
w.bool(1);         // true
w.i('35');         // 35
w.i('0xff');       // 255
w.f('1.35e3');     // 1350
w.str(1.35e3);     // '1350'
w.array();         // []
w.array('hello');  // ['hello']
```

```javascript
// type testing
w.isNumber(0xff);             // true
w.isNumber('0xff');           // false
w.isInt(1);                   // true
w.isString('0xff');           // true
w.isArray([]);                // true
w.isFunction(w.isFunction);   // true
w.isPlainObject({'a': '1'});  // true
w.isPlainObject(new Date());  // false
w.isObject(new Date());       // true
w.isObject([]);               // true
```

A full list of APIs not in underscore
=====================================

Here, I use `w` as the shortcut of `warmsea`.

* Core
  * w._ = w.underscore
  * w.VERSION
  * w.global
  * w.noConflict()
  * w.unimplement()
  * w.error()
* Arrays
  * w.inArray()
  * w.sort()
  * w.sorted()
* Collections
  * w.Queue - (*Queue, the class*)
    * w.Queue.prototype.allowEmptyDequeue
    * w.Queue.prototype.length
    * w.Queue.prototype.clear()
    * w.Queue.prototype.count()
    * w.Queue.prototype.enqueue()
    * w.Queue.prototype.dequeue()
    * w.Queue.prototype.peek()
  * w.Stack - (*Stack, the class*)
    * w.Stack.prototype.allowEmptyPop
    * w.Stack.prototype.length
    * w.Stack.prototype.clear()
    * w.Stack.prototype.count()
    * w.Stack.prototype.push()
    * w.Stack.prototype.pop()
    * w.Stack.prototype.peek()
* Debug
  * w.debug()
  * w.debug.disable()
  * w.debug.enable()
  * w.debug.enabled()
* Math
  * w.cmp()
* Objects
  * w.hideProperties()
  * w.memoizedProperty()
* Random
  * w.randomFloat()
  * w.randomInt()
  * w.randomString()
* Strings
  * w.pad()
  * w.format()
* Types
  * w.array()
  * w.bool()
  * w.f()
  * w.i()
  * w.isInt()
  * w.isPlainObject()
  * w.str()
