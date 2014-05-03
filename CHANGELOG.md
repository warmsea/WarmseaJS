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

* <script> support and RequireJS support
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
