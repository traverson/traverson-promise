'use strict'

var traverson = require('traverson')
var Promise = require('any-promise')
var Builder = traverson._Builder

var originalMethods = {
  get: Builder.prototype.get,
  getResource: Builder.prototype.getResource,
  getUrl: Builder.prototype.getUrl,
  post: Builder.prototype.post,
  put: Builder.prototype.put,
  patch: Builder.prototype.patch,
  delete: Builder.prototype.delete
}

function defer () {
  var resolve = void 0
  var reject = void 0

  var promise = new Promise(function () {
    resolve = arguments[0]
    reject = arguments[1]
  })

  return {
    resolve: resolve,
    reject: reject,
    promise: promise
  }
}

function promisify (context, originalMethod) {
  var argsArray = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2]

  var deferred = defer()
  var traversal = void 0

  var callback = function callback (err, result, _traversal) {
    traversal = _traversal

    if (err) {
      err.result = result
      err.traversal = traversal
      deferred.reject(err)
    } else {
      deferred.resolve(result)
    }
  }

  argsArray.push(callback)

  var traversalHandler = originalMethod.apply(context, argsArray)

  function continueTraversal () {
    var deferredContinue = defer()

    deferred.promise.then(function () {
      return deferredContinue.resolve(traversal.continue())
    }, function () {
      throw new Error('Can\'t continue from a broken traversal.')
    })

    return deferredContinue.promise
  }

  return {
    result: deferred.promise,
    resultWithTraversal: function() {
      return deferred.promise.then(function(result) {
        return {
          result: result,
          traversal: traversal
        }
      })
    },
    continue: continueTraversal,
    abort: traversalHandler.abort,
    then: function then () {
      throw new Error('As of version 2.0.0, Traverson\'s action methods ' + 'do no longer return the promise directly. Code like \n' + 'traverson.from(url).follow(...).getResource().then(...)\n' + 'needs to be changed to \n' + 'traverson.from(url).follow(...).getResource().result.then(...)')
    }
  }
}

Builder.prototype.get = function () {
  return promisify(this, originalMethods.get)
}

Builder.prototype.getResource = function () {
  return promisify(this, originalMethods.getResource)
}

Builder.prototype.getUrl = Builder.prototype.getUri = function () {
  return promisify(this, originalMethods.getUrl)
}

Builder.prototype.post = function (body) {
  return promisify(this, originalMethods.post, [body])
}

Builder.prototype.put = function (body) {
  return promisify(this, originalMethods.put, [body])
}

Builder.prototype.patch = function (body) {
  return promisify(this, originalMethods.patch, [body])
}

Builder.prototype.delete = Builder.prototype.del = function () {
  return promisify(this, originalMethods.delete)
}

module.exports = traverson
