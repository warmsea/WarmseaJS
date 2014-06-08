define([
  '../core'
], function(w) {
  'use strict';
// $HEADER$

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

// $FOOTER$
  return w;
});
