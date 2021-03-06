'use strict'

var fs = require('vigour-fs-promised')
var log = require('./logger')
var ifExistsAsync = require('./if-exists-async')
var unlinkIf = ifExistsAsync(fs.unlinkAsync)
class Sitemap {
  constructor (options) {
    this.options = options
    this.prefix = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
    this.suffix = '</urlset>'
    this.added = {}
  }

  start () {
    if (this.ws) {
      throw new Error('Sitemap already started')
    }
    log.info('Writing sitemap to ' + this.options.dest)
    this.ws = fs.createWriteStream(this.options.dest)
    this.ws.write(this.prefix)
  }

  fail (err) {
    log.error('Failed to make sitemap', err)
    this.ws.end()
    return unlinkIf(this.options.dest)
  }

  add (item) {
    if (!this.added[item.url]) {
      this.added[item.url] = true
      // log.info('Adding to sitemap', item)

      var xml = '\n  <url>'
      xml += '\n    <loc>' + item.url + '</loc>'
      xml += '\n    <changefreq>' + this.options.freq + '</changefreq>'
      xml += '\n    <priority>' + this.options.priority + '</priority>'
      xml += '\n  </url>\n'
      // log.info('xml', xml)
      this.ws.write(xml)
    }
  }

  finish () {
    this.ws.write(this.suffix)
    this.ws.end()
    this.ws = null
    log.info('Finished writing sitemap', this.options.dest)
    return Promise.resolve()
  }
}

module.exports = exports = Sitemap
