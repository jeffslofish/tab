/* eslint-env jest */
/* globals process */

import { externalRedirect, isURLForDifferentApp } from 'js/navigation/utils'
import { getUrlParameters } from 'js/utils/utils'

const mockBrowserHistory = {
  push: jest.fn(),
  replace: jest.fn(),
}
jest.mock('history', () => ({
  createBrowserHistory: jest.fn(() => mockBrowserHistory),
}))
jest.mock('js/navigation/utils')
jest.mock('js/utils/utils')

beforeAll(() => {
  process.env.REACT_APP_WEBSITE_PROTOCOL = 'https'
})

beforeEach(() => {
  getUrlParameters.mockReturnValue({})
})

afterEach(() => {
  delete process.env.REACT_APP_WEBSITE_DOMAIN
  jest.clearAllMocks()
})

describe('goTo', () => {
  it('calls history.push as expected', () => {
    const { goTo } = require('js/navigation/navigation')
    goTo('/some/path/')
    expect(mockBrowserHistory.push).toHaveBeenCalledWith({
      pathname: '/some/path/',
      search: null,
    })
  })

  it('calls history.push with query parameters', () => {
    const { goTo } = require('js/navigation/navigation')
    goTo('/some/path/', { someParam: 'abc', foo: 'blah' })
    expect(mockBrowserHistory.push).toHaveBeenCalledWith({
      pathname: '/some/path/',
      search: '?someParam=abc&foo=blah',
    })
  })

  it('does not preserve existing query parameters by default', () => {
    getUrlParameters.mockReturnValue({
      doNotIncludeMe: 'plz',
    })
    const { goTo } = require('js/navigation/navigation')
    goTo('/some/path/', { someParam: 'abc', foo: 'blah' })
    expect(mockBrowserHistory.push).toHaveBeenCalledWith({
      pathname: '/some/path/',
      search: '?someParam=abc&foo=blah',
    })
  })

  it('preserves existing query parameters if options.keepURLParams is true', () => {
    getUrlParameters.mockReturnValue({
      plzIncludeMe: 'thx',
    })
    const { goTo } = require('js/navigation/navigation')
    goTo('/some/path/', null, { keepURLParams: true })
    expect(mockBrowserHistory.push).toHaveBeenCalledWith({
      pathname: '/some/path/',
      search: '?plzIncludeMe=thx',
    })
  })

  it('sets existing query parameters, along with new parameters, if options.keepURLParams is true', () => {
    getUrlParameters.mockReturnValue({
      plzIncludeMe: 'thx',
    })
    const { goTo } = require('js/navigation/navigation')
    goTo(
      '/some/path/',
      { someParam: 'abc', foo: 'blah' },
      { keepURLParams: true }
    )
    expect(mockBrowserHistory.push).toHaveBeenCalledWith({
      pathname: '/some/path/',
      search: '?plzIncludeMe=thx&someParam=abc&foo=blah',
    })
  })

  it('uses the new parameter value if one is provided that conflicts with an existing URL parameter and options.keepURLParams is true ', () => {
    getUrlParameters.mockReturnValue({
      dupe: 'versionToIgnore',
    })
    const { goTo } = require('js/navigation/navigation')
    goTo('/some/path/', { dupe: 'versionToUse' }, { keepURLParams: true })
    expect(mockBrowserHistory.push).toHaveBeenCalledWith({
      pathname: '/some/path/',
      search: '?dupe=versionToUse',
    })
  })

  it('calls externalRedirect when the new URL is on a different app', () => {
    const { goTo } = require('js/navigation/navigation')
    isURLForDifferentApp.mockReturnValueOnce(true)
    goTo('/some/path/')
    expect(externalRedirect).toHaveBeenCalledWith('/some/path/')
  })

  it('calls externalRedirect with the correct querystring when the new URL is on a different app', () => {
    const { goTo } = require('js/navigation/navigation')
    isURLForDifferentApp.mockReturnValueOnce(true)
    goTo('/some/path/', { someParam: 'abc', foo: 'blah' })
    expect(externalRedirect).toHaveBeenCalledWith(
      '/some/path/?someParam=abc&foo=blah'
    )
  })
})

