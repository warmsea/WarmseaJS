define([
  '../core'
], function(w) {
  'use strict';
// $HEADER$

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
     * @return {any} The object at the beginning of the Queue.
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
     * @return {any} The object at the beginning of the Queue.
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

// $FOOTER$
  return w;
});
