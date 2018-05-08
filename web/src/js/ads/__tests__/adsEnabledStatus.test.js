/* eslint-env jest */

import { getTabsOpenedToday } from 'utils/local-user-data-mgr'

jest.mock('utils/local-user-data-mgr')

var adsEnabledEnv = process.env.ADS_ENABLED

afterEach(() => {
  process.env.ADS_ENABLED = adsEnabledEnv // Reset env var after tests
})

describe('ads enabled status', function () {
  it('disables ads when ADS_ENABLED env var is not set', () => {
    process.env.ADS_ENABLED = undefined
    const adsEnabledStatus = require('../adsEnabledStatus').default
    expect(adsEnabledStatus()).toBe(false)
  })

  it('disables ads when ADS_ENABLED env var is not "true"', () => {
    process.env.ADS_ENABLED = 'false'
    const adsEnabledStatus = require('../adsEnabledStatus').default
    expect(adsEnabledStatus()).toBe(false)
  })

  it('enables ads when ADS_ENABLED env var is "true" and the user has not opened any tabs today', () => {
    process.env.ADS_ENABLED = 'true'
    getTabsOpenedToday.mockReturnValue(0)
    const adsEnabledStatus = require('../adsEnabledStatus').default
    expect(adsEnabledStatus()).toBe(true)
  })

  it('enables ads when ADS_ENABLED env var is "true" and the user has opened below the max number of tabs today', () => {
    process.env.ADS_ENABLED = 'true'
    getTabsOpenedToday.mockReturnValue(135)
    const adsEnabledStatus = require('../adsEnabledStatus').default
    expect(adsEnabledStatus()).toBe(true)
  })

  it('disables ads when the user has opened more than the max number of tabs today', () => {
    process.env.ADS_ENABLED = 'true'
    getTabsOpenedToday.mockReturnValue(150)
    const adsEnabledStatus = require('../adsEnabledStatus').default
    expect(adsEnabledStatus()).toBe(false)
  })
})