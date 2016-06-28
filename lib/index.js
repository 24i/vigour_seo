'use strict'

var EventEmitter = require('events')

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
    }
    if (!options.dest) {
      options.dest = process.cwd()
    }
    this.options = options
  }

  start (options) {
    this.Parser = require(this.options.strategy)
    console.log('Producing sitemap and jsonld files')
    this.produceAssets()
      .then(() => {
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
      console.log(`Waiting ${this.options.delay / 60 / 60} minutes before retry`)
      setTimeout(resolve, this.options.delay)
    })
  }
}

Service.prototype.produceAssets = require('./produceassets.js')

module.exports = exports = Service
