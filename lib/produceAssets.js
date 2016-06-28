'use strict'

var path = require('path')
var log = require('./logger')
var Sitemap = require('./sitemap')
var JsonLd = require('./jsonld')
var isUrl = require('vigour-util/is/url')

module.exports = exports = function produceAssets () {
  return new Promise((resolve, reject) => {
    if (isUrl(this.options.url)) {
      log.info('Getting data from ', this.options.url)
    } else {
      log.info('Getting data from ReadStream')
    }
    var parser = new this.Parser(this.options.url)
    var sitemap = new Sitemap({
      dest: path.join(this.options.dest, 'sitemap.xml'),
      freq: 0.8,
      priority: 'monthly'
    })
    var jsonLd = new JsonLd(path.join(this.options.dest, 'jsons'))

    sitemap.start()
    parser.on('error', function (err) {
      reject(Promise.all([
        sitemap.fail(err),
        jsonLd.fail(err)
      ]))
    })
    parser.on('page', function (item) {
      sitemap.add(item)
    })
    parser.on('jsonld', function (item) {
      jsonLd.add(item)
    })
    parser.on('end', () => {
      resolve(Promise.all([
        sitemap.finish().then((loc) => {
          this.emit('sitemap', loc)
        }),
        jsonLd.finish().then((dir) => {
          this.emit('jsonlds', dir)
        })
      ]))
    })
    parser.parse()
  })
}
