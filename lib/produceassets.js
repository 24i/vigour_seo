'use strict'

var path = require('path')
var fs = require('vigour-fs-promised')
var log = require('./logger')
var Sitemap = require('./sitemap')
var JsonLd = require('./jsonld')
var isUrl = require('vigour-util/is/url')

module.exports = exports = function produceAssets () {
  return new Promise((resolve, reject) => {
    var sitemapDest = path.join(this.options.dest, 'sitemap.xml')
    var tempSitemapDest = sitemapDest + '.temp'
    var jsonldDest = path.join(this.options.dest, 'jsons')
    var tempJsonldDest = jsonldDest + '.temp'
    if (isUrl(this.options.url)) {
      log.info('Getting data from ', this.options.url)
    } else {
      log.info('Getting data from ReadStream')
    }
    var parser = new this.Parser(this.options.url, { appUrl: this.options.appUrl })
    var sitemap = new Sitemap({
      dest: tempSitemapDest,
      freq: 0.8,
      priority: 'monthly'
    })
    var jsonLd = new JsonLd(tempJsonldDest)

    sitemap.start()
    parser.on('error', function (err) {
      reject(Promise.all([
        sitemap.fail(err),
        jsonLd.fail(err)
      ]))
    })
    parser.on('sitemap', function (item) {
      sitemap.add(item)
    })
    parser.on('jsonld', function (item) {
      jsonLd.add(item)
    })
    parser.on('end', () => {
      resolve(Promise.all([
        sitemap.finish()
          .then(() => {
            this.emit('replacingSitemap')
            return fs.removeAsync(sitemapDest)
          })
          .then(() => {
            return fs.renameAsync(tempSitemapDest, sitemapDest)
          })
          .then(() => {
            this.emit('sitemap', sitemapDest)
          })
          .catch((reason) => {
            sitemap.fail(reason)
          }),
        jsonLd.finish()
          .then(() => {
            this.emit('replacingJsonlds')
            return fs.removeAsync(jsonldDest)
          })
          .then(() => {
            return fs.renameAsync(tempJsonldDest, jsonldDest)
          })
          .then(() => {
            this.emit('jsonlds', jsonldDest)
          })
          .catch((reason) => {
            jsonLd.fail(reason)
          })
      ]))
    })
    parser.parse()
  })
}
