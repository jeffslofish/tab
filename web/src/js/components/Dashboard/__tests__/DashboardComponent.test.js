/* eslint-env jest */

import React from 'react'
import MockDate from 'mockdate'
import moment from 'moment'
import { cloneDeep } from 'lodash/lang'
import {
  shallow
} from 'enzyme'
import MoneyRaised from 'js/components/MoneyRaised/MoneyRaisedContainer'
import UserBackgroundImage from 'js/components/User/UserBackgroundImageContainer'
import UserMenu from 'js/components/User/UserMenuContainer'
import WidgetsContainer from 'js/components/Widget/WidgetsContainer'
import CampaignBaseContainer from 'js/components/Campaign/CampaignBaseContainer'
import Ad from 'js/components/Ad/Ad'
import LogTab from 'js/components/Dashboard/LogTabContainer'
import LogRevenue from 'js/components/Dashboard/LogRevenueContainer'
import LogConsentData from 'js/components/Dashboard/LogConsentDataContainer'
import LogAccountCreation from 'js/components/Dashboard/LogAccountCreationContainer'
import ErrorMessage from 'js/components/General/ErrorMessage'
import NewUserTour from 'js/components/Dashboard/NewUserTourContainer'
import localStorageMgr from 'js/utils/localstorage-mgr'
import { STORAGE_NEW_USER_HAS_COMPLETED_TOUR } from 'js/constants'
import { getCurrentUser } from 'js/authentication/user'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import {
  goTo
} from 'js/navigation/navigation'

jest.mock('js/analytics/logEvent')
jest.mock('js/utils/localstorage-mgr')
jest.mock('js/authentication/user')
jest.mock('js/navigation/navigation')

const mockNow = '2018-05-15T10:30:00.000'

beforeAll(() => {
  MockDate.set(moment(mockNow))
})

afterEach(() => {
  localStorageMgr.clear()
})

afterAll(() => {
  MockDate.reset()
})

const mockProps = {
  user: {
    id: 'abc-123',
    joined: '2017-04-10T14:00:00.000'
  },
  app: {
    isGlobalCampaignLive: false
  }
}

