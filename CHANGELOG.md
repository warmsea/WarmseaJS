Version 1.0.1 (2014-10-24)
==========================

New Features
------------

* Arrays
  * w.sorted()


Version 1.0.0 (2014-10-07)
==========================

WarmseaJS v1.0.0 is designed to be a drop-in replacement of underscore.js with
`var _ = warmsea;` executed. It is fully compatible with underscore.js v1.7.0
with two exceptions, `.VERSION` and `.noConflict()`. Both functions works for
warmsea but underscore.

Here's a list of all the features WarmseaJS provided besides underscore
functions.

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


Version 0.5.0 (2014-06-08)
==========================

[Underscore.js](http://underscorejs.org/) includes a lot of functions I want
in my **WarmseaJS**, so why bother writing my own. So some functions are
replaced with equivalents in `underscore.js`.

New Features
------------

* Arrays
  * w.inArray()
  * w.indexOf()
  * w.all()
  * w.any()
  * w.each()
  * w.map()
  * w.reduce()
  * w.filter()
* Debug
  * w.debug()
  * w.debug.disable()
  * w.debug.enable()
  * w.debug.enabled()
* Types
  * w.deepcopy()
  * w.extend()

Changes
-------

* Core
  * w.range() and w.sort() are moved from Core to Arrays
* Math
  * w.min() and w.max() are changed to underscore.js style


Version 0.4.0 (2014-05-03)
==========================

New Features
------------

* Node.js support
* Types
  * w.isInt()
* Random
  * w.random()
  * w.randomInt()
  * w.randomFloat()
  * w.randomString()
* Collections
  * w.Queue - (*Queue, the class*)
    * w.Queue.allowEmptyDequeue
    * w.Queue.length
    * w.Queue.clear()
    * w.Queue.enqueue()
    * w.Queue.dequeue()
    * w.Queue.peek()
  * w.Stack - (*Stack, the class*)
    * w.Stack.allowEmptyPop
    * w.Stack.length
    * w.Stack.clear()
    * w.Stack.push()
    * w.Stack.pop()
    * w.Stack.peek()

Enhancements
------------

* Core
  * w.error() will be powered by w.format() is Strings Module is loaded.

And some other bugfix and minor changes...


Version 0.3.0 (2014-04-01)
==========================

The first official release after refactoring.

New Features
------------

* ```<script>``` support and RequireJS support
* Core
  * w - (*warmsea, the namespace*)
  * w.noop()
  * w.identity()
  * w.unimplemented()
  * w.error()
  * w.cmp()
  * w.keys()
  * w.values()
  * w.range()
  * w.sort()
* Types
  * w.bool()
  * w.i()
  * w.f()
  * w.str()
  * w.array()
  * w.isNumber()
  * w.isString()
  * w.isArray()
  * w.isFunction()
  * w.isPlainObject()
  * w.isObject()
* Math
  * w.min()
  * w.max()
* String
  * w.pad()
  * w.format()
