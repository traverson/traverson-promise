'use strict'

const traverson = require('traverson')
const Promise = require('bluebird')
const Builder = traverson._Builder

let originalMethods = {
  get: Builder.prototype.get,
  getResource: Builder.prototype.getResource,
  getUrl: Builder.prototype.getUrl,
  post: Builder.prototype.post,
  put: Builder.prototype.put,
  patch: Builder.prototype.patch,
  delete: Builder.prototype.delete
}

function defer () {
  let resolve, reject

  const promise = new Promise(function () {
    resolve = arguments[0]
    reject = arguments[1]
  })

  return {
    resolve,
    reject,
    promise
  }
}

function promisify (context, originalMethod, argsArray = []) {
  const deferred = defer()
  let traversal

  const callback = function (err, result, _traversal) {
    if (err) {
      err.result = result
      deferred.reject(err)
    } else {
      traversal = _traversal
      deferred.resolve(result)
    }
  }

  argsArray.push(callback)

  const traversalHandler = originalMethod.apply(context, argsArray)

  function continueTraversal () {
    const deferredContinue = defer()

    deferred.promise.then(
      () => deferredContinue.resolve(traversal.continue()),
      () => { throw new Error('Can\'t continue from a broken traversal.') }
    )

    return deferredContinue.promise
  }

  return {
    result: deferred.promise,
    continue: continueTraversal,
    abort: traversalHandler.abort,
    then: function () {
      throw new Error('As of version 2.0.0, Traverson\'s action methods ' +
        'do no longer return the promise directly. Code like \n' +
        'traverson.from(url).follow(...).getResource().then(...)\n' +
        'needs to be changed to \n' +
        'traverson.from(url).follow(...).getResource().result.then(...)')
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
