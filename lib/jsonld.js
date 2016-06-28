'use strict'

var fs = require('vigour-fs-promised')

class JsonLd {
  constructor (dest) {
    this.dest = dest // The directory to write jsonld files to
    this.items = [] // Promises for items being written to file
    console.log('Writing jsonld files to ' + this.dest + '/')
  }

  fail (err) {
    console.error('Faild to make jsonld files', err)
    return fs.unlinkAsync(this.dest)
  }

  add (item) {
    var filename = this.dest + '/shows.' + item.region + '.' + item.showid + '.' + item.partOfSeason + '.' + item.episodeNumber + '.json'
    this.items.push(fs.writeJSONAsync(filename, {
      '@context': item['@context'],
      '@type': item['@type'],
      name: item.name,
      description: item.description,
      datePublished: item.datePublished,
      episodeNumber: item.episodeNumber,
      partOfTVSeries: item.partOfTVSeries,
      partOfSeason: item.partOfSeason,
      url: item.url
    }, { mkdirp: true }))
  }

  finish () {
    return Promise.all(this.items).then(() => {
      console.log('Finished writing all jsonld files into ' + this.dest + '/')
      return this.dest
    })
  }
}

module.exports = exports = JsonLd