describe('Dashboard component', () => {
  it('renders without error', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent').default
    shallow(
      <DashboardComponent {...mockProps} />
    )
  })

  it('renders MoneyRaised component', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent').default
    const wrapper = shallow(
      <DashboardComponent {...mockProps} />
    )
    expect(wrapper.find(MoneyRaised).length).toBe(1)
  })

  it('renders UserBackgroundImage component', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent').default
    const wrapper = shallow(
      <DashboardComponent {...mockProps} />
    )
    expect(wrapper.find(UserBackgroundImage).length).toBe(1)
  })

  it('renders UserMenu component', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent').default
    const wrapper = shallow(
      <DashboardComponent {...mockProps} />
    )
    expect(wrapper.find(UserMenu).length).toBe(1)
  })

  it('renders WidgetsContainer component', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent').default
    const wrapper = shallow(
      <DashboardComponent {...mockProps} />
    )
    expect(wrapper.find(WidgetsContainer).length).toBe(1)
  })

  it('renders CampaignBaseContainer component', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent').default
    const wrapper = shallow(
      <DashboardComponent {...mockProps} />
    )
    expect(wrapper.find(CampaignBaseContainer).length).toBe(1)
  })

  it('renders Ad components', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent').default
    const wrapper = shallow(
      <DashboardComponent {...mockProps} />
    )
    expect(wrapper.find(Ad).length).toBe(2)
  })

  it('the ads have expected IDs matched with their sizes', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent').default
    const wrapper = shallow(
      <DashboardComponent {...mockProps} />
    )
    const rectangleAd = wrapper.find(Ad).at(0)
    const leaderboardAd = wrapper.find(Ad).at(1)
    expect(rectangleAd.prop('adId')).toBe('div-gpt-ad-1464385742501-0')
    expect(rectangleAd.prop('style').minWidth).toBe(300)
    expect(leaderboardAd.prop('adId')).toBe('div-gpt-ad-1464385677836-0')
    expect(leaderboardAd.prop('style').minWidth).toBe(728)
  })

  it('renders LogTab component', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent').default
    const wrapper = shallow(
      <DashboardComponent {...mockProps} />
    )
    expect(wrapper.find(LogTab).length).toBe(1)
  })

  it('renders LogRevenue component', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent').default
    const wrapper = shallow(
      <DashboardComponent {...mockProps} />
    )
    expect(wrapper.find(LogRevenue).length).toBe(1)
  })

  it('renders LogConsentData component', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent').default
    const wrapper = shallow(
      <DashboardComponent {...mockProps} />
    )
    expect(wrapper.find(LogConsentData).length).toBe(1)
  })

  it('renders LogAccountCreation component', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent').default
    const wrapper = shallow(
      <DashboardComponent {...mockProps} />
    )
    expect(wrapper.find(LogAccountCreation).length).toBe(1)
  })

  it('renders the NewUserTour component when the user recently joined and has not already viewed it', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent').default

    // Mock that the user joined recently
    const modifiedProps = cloneDeep(mockProps)
    modifiedProps.user.joined = '2018-05-15T09:54:11.000'

    // Mock that the user has not viewed the tour
    localStorageMgr.removeItem(STORAGE_NEW_USER_HAS_COMPLETED_TOUR)

    const wrapper = shallow(
      <DashboardComponent {...modifiedProps} />
    )
    expect(wrapper.find(NewUserTour).length).toBe(1)
  })

  it('does not render the NewUserTour component when the user has already viewed it', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent').default

    // Mock that the user joined recently
    const modifiedProps = cloneDeep(mockProps)
    modifiedProps.user.joined = '2018-05-15T09:54:11.000'

    // Mock that the user has already viewed the tour
    localStorageMgr.setItem(STORAGE_NEW_USER_HAS_COMPLETED_TOUR, 'true')

    const wrapper = shallow(
      <DashboardComponent {...modifiedProps} />
    )
    expect(wrapper.find(NewUserTour).length).toBe(0)
  })

  it('does not renders the NewUserTour component when some time has passed since the user joined', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent').default

    // Mock that the user joined more than a few hours ago
    const modifiedProps = cloneDeep(mockProps)
    modifiedProps.user.joined = '2018-05-14T09:54:11.000'

    // Mock that the user has not viewed the tour
    localStorageMgr.removeItem(STORAGE_NEW_USER_HAS_COMPLETED_TOUR)

    const wrapper = shallow(
      <DashboardComponent {...modifiedProps} />
    )
    expect(wrapper.find(NewUserTour).length).toBe(0)
  })

  it('does not render MoneyRaised component until the "user" prop exists', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent').default
    const mockPropsWithoutUser = Object.assign({}, mockProps, { user: null })
    const wrapper = shallow(
      <DashboardComponent {...mockPropsWithoutUser} />
    )
    expect(wrapper.find(MoneyRaised).length).toBe(0)
  })

  it('does not render UserMenu component until the "user" prop exists', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent').default
    const mockPropsWithoutUser = Object.assign({}, mockProps, { user: null })
    const wrapper = shallow(
      <DashboardComponent {...mockPropsWithoutUser} />
    )
    expect(wrapper.find(UserMenu).length).toBe(0)
  })

  it('does not render CampaignBaseContainer component until the "user" prop exists', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent').default
    const mockPropsWithoutUser = Object.assign({}, mockProps, { user: null })
    const wrapper = shallow(
      <DashboardComponent {...mockPropsWithoutUser} />
    )
    expect(wrapper.find(CampaignBaseContainer).length).toBe(0)
  })

  it('does not render LogTab component until the "user" prop exists', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent').default
    const mockPropsWithoutUser = Object.assign({}, mockProps, { user: null })
    const wrapper = shallow(
      <DashboardComponent {...mockPropsWithoutUser} />
    )
    expect(wrapper.find(LogTab).length).toBe(0)
  })

  it('does not render LogRevenue component until the "user" prop exists', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent').default
    const mockPropsWithoutUser = Object.assign({}, mockProps, { user: null })
    const wrapper = shallow(
      <DashboardComponent {...mockPropsWithoutUser} />
    )
    expect(wrapper.find(LogRevenue).length).toBe(0)
  })

  it('does not render LogConsentData component until the "user" prop exists', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent').default
    const mockPropsWithoutUser = Object.assign({}, mockProps, { user: null })
    const wrapper = shallow(
      <DashboardComponent {...mockPropsWithoutUser} />
    )
    expect(wrapper.find(LogConsentData).length).toBe(0)
  })

  it('does not render LogAccountCreation component until the "user" prop exists', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent').default
    const mockPropsWithoutUser = Object.assign({}, mockProps, { user: null })
    const wrapper = shallow(
      <DashboardComponent {...mockPropsWithoutUser} />
    )
    expect(wrapper.find(LogAccountCreation).length).toBe(0)
  })

  it('does not render NewUserTour component until the "user" prop exists', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent').default
    const mockPropsWithoutUser = Object.assign({}, mockProps, { user: null })
    const wrapper = shallow(
      <DashboardComponent {...mockPropsWithoutUser} />
    )
    expect(wrapper.find(NewUserTour).length).toBe(0)
  })

  it('does not render the ErrorMessage component when no error message is set', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent').default
    const wrapper = shallow(
      <DashboardComponent {...mockProps} />
    )
    expect(wrapper.find(ErrorMessage).length).toBe(0)
  })

  it('renders the ErrorMessage component when WidgetsContainer calls its "showError" prop', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent').default
    const wrapper = shallow(
      <DashboardComponent {...mockProps} />
    )
    wrapper.find(WidgetsContainer).prop('showError')('Big widget problem!')
    wrapper.update()
    expect(wrapper.find(ErrorMessage).length).toBe(1)
    expect(wrapper.find(ErrorMessage).prop('message')).toBe('Big widget problem!')
  })

  it('passes false to childrens\' "isCampaignLive" props when the "isGlobalCampaignLive" prop is false', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent').default
    const wrapper = shallow(
      <DashboardComponent {...mockProps} />
    )
    expect(wrapper.find(WidgetsContainer).prop('isCampaignLive')).toBe(false)
    expect(wrapper.find(CampaignBaseContainer).prop('isCampaignLive')).toBe(false)
  })

  it('passes true to childrens\' "isCampaignLive" props when the "isGlobalCampaignLive" prop is true', () => {
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent').default
    const mockPropsWithoutCampaignLive = Object.assign({}, mockProps, { app: { isGlobalCampaignLive: true } })
    const wrapper = shallow(
      <DashboardComponent {...mockPropsWithoutCampaignLive} />
    )
    expect(wrapper.find(WidgetsContainer).prop('isCampaignLive')).toBe(true)
    expect(wrapper.find(CampaignBaseContainer).prop('isCampaignLive')).toBe(true)
  })

  it('displays the anonymous user sign-in prompt when the user is anonymous', async () => {
    expect.assertions(1)

    getCurrentUser.mockResolvedValueOnce({
      id: 'some-id-here',
      email: null,
      username: null,
      isAnonymous: true,
      emailVerified: false
    })

    const DashboardComponent = require('js/components/Dashboard/DashboardComponent').default
    const wrapper = shallow(
      <DashboardComponent {...mockProps} />
    )

    // Wait for the component to determine whether the
    // user is anonymous.
    await wrapper.instance().determineAnonymousStatus()
    wrapper.update()
    expect(
      wrapper.find('[data-test-id="anon-sign-in-prompt-dashboard"]').length
    ).toBe(1)
  })

  it('displays the correct text for the anonymous user sign-in prompt', async () => {
    expect.assertions(1)

    getCurrentUser.mockResolvedValueOnce({
      id: 'some-id-here',
      email: null,
      username: null,
      isAnonymous: true,
      emailVerified: false
    })

    const DashboardComponent = require('js/components/Dashboard/DashboardComponent').default
    const wrapper = shallow(
      <DashboardComponent {...mockProps} />
    )

    // Wait for the component to determine whether the
    // user is anonymous.
    await wrapper.instance().determineAnonymousStatus()
    wrapper.update()

    expect(
      wrapper
        .find('[data-test-id="anon-sign-in-prompt-dashboard"]')
        .find(Typography)
        .children()
        .text()
    ).toBe('Sign in to save your progress!')
  })

  it('the anonymous user sign-in button leads to the correct URL', async () => {
    expect.assertions(1)

    getCurrentUser.mockResolvedValueOnce({
      id: 'some-id-here',
      email: null,
      username: null,
      isAnonymous: true,
      emailVerified: false
    })

    const DashboardComponent = require('js/components/Dashboard/DashboardComponent').default
    const wrapper = shallow(
      <DashboardComponent {...mockProps} />
    )

    // Wait for the component to determine whether the
    // user is anonymous.
    await wrapper.instance().determineAnonymousStatus()
    wrapper.update()

    const button = wrapper
      .find('[data-test-id="anon-sign-in-prompt-dashboard"]')
      .find(Button)
    button.simulate('click')
    expect(goTo).toHaveBeenCalledWith('/newtab/auth/', { noredirect: 'true' })
  })

  it('does not display the anonymous user sign-in prompt when the user is not anonymous', async () => {
    expect.assertions(1)

    getCurrentUser.mockResolvedValueOnce({
      id: 'some-id-here',
      email: 'somebody@example.com',
      username: 'IAmSomebody',
      isAnonymous: false,
      emailVerified: true
    })

    const DashboardComponent = require('js/components/Dashboard/DashboardComponent').default
    const wrapper = shallow(
      <DashboardComponent {...mockProps} />
    )

    // Wait for the component to determine whether the
    // user is anonymous.
    await wrapper.instance().determineAnonymousStatus()
    wrapper.update()

    expect(
      wrapper.find('[data-test-id="anon-sign-in-prompt-dashboard"]').length
    ).toBe(0)
  })
})