describe('replaceUrl', () => {
  it('calls history.replace as expected', () => {
    const { replaceUrl } = require('js/navigation/navigation')
    replaceUrl('/some/path/')
    expect(mockBrowserHistory.replace).toHaveBeenCalledWith({
      pathname: '/some/path/',
      search: null,
    })
  })

  it('calls history.replace with query parameters', () => {
    const { replaceUrl } = require('js/navigation/navigation')
    replaceUrl('/some/path/', { someParam: 'abc', foo: 'blah' })
    expect(mockBrowserHistory.replace).toHaveBeenCalledWith({
      pathname: '/some/path/',
      search: '?someParam=abc&foo=blah',
    })
  })

  it('does not preserve existing query parameters by default', () => {
    getUrlParameters.mockReturnValue({
      doNotIncludeMe: 'plz',
    })
    const { replaceUrl } = require('js/navigation/navigation')
    replaceUrl('/some/path/', { someParam: 'abc', foo: 'blah' })
    expect(mockBrowserHistory.replace).toHaveBeenCalledWith({
      pathname: '/some/path/',
      search: '?someParam=abc&foo=blah',
    })
  })

  it('preserves existing query parameters if options.keepURLParams is true', () => {
    getUrlParameters.mockReturnValue({
      plzIncludeMe: 'thx',
    })
    const { replaceUrl } = require('js/navigation/navigation')
    replaceUrl('/some/path/', null, { keepURLParams: true })
    expect(mockBrowserHistory.replace).toHaveBeenCalledWith({
      pathname: '/some/path/',
      search: '?plzIncludeMe=thx',
    })
  })

  it('sets existing query parameters, along with new parameters, if options.keepURLParams is true', () => {
    getUrlParameters.mockReturnValue({
      plzIncludeMe: 'thx',
    })
    const { replaceUrl } = require('js/navigation/navigation')
    replaceUrl(
      '/some/path/',
      { someParam: 'abc', foo: 'blah' },
      { keepURLParams: true }
    )
    expect(mockBrowserHistory.replace).toHaveBeenCalledWith({
      pathname: '/some/path/',
      search: '?plzIncludeMe=thx&someParam=abc&foo=blah',
    })
  })

  it('uses the new parameter value if one is provided that conflicts with an existing URL parameter and options.keepURLParams is true ', () => {
    getUrlParameters.mockReturnValue({
      dupe: 'versionToIgnore',
    })
    const { replaceUrl } = require('js/navigation/navigation')
    replaceUrl('/some/path/', { dupe: 'versionToUse' }, { keepURLParams: true })
    expect(mockBrowserHistory.replace).toHaveBeenCalledWith({
      pathname: '/some/path/',
      search: '?dupe=versionToUse',
    })
  })

  it('calls externalRedirect when the new URL is on a different app', () => {
    const { replaceUrl } = require('js/navigation/navigation')
    isURLForDifferentApp.mockReturnValueOnce(true)
    replaceUrl('/some/path/')
    expect(externalRedirect).toHaveBeenCalledWith('/some/path/')
  })

  it('calls externalRedirect with the correct querystring when the new URL is on a different app', () => {
    const { replaceUrl } = require('js/navigation/navigation')
    isURLForDifferentApp.mockReturnValueOnce(true)
    replaceUrl('/some/path/', { greeting: 'hello', name: 'fred' })
    expect(externalRedirect).toHaveBeenCalledWith(
      '/some/path/?greeting=hello&name=fred'
    )
  })
})

describe('absoluteUrl', () => {
  it('works for a passed path', () => {
    // Set the domain env var
    process.env.REACT_APP_WEBSITE_DOMAIN = 'some.example.com'

    const absoluteUrl = require('js/navigation/navigation').absoluteUrl
    expect(absoluteUrl('/')).toBe('https://some.example.com/')
    expect(absoluteUrl('/blah/')).toBe('https://some.example.com/blah/')
  })

  it('does not modify a URL that is already absolute', () => {
    // Set the domain env var
    process.env.REACT_APP_WEBSITE_DOMAIN = 'some.example.com'

    const absoluteUrl = require('js/navigation/navigation').absoluteUrl
    expect(absoluteUrl('https://foo.com/blah/')).toBe('https://foo.com/blah/')
  })
})

describe('constructUrl', () => {
  it('returns the same URL when not provided any options', () => {
    const { constructUrl } = require('js/navigation/navigation')
    const returnedUrl = constructUrl('/some/path/')
    expect(returnedUrl).toEqual('/some/path/')
  })

  it('sets query parameters as expected', () => {
    const { constructUrl } = require('js/navigation/navigation')
    const returnedUrl = constructUrl('/some/path/', {
      someParam: 'abc',
      foo: 'blah',
    })
    expect(returnedUrl).toEqual('/some/path/?someParam=abc&foo=blah')
  })

  it('does not preserve existing query parameters by default', () => {
    getUrlParameters.mockReturnValue({
      doNotIncludeMe: 'plz',
    })
    const { constructUrl } = require('js/navigation/navigation')
    const returnedUrl = constructUrl('/some/path/', {
      someParam: 'abc',
      foo: 'blah',
    })
    expect(returnedUrl).toEqual('/some/path/?someParam=abc&foo=blah')
  })

  it('preserves existing query parameters if options.keepURLParams is true', () => {
    getUrlParameters.mockReturnValue({
      plzIncludeMe: 'thx',
    })
    const { constructUrl } = require('js/navigation/navigation')
    const returnedUrl = constructUrl('/some/path/', null, {
      keepURLParams: true,
    })
    expect(returnedUrl).toEqual('/some/path/?plzIncludeMe=thx')
  })

  it('sets existing query parameters, along with new parameters, if options.keepURLParams is true', () => {
    getUrlParameters.mockReturnValue({
      plzIncludeMe: 'thx',
    })
    const { constructUrl } = require('js/navigation/navigation')
    const returnedUrl = constructUrl(
      '/some/path/',
      { someParam: 'abc', foo: 'blah' },
      { keepURLParams: true }
    )
    expect(returnedUrl).toEqual(
      '/some/path/?plzIncludeMe=thx&someParam=abc&foo=blah'
    )
  })

  it('makes the URL absolute if options.absolute is true', () => {
    // Set the domain env var
    process.env.REACT_APP_WEBSITE_DOMAIN = 'some.example.com'

    const { constructUrl } = require('js/navigation/navigation')
    expect(constructUrl('/some/path/', null, { absolute: true })).toBe(
      'https://some.example.com/some/path/'
    )
  })

  it('makes the URL absolute, keeping URL params, if options.absolute and options.keepURLParams are true', () => {
    // Set the domain env var
    process.env.REACT_APP_WEBSITE_DOMAIN = 'some.example.com'
    getUrlParameters.mockReturnValue({
      hello: 'there',
    })

    const { constructUrl } = require('js/navigation/navigation')
    expect(
      constructUrl(
        '/some/path/',
        { foo: 'bar' },
        { absolute: true, keepURLParams: true }
      )
    ).toBe('https://some.example.com/some/path/?hello=there&foo=bar')
  })
})
