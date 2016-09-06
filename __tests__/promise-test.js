const traversonPromise = require('../traverson-promise')

describe('traverson-promise: ', () => {
  let rootUri = 'http://swapi.co/api/people/'
  let payload = {'some': 'data'}
  let api = null

  beforeEach(() => {
    api = traversonPromise.from(rootUri).json()
  })

  /**
   * According to Promises/A+, object that contains a then function will be considered a promise
   * Theses tests are simple and naive, should test more later on
   */
  it('get should return a promise object after called', () => {
    let ret = api.newRequest().get()
    expect(typeof ret.then).toBe('function')
  })

  it('getResource should return a promise object after called', () => {
    let ret = api.newRequest().getResource()
    expect(typeof ret.then).toBe('function')
  })

  it('getUrl should return a promise object after called', () => {
    let ret = api.newRequest().getUrl()
    expect(typeof ret.then).toBe('function')
  })

  it('post should return a promise object after called', () => {
    let ret = api.newRequest().post(payload)
    expect(typeof ret.then).toBe('function')
  })

  it('put should return a promise object after called', () => {
    let ret = api.newRequest().put(payload)
    expect(typeof ret.then).toBe('function')
  })

  it('patch should return a promise object after called', () => {
    let ret = api.newRequest().patch(payload)
    expect(typeof ret.then).toBe('function')
  })

  it('delete should return a promise object after called', () => {
    let ret = api.newRequest().delete()
    expect(typeof ret.then).toBe('function')
  })

  it('del should return a promise object after called', () => {
    let ret = api.newRequest().del()
    expect(typeof ret.then).toBe('function')
  })
})
