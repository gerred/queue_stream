var expect = require('chai').expect
var Queue = require('../')

describe('Queue', function() {
  it('should pop the same value when a listener is present', function(done) {
    var queue = new Queue()

    queue.push('hello')
    queue.close()

    queue.on('push', function() {
      expect(queue.pop()).to.equal('hello')
    })

    queue.on('drain', function() {
      done()
    })
  })

  it('should buffer multiple items when no listeners are present', function(done) {
    var queue = new Queue()

    queue.push('hello')
    queue.push('jkljklj')
    queue.push('kljdlkjfklja')
    queue.close()
    var buffer = []

    queue.on('push', function() {
      buffer.push(queue.pop())
    })

    queue.on('drain', function() {
      expect(buffer.length).to.equal(3)
      done()
    })
  })
})
