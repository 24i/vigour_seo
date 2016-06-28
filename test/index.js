'use strict'

var fs = require('vigour-fs-promised')
var path = require('path')
var test = require('tape')
var Service = require('../')

test('Service', function (t) {
  t.plan(2)
  var service = new Service({
    url: fs.createReadStream(path.join(__dirname, 'data.json')),
    strategy: 'seo-mtv',
    dest: __dirname
  })
  service.on('sitemap', (loc) => {
    fs.removeAsync(loc)
      .then(() => {
        t.equal(loc, path.join(__dirname, 'sitemap.xml'), "emits the produced sitemap's path")
      })
  })
  service.on('jsonlds', (dir) => {
    fs.removeAsync(dir)
      .then(() => {
        t.equal(dir, path.join(__dirname, 'jsons'), 'emits the jsonld dir path')
      })
  })
  service.start()
})
