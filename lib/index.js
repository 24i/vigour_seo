'use strict'

var EventEmitter = require('events')
var log = require('./logger')

class Service extends EventEmitter {
  constructor (options) {
    super()
    if (!options) {
      options = {}
    }
    if (!options.strategy) {
      throw new Error('Invalid config: missing strategy')
    }
    if (!options.url) {
      throw new Error('Invalid config: missing url')
    }
    if (!options.delay) {
      options.delay = -1 // negative number: don't repeat
    } else {
      options.delay = parseInt(options.delay, 10)
    }
    if (!options.dest) {
      options.dest = process.cwd()
    }
    this.options = options
  }

  start (options) {
    this.Parser = require(this.options.strategy)
    this.startTime = Date.now()
    this.produceAssets()
      .then(() => {
        var delta = Date.now() - this.startTime
        log.info(`Done in ${delta / 1000}s`)
        if (this.options.delay >= 0) {
          return this.wait()
            .then(() => {
              this.start(options)
            })
        }
      })
  }

  wait () {
    return new Promise((resolve, reject) => {
      log.info('Next run: ' + new Date(Date.now() + this.options.delay) + '\n')
      setTimeout(() => {
        resolve()
      }, this.options.delay)
    })
  }
}

Service.prototype.produceAssets = require('./produceassets.js')

module.exports = exports = Service
