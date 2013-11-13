var EventEmitter = require('events').EventEmitter
var util = require('util')


function Queue() {
  var _this = this
  this.queue = []
  this.state = 'open'
  this.bufferedPushes = []
  EventEmitter.call(this)

  this.once('newListener', function() {
    _this.bufferedPushes.forEach(function(data) { 
      _this.queue.push(data)
      process.nextTick(function() { _this.emit('push') })
    })

    _this.bufferedPushes = []
  })

}

util.inherits(Queue, EventEmitter)

Queue.prototype.close = function() {
  this.state = 'closed'
}

Queue.prototype.pop = function() {
  var _this = this

  if (this.queue.length > 0) {
    var value = this.queue.shift()
    if (this.queue.length === 0 && this.state === 'closed') {
      process.nextTick(function() { _this.emit('drain') })
    }

    return value
  }
}

Queue.prototype.push = function(data) {
  if (EventEmitter.listenerCount(this, 'push') > 0) {
    this.queue.push(data)
    this.emit('push')
  } else {
    this.bufferedPushes.push(data)
  }
}

module.exports = Queue
