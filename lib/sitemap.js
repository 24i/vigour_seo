'use strict'

var fs = require('vigour-fs-promised')

class Sitemap {
  constructor (options) {
    this.options = options
    this.prefix = '<?xml version=\'1.0\' encoding=\'UTF-8\'?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
    this.suffix = '</urlset>'
  }

  start () {
    if (this.ws) {
      throw new Error('Sitemap already started')
    }
    console.log('Writing sitemap to ' + this.options.dest)
    this.ws = fs.createWriteStream(this.options.dest)
    this.ws.write(this.prefix)
  }

  fail (err) {
    console.error('Failed to make sitemap', err)
    this.ws.end()
    return fs.unlinkAsync(this.options.dest)
  }

  add (page) {
    // console.log('Adding to sitemap', page)
    var xml = '\n  <url>'
    xml += '\n    <loc>' + page.url + '</loc>'
    xml += '\n    <changefreq>' + this.options.freq + '</changefreq>'
    xml += '\n    <priority>' + this.options.priority + '</priority>'
    xml += '\n  </url>\n'
    this.ws.write(xml)
  }

  finish () {
    this.ws.write(this.suffix)
    this.ws.end()
    this.ws = null
    console.log('sitemap finished', this.options.dest)
    return Promise.resolve(this.options.dest)
  }
}

module.exports = exports = Sitemap
