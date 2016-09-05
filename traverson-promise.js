'use strict'

var traverson = require('traverson')
var Promise = require('bluebird')

var Builder = traverson._Builder
var methodList = [
  'get',
  'getResource',
  'getUrl',
  'post',
  'put',
  'patch',
  'delete',
  'del'
]

for (var i = 0, len = methodList.length; i < len; i++) {
  var methodName = methodList[i]
  var originalMethod = Builder.prototype[methodName]

  if (originalMethod) {
    Builder.prototype[methodName] = Promise.promisify(originalMethod)
  }
}

module.exports = traverson
