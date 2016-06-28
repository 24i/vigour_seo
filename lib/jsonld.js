'use strict'

var fs = require('vigour-fs-promised')

class JsonLd {
  constructor (dest) {
    this.dest = dest // The directory to write jsonld files to
    this.items = [] // Promises for items being written to file
    console.log('Writing jsonld files to ' + this.dest)
  }

  fail (err) {
    console.error('Faild to make jsonld files', err)
    return fs.unlinkAsync(this.dest)
  }

  add (page) {
    var filename = this.dest + '/shows.' + page.region + '.' + page.showid + '.' + page.partOfSeason + '.' + page.episodeNumber + '.json'
    this.items.push(fs.writeJSONAsync(filename, {
      '@context': page['@context'],
      '@type': page['@type'],
      name: page.name,
      description: page.description,
      datePublished: page.datePublished,
      episodeNumber: page.episodeNumber,
      partOfTVSeries: page.partOfTVSeries,
      partOfSeason: page.partOfSeason,
      url: page.url
    }, { mkdirp: true }))
  }

  finish () {
    return Promise.all(this.items).then(() => {
      console.log('jsonld filese finished', this.dest)
      return this.dest
    })
  }
}

module.exports = exports = JsonLd
