'use strict'

var fs = require('vigour-fs-promised')
module.exports = exports = function (fn) {
  return function () {
    var args = arguments
    return fs.existsAsync(args[0])
      .then((exists) => {
        if (exists) {
          return fn.apply(this, args)
        }
      })
  }
}
