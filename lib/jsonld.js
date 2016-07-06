'use strict'

var path = require('path')
var fs = require('vigour-fs-promised')
var log = require('./logger')

class JsonLd {
  constructor (dest) {
    this.dest = dest // The directory to write jsonld files to
    this.items = [] // Promises for items being written to file
    log.info('Writing jsonld files to ' + this.dest + '/')
  }

  fail (err) {
    log.error('Faild to make jsonld files', err)
    return fs.unlinkAsync(this.dest)
  }

  add (item) {
    var filename = item.filename
    var dest = path.join(this.dest, filename)
    delete item.filename
    // log.info('jsonld', dest, item)
    this.items.push(fs.writeJSONAsync(dest, item, { mkdirp: true }))
  }

  finish () {
    return Promise.all(this.items).then(() => {
      log.info('Finished writing all jsonld files into ' + this.dest + '/')
    })
  }
}

module.exports = exports = JsonLd
