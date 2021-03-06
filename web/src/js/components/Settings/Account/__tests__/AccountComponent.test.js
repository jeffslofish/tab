/* eslint-env jest */

import React from 'react'
import { Helmet } from 'react-helmet'
import { mount, shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { flushAllPromises } from 'js/utils/test-utils'
import initializeCMP from 'js/utils/initializeCMP'

jest.mock('tab-cmp')
jest.mock('js/utils/initializeCMP')

const getMockUserData = () => {
  return {
    id: 'user-abc-123',
    email: 'somebody@example.com',
    username: 'somebody123',
  }
}

afterEach(() => {
  jest.clearAllMocks()
})

describe('Account component', () => {
  it('renders without error', () => {
    const AccountComponent = require('js/components/Settings/Account/AccountComponent')
      .default
    const userData = getMockUserData()
    shallow(<AccountComponent user={userData} />)
  })

  it('sets the the page title', async () => {
    const AccountComponent = require('js/components/Settings/Account/AccountComponent')
      .default
    const wrapper = shallow(<AccountComponent user={getMockUserData()} />)
    expect(
      wrapper
        .find(Helmet)
        .find('title')
        .first()
        .text()
    ).toEqual('Account')
  })

  it('calls initializeCMP on mount', async () => {
    expect.assertions(1)
    const AccountComponent = require('js/components/Settings/Account/AccountComponent')
      .default
    const wrapper = shallow(<AccountComponent user={getMockUserData()} />)
    await wrapper.instance().componentDidMount()
    await flushAllPromises()
    expect(initializeCMP).toHaveBeenCalled()
  })

  it('shows the GDPR data privacy button when the client is in the EU', async () => {
    expect.assertions(1)

    // Mock that the client is in the EU
    const tabCMP = require('tab-cmp')
    tabCMP.doesGDPRApply.mockResolvedValue(true)
    tabCMP.doesCCPAApply.mockResolvedValue(false)

    const AccountComponent = require('js/components/Settings/Account/AccountComponent')
      .default
    const wrapper = shallow(<AccountComponent user={getMockUserData()} />)
    await wrapper.instance().componentDidMount()
    await flushAllPromises()
    wrapper.update()

    // Find the data privacy choices setting
    const AccountItem = require('js/components/Settings/Account/AccountComponent')
      .AccountItem
    const accountItems = wrapper.find(AccountItem)
    var containsDataPrivacyOption = false
    accountItems.forEach(item => {
      if (item.prop('name') === 'Data privacy choices') {
        containsDataPrivacyOption = true
      }
    })
    expect(containsDataPrivacyOption).toBe(true)
  })

  it('opens the GDPR dialog when clicking the GDPR data privacy button', async () => {
    expect.assertions(2)

    // Mock that the client is in the EU
    const tabCMP = require('tab-cmp')
    tabCMP.doesGDPRApply.mockResolvedValue(true)
    tabCMP.doesCCPAApply.mockResolvedValue(false)

    const AccountComponent = require('js/components/Settings/Account/AccountComponent')
      .default
    const wrapper = shallow(<AccountComponent user={getMockUserData()} />)
    await wrapper.instance().componentDidMount()
    await flushAllPromises()
    wrapper.update()

    // Find the data privacy choices setting
    const AccountItem = require('js/components/Settings/Account/AccountComponent')
      .AccountItem
    const dataPrivacyAccountItem = wrapper
      .find(AccountItem)
      .last()
      .dive()
    const button = dataPrivacyAccountItem.find(Button).first()

    expect(tabCMP.openTCFConsentDialog).not.toHaveBeenCalled()
    button.simulate('click')
    await flushAllPromises()
    expect(tabCMP.openTCFConsentDialog).toHaveBeenCalled()
  })

  it('does not show the GDPR data privacy button when the client is not in the EU', async () => {
    expect.assertions(1)

    // Mock that the client is not in the EU or US
    const tabCMP = require('tab-cmp')
    tabCMP.doesGDPRApply.mockResolvedValue(false)
    tabCMP.doesCCPAApply.mockResolvedValue(false)

    const AccountComponent = require('js/components/Settings/Account/AccountComponent')
      .default
    const wrapper = shallow(<AccountComponent user={getMockUserData()} />)
    await wrapper.instance().componentDidMount()
    await flushAllPromises()
    wrapper.update()

    // Try to find the data privacy choices setting
    const AccountItem = require('js/components/Settings/Account/AccountComponent')
      .AccountItem
    const accountItems = wrapper.find(AccountItem)
    var containsDataPrivacyOption = false
    accountItems.forEach(item => {
      if (item.prop('name') === 'Data privacy choices') {
        containsDataPrivacyOption = true
      }
    })
    expect(containsDataPrivacyOption).toBe(false)
  })

  it('shows the CCPA data privacy button when the client is in the US', async () => {
    expect.assertions(1)

    // Mock that the client is in the US
    const tabCMP = require('tab-cmp')
    tabCMP.doesCCPAApply.mockResolvedValue(true)
    tabCMP.doesGDPRApply.mockResolvedValue(false)

    const AccountComponent = require('js/components/Settings/Account/AccountComponent')
      .default
    const wrapper = shallow(<AccountComponent user={getMockUserData()} />)
    await wrapper.instance().componentDidMount()
    await flushAllPromises()
    wrapper.update()

    // Find the data privacy choices setting
    const AccountItem = require('js/components/Settings/Account/AccountComponent')
      .AccountItem
    const accountItems = wrapper.find(AccountItem)
    var containsDataPrivacyOption = false
    accountItems.forEach(item => {
      if (item.prop('name') === 'Ad personalization choices') {
        containsDataPrivacyOption = true
      }
    })
    expect(containsDataPrivacyOption).toBe(true)
  })

  it('opens the CCPA dialog when clicking the CCPA data privacy link', async () => {
    expect.assertions(2)

    // Mock that the client is in the US
    const tabCMP = require('tab-cmp')
    tabCMP.doesGDPRApply.mockResolvedValue(false)
    tabCMP.doesCCPAApply.mockResolvedValue(true)

    const AccountComponent = require('js/components/Settings/Account/AccountComponent')
      .default
    const wrapper = shallow(<AccountComponent user={getMockUserData()} />)
    await wrapper.instance().componentDidMount()
    await flushAllPromises()
    wrapper.update()

    // Find the data privacy choices setting
    const AccountItem = require('js/components/Settings/Account/AccountComponent')
      .AccountItem
    const dataPrivacyAccountItem = wrapper
      .find(AccountItem)
      .last()
      .dive()
    const link = dataPrivacyAccountItem.find('a').first()

    expect(tabCMP.openTCFConsentDialog).not.toHaveBeenCalled()
    link.simulate('click')
    await flushAllPromises()
    expect(tabCMP.openCCPAConsentDialog).toHaveBeenCalled()
  })

  it('does not show the CCPA data privacy button when the client is not in the US', async () => {
    expect.assertions(1)

    // Mock that the client is not in the US or EU
    const tabCMP = require('tab-cmp')
    tabCMP.doesCCPAApply.mockResolvedValue(false)
    tabCMP.doesGDPRApply.mockResolvedValue(false)

    const AccountComponent = require('js/components/Settings/Account/AccountComponent')
      .default
    const wrapper = shallow(<AccountComponent user={getMockUserData()} />)
    await wrapper.instance().componentDidMount()
    await flushAllPromises()
    wrapper.update()

    // Try to find the data privacy choices setting
    const AccountItem = require('js/components/Settings/Account/AccountComponent')
      .AccountItem
    const accountItems = wrapper.find(AccountItem)
    var containsDataPrivacyOption = false
    accountItems.forEach(item => {
      if (item.prop('name') === 'Ad personalization choices') {
        containsDataPrivacyOption = true
      }
    })
    expect(containsDataPrivacyOption).toBe(false)
  })

  it('displays the username', () => {
    const AccountComponent = require('js/components/Settings/Account/AccountComponent')
      .default
    const userData = getMockUserData()
    const wrapper = mount(<AccountComponent user={userData} />)
    const typographies = wrapper.find(Typography)
    expect(typographies.at(1).text()).toBe('Username')
    expect(typographies.at(2).text()).toBe('somebody123')
  })

  it('displays the email address', () => {
    const AccountComponent = require('js/components/Settings/Account/AccountComponent')
      .default
    const userData = getMockUserData()
    const wrapper = mount(<AccountComponent user={userData} />)
    const typographies = wrapper.find(Typography)
    expect(typographies.at(3).text()).toBe('Email')
    expect(typographies.at(4).text()).toBe('somebody@example.com')
  })

  it('displays a placeholder when there is no username', () => {
    const AccountComponent = require('js/components/Settings/Account/AccountComponent')
      .default
    const userData = getMockUserData()
    delete userData.username
    const wrapper = mount(<AccountComponent user={userData} />)
    const typographies = wrapper.find(Typography)
    expect(typographies.at(1).text()).toBe('Username')
    expect(typographies.at(2).text()).toBe('Not signed in')
  })

  it('displays a placeholder when there is no email address', () => {
    const AccountComponent = require('js/components/Settings/Account/AccountComponent')
      .default
    const userData = getMockUserData()
    delete userData.email
    const wrapper = mount(<AccountComponent user={userData} />)
    const typographies = wrapper.find(Typography)
    expect(typographies.at(3).text()).toBe('Email')
    expect(typographies.at(4).text()).toBe('Not signed in')
  })
})
