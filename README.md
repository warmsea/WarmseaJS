WarmseaJS
=========


Features
--------

**WarmseaJS** has the following features:

1. Type casting and testing
2. String formatting
3. And some other features

There is a brief introduction below.

You can also run `grunt jsdoc` to generate the API documentation. Or check the
[online version](http://warmsea.github.io/warmseajs/jsdoc/).

Get Started
-----------

Download
[**WarmseaJS**](https://github.com/warmsea/WarmseaJS/releases/download/v0.3.0/warmseajs-v0.3.0.zip)
and include it with `<script>` tag or [**RequireJS**](http://requirejs.org/).
When included with `<script>` tag, a global namespace `warmsea` will be
introduced. And personally, I use `w` as a shortcut for `warmsea`.

```html
<script src="path/to/warmsea.min.js"></script>
<script>
  var w = warmsea;
  ...
</script>
```

```javascript
require(['warmsea'], function(w) {
  ...
});
```

You may need to configure **RequireJS** before you can require **WarmseaJS**
with it.

Then, you can use all the APIs from **WarmseaJS**. For example:

```javascript
var name = 'warmsea';
var msg = w.format('Hello, %s!', );
console.log(msg);  // `Hello, warmsea!` will be printed.
```


Type casting and testing
------------------------

Type casting and testing feature is from the `warmsea/types` module. It
contains the following functions:

* warmsea.bool(value)
* warmsea.i(value)  *// i for integer*
* warmsea.f(value)  *// f for float*
* warmsea.str(value)
* warmsea.array(value)
* warmsea.isNumber(value)
* warmsea.isString(value)
* warmsea.isArray(value)
* warmsea.isFunction(value)
* warmsea.isPlainObject(value)
* warmsea.isObject(value)

Examples:

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
w.isString('0xff');           // true
w.isArray([]);                // true
w.isFunction(w.isFunction);   // true
w.isPlainObject({'a': '1'});  // true
w.isPlainObject(new Date());  // false
w.isObject(new Date());       // true
w.isObject([]);               // true
```


String formatting
-----------------

String formatting feature is from the `warmsea/types` module. It contains the
following functions:

* w.pad(value, length, leading)
* w.format(format, ...)

Examples:

```javascript
// pad
w.pad('hello', 8, '#'); // '###hello' 
w.pad(7, 3, 0);         // '007'
w.pad('x', 5, 'abc');   // 'abcax'
```

```javascript
// format
w.format('Hello, %s!', 'warmsea');     // 'Hello, warmsea!'
w.format('%04d%02d%02d', 2004, 4, 1);  // '20040401'
w.format('%x', 255);                   // 'ff'
w.format('%#X', 255);                  // '0XFF'
w.format('%+8.2f', 123.456);           // ' +123.46'
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


Other features
--------------

There is a few other functions.

Function                   | Description
-------------------------- | -----------
w.noop()                   | An empty function
w.identify(value)          | Retures value itself*
w.unimplemented()          | Throws an error*
w.error(msg)               | Throws an error with a message*
w.cmp(a, b)                | Compare values with `>` and `<`
w.keys(obj)                | Returns keys of an object
w.values(obj)              | Returns values of an object
w.range(start, stop, step) | Generates an array
w.sort(arr, cmp)           | An in-place stable sorter
w.max(...)                 | Returns the maximum value
w.min(...)                 | Returns the minimum value

Examples:

```javascript
var obj = {
  'js': 'JavasSript',
  'py': 'Python'
};
w.keys(obj);                    // ['js', 'py']
w.values(obj);                  // ['JavaScript', 'Python']

w.range(5);                     // [0, 1, 2, 3, 4]
w.range(1, 9, 2);               // [1, 3, 5, 7]
w.range(9, 1, -2);              // [9, 7, 5, 3]

w.min([2, 3, 5, 8, 13]);        // 2
w.min(2, 3, 5, 8, 13);          // 2

function func = function() {
  return w.cmp(w.str(a), w.str(b));
}
w.min(func, [2, 3, 5, 8, 13]);  // 13
w.min(func, 2, 3, 5, 8, 13);    // 13
```
