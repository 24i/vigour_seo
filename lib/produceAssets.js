'use strict'

var path = require('path')
var Sitemap = require('./sitemap')
var JsonLd = require('./jsonld')

module.exports = exports = function produceAssets () {
  return new Promise((resolve, reject) => {
    console.log('Getting data')
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
    parser.on('page', function (page) {
      sitemap.add(page)
      jsonLd.add(page)
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
