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
