'use strict'

var fs = require('vigour-fs-promised')
var path = require('path')
var test = require('tape')
var Service = require('../')

test('Service', function (t) {
  t.plan(4)
  var service = new Service({
    url: fs.createReadStream(path.join(__dirname, 'data.json')),
    strategy: '@vigour-io/seo-mtv',
    dest: __dirname
  })
  var replacingSitemapFired = false
  var replacingJsonldsFired = false
  service.on('replacingSitemap', () => {
    replacingSitemapFired = true
  })
  service.on('sitemap', (loc) => {
    t.equal(replacingSitemapFired, true, '`replacingSitemap` fired before `sitemap`')
    fs.removeAsync(loc)
      .then(() => {
        t.equal(loc, path.join(__dirname, 'sitemap.xml'), "emits the produced sitemap's path")
      })
  })
  service.on('replacingJsonlds', () => {
    replacingJsonldsFired = true
  })
  service.on('jsonlds', (dir) => {
    t.equal(replacingJsonldsFired, true, '`replacingJsonlds` fired before `jsonlds`')
    fs.removeAsync(dir)
      .then(() => {
        t.equal(dir, path.join(__dirname, 'jsons'), 'emits the jsonld dir path')
      })
  })
  service.start()
})
