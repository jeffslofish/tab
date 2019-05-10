/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import {
  __getAuthListenerCallbacks,
  __unregisterAuthStateChangeListeners,
  __triggerAuthStateChange,
} from 'js/authentication/user'
import { flushAllPromises } from 'js/utils/test-utils'
import { createAnonymousUserIfPossible } from 'js/authentication/helpers'
import logger from 'js/utils/logger'

jest.mock('js/authentication/user')
jest.mock('js/authentication/helpers')
jest.mock('js/utils/logger')

afterEach(() => {
  jest.clearAllMocks()
  createAnonymousUserIfPossible.mockResolvedValue(null)
  __unregisterAuthStateChangeListeners()
})

describe('withUser', () => {
  it('renders without error', () => {
    const withUser = require('js/components/General/withUser').default
    const MockComponent = () => null
    const WrappedComponent = withUser()(MockComponent)
    shallow(<WrappedComponent />)
  })

  it('unregisters its auth listener on unmount', () => {
    const withUser = require('js/components/General/withUser').default
    const MockComponent = () => null
    const WrappedComponent = withUser()(MockComponent)
    const wrapper = shallow(<WrappedComponent />)
    expect(__getAuthListenerCallbacks().length).toBe(1)
    wrapper.unmount()
    expect(__getAuthListenerCallbacks().length).toBe(0)
  })

  it('renders children if the user has an ID', async () => {
    expect.assertions(1)

    const withUser = require('js/components/General/withUser').default
    const MockComponent = () => null
    const WrappedComponent = withUser()(MockComponent)
    const wrapper = shallow(<WrappedComponent />)
    __triggerAuthStateChange({
      id: 'abc123',
      email: 'foo@bar.com',
      username: 'SomeUsername',
      isAnonymous: false,
      emailVerified: true,
    })
    await flushAllPromises()
    expect(wrapper.find(MockComponent).exists()).toBe(true)
  })

  it('does not render children if the user does not have an ID, by default', async () => {
    expect.assertions(1)

    const withUser = require('js/components/General/withUser').default
    const MockComponent = () => null
    const WrappedComponent = withUser()(MockComponent)
    const wrapper = shallow(<WrappedComponent />)
    __triggerAuthStateChange({
      id: null,
      email: null,
      username: 'SomeUsername',
      isAnonymous: false,
      emailVerified: false,
    })
    await flushAllPromises()
    expect(wrapper.find(MockComponent).exists()).toBe(false)
  })

  it('does not render children if the user is null, by default', async () => {
    expect.assertions(1)

    const withUser = require('js/components/General/withUser').default
    const MockComponent = () => null
    const WrappedComponent = withUser()(MockComponent)
    const wrapper = shallow(<WrappedComponent />)
    __triggerAuthStateChange(null)
    await flushAllPromises()
    expect(wrapper.find(MockComponent).exists()).toBe(false)
  })

  it('renders children if the user does not have an ID when the "renderIfNoUser" option is true', async () => {
    expect.assertions(1)

    const withUser = require('js/components/General/withUser').default
    const MockComponent = () => null

    // Allow an unauthed user.
    const WrappedComponent = withUser({
      renderIfNoUser: true,
    })(MockComponent)

    const wrapper = shallow(<WrappedComponent />)
    __triggerAuthStateChange({
      id: null,
      email: null,
      username: 'SomeUsername',
      isAnonymous: false,
      emailVerified: false,
    })
    await flushAllPromises()
    expect(wrapper.find(MockComponent).exists()).toBe(true)
  })

  it('renders children if the user is null when the "renderIfNoUser" option is true', async () => {
    expect.assertions(1)

    const withUser = require('js/components/General/withUser').default
    const MockComponent = () => null

    // Allow an unauthed user.
    const WrappedComponent = withUser({
      renderIfNoUser: true,
    })(MockComponent)

    const wrapper = shallow(<WrappedComponent />)
    __triggerAuthStateChange(null)
    await flushAllPromises()
    expect(wrapper.find(MockComponent).exists()).toBe(true)
  })

  it('passes the user as a prop to the wrapped component', async () => {
    expect.assertions(1)

    const withUser = require('js/components/General/withUser').default
    const MockComponent = () => null
    const WrappedComponent = withUser()(MockComponent)
    const wrapper = shallow(<WrappedComponent />)
    const mockAuthUser = {
      id: 'abc123',
      email: 'foo@bar.com',
      username: 'SomeUsername',
      isAnonymous: false,
      emailVerified: true,
    }
    __triggerAuthStateChange(mockAuthUser)

    await flushAllPromises()
    wrapper.update()
    expect(wrapper.find(MockComponent).prop('authUser')).toEqual(mockAuthUser)
  })

  it('renders children only after determining the auth state, when a user exists', async () => {
    expect.assertions(2)

    const withUser = require('js/components/General/withUser').default
    const MockComponent = () => null

    // Allow an unauthed user.
    const WrappedComponent = withUser({
      renderIfNoUser: true,
    })(MockComponent)

    const wrapper = shallow(<WrappedComponent />)

    // Should not yet have rendered children.
    await flushAllPromises()
    expect(wrapper.find(MockComponent).exists()).toBe(false)

    __triggerAuthStateChange({
      id: 'abc123',
      email: 'foo@bar.com',
      username: 'SomeUsername',
      isAnonymous: false,
      emailVerified: true,
    })

    await flushAllPromises()
    expect(wrapper.find(MockComponent).exists()).toBe(true)
  })

  it('renders children only after determining the auth state, when we create a new anonymous user', async () => {
    expect.assertions(3)

    jest.useFakeTimers()

    // Mock a delay in creating a new user.
    createAnonymousUserIfPossible.mockImplementation(
      () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve({
              id: 'abc123',
              email: 'foo@bar.com',
              username: 'SomeUsername',
              isAnonymous: false,
              emailVerified: true,
            })
          }, 3e4)
        })
    )

    const withUser = require('js/components/General/withUser').default
    const MockComponent = () => null
    const WrappedComponent = withUser({
      renderIfNoUser: true,
    })(MockComponent)

    const wrapper = shallow(<WrappedComponent />)

    // User is not authed.
    __triggerAuthStateChange(null)

    // Should not yet have rendered children.
    await flushAllPromises()
    expect(wrapper.find(MockComponent).exists()).toBe(false)

    // Not enough time for the response from `createAnonymousUserIfPossible`.
    jest.advanceTimersByTime(2e4)

    // Still should not have rendered children.
    await flushAllPromises()
    expect(wrapper.find(MockComponent).exists()).toBe(false)

    // Mock that the created user returns.
    jest.advanceTimersByTime(2e4)

    await flushAllPromises()
    expect(wrapper.find(MockComponent).exists()).toBe(true)
  })

  it('renders children only after user creation is complete, even if the auth state changes, when we create a new anonymous user', async () => {
    expect.assertions(3)

    jest.useFakeTimers()

    // Mock a delay in creating a new user.
    createAnonymousUserIfPossible.mockImplementation(
      () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve({
              id: 'abc123',
              email: null,
              username: null,
              isAnonymous: true,
              emailVerified: false,
            })
          }, 3e4)
        })
    )

    const withUser = require('js/components/General/withUser').default
    const MockComponent = () => null
    const WrappedComponent = withUser({
      renderIfNoUser: true,
    })(MockComponent)

    const wrapper = shallow(<WrappedComponent />)

    // User is not authed.
    __triggerAuthStateChange(null)

    // Should not yet have rendered children.
    await flushAllPromises()
    expect(wrapper.find(MockComponent).exists()).toBe(false)

    // Even though the user is authed, we should still not render the
    // children because user creation has not completed.
    __triggerAuthStateChange({
      id: 'abc123',
      email: null,
      username: null,
      isAnonymous: true,
      emailVerified: false,
    })
    await flushAllPromises()
    expect(wrapper.find(MockComponent).exists()).toBe(false)

    jest.advanceTimersByTime(4e4)
    await flushAllPromises()
    expect(wrapper.find(MockComponent).exists()).toBe(true)
  })

  it('passes a null user to the child component when we could not create a new anonymous user and "renderIfNoUser" is true', async () => {
    expect.assertions(1)

    // We will not successfully create a new anonymous user.
    createAnonymousUserIfPossible.mockResolvedValue(null)

    const withUser = require('js/components/General/withUser').default
    const MockComponent = () => null
    const WrappedComponent = withUser({ renderIfNoUser: true })(MockComponent)
    const wrapper = shallow(<WrappedComponent />)

    // User is not authed.
    __triggerAuthStateChange(null)

    await flushAllPromises()
    wrapper.update()
    expect(wrapper.find(MockComponent).prop('authUser')).toBeNull()
  })

  it('does not render the child component when we could not create a new anonymous user and "renderIfNoUser" is false', async () => {
    expect.assertions(1)

    // We will not successfully create a new anonymous user.
    createAnonymousUserIfPossible.mockResolvedValue(null)

    const withUser = require('js/components/General/withUser').default
    const MockComponent = () => null
    const WrappedComponent = withUser()(MockComponent)
    const wrapper = shallow(<WrappedComponent />)

    // User is not authed.
    __triggerAuthStateChange(null)

    await flushAllPromises()
    wrapper.update()
    expect(wrapper.find(MockComponent).exists()).toBe(false)
  })

  it('passes a null user to the child component when createAnonymousUserIfPossible throws and "renderIfNoUser" is true', async () => {
    expect.assertions(1)

    // Attempting to create a new anonymous user will error.
    createAnonymousUserIfPossible.mockRejectedValue(
      new Error('To new user creation – we say, "Not today."')
    )

    const withUser = require('js/components/General/withUser').default
    const MockComponent = () => null
    const WrappedComponent = withUser({ renderIfNoUser: true })(MockComponent)
    const wrapper = shallow(<WrappedComponent />)

    // User is not authed.
    __triggerAuthStateChange(null)

    await flushAllPromises()
    wrapper.update()
    expect(wrapper.find(MockComponent).prop('authUser')).toBeNull()
  })

  it('does not render the child component when createAnonymousUserIfPossible throws and "renderIfNoUser" is false', async () => {
    expect.assertions(1)

    // Attempting to create a new anonymous user will error.
    createAnonymousUserIfPossible.mockRejectedValue(
      new Error('To new user creation – we say, "Not today."')
    )

    const withUser = require('js/components/General/withUser').default
    const MockComponent = () => null
    const WrappedComponent = withUser()(MockComponent)
    const wrapper = shallow(<WrappedComponent />)

    // User is not authed.
    __triggerAuthStateChange(null)

    await flushAllPromises()
    wrapper.update()
    expect(wrapper.find(MockComponent).exists()).toBe(false)
  })

  it('logs an error when createAnonymousUserIfPossible throws', async () => {
    expect.assertions(1)

    // Attempting to create a new anonymous user will error.
    const mockErr = new Error('To new user creation – we say, "Not today."')
    createAnonymousUserIfPossible.mockRejectedValue(mockErr)

    const withUser = require('js/components/General/withUser').default
    const MockComponent = () => null
    const WrappedComponent = withUser({ renderIfNoUser: true })(MockComponent)
    const wrapper = shallow(<WrappedComponent />)

    // User is not authed.
    __triggerAuthStateChange(null)

    await flushAllPromises()
    wrapper.update()
    expect(logger.error).toHaveBeenCalledWith(mockErr)
  })

  it('passes the anonymous user to the child component when a new user is created', async () => {
    expect.assertions(1)

    // We will create a new anonymous user.
    const mockCreatedUser = {
      id: 'abc123',
      email: null,
      username: null,
      isAnonymous: true,
      emailVerified: false,
    }
    createAnonymousUserIfPossible.mockResolvedValue(mockCreatedUser)

    const withUser = require('js/components/General/withUser').default
    const MockComponent = () => null
    const WrappedComponent = withUser()(MockComponent)
    const wrapper = shallow(<WrappedComponent />)

    // User is not authed.
    __triggerAuthStateChange(null)

    await flushAllPromises()
    wrapper.update()
    expect(wrapper.find(MockComponent).prop('authUser')).toEqual(
      mockCreatedUser
    )
  })

  it('does not create an anonymous user when the createUserIfPossible option is false', async () => {
    expect.assertions(2)

    const mockCreatedUser = {
      id: 'abc123',
      email: null,
      username: null,
      isAnonymous: true,
      emailVerified: false,
    }
    createAnonymousUserIfPossible.mockResolvedValue(mockCreatedUser)

    const withUser = require('js/components/General/withUser').default
    const MockComponent = () => null
    const WrappedComponent = withUser({
      createUserIfPossible: false,
      renderIfNoUser: true,
    })(MockComponent)
    const wrapper = shallow(<WrappedComponent />)

    // User is not authed.
    __triggerAuthStateChange(null)

    await flushAllPromises()
    wrapper.update()
    expect(createAnonymousUserIfPossible).not.toHaveBeenCalled()
    expect(wrapper.find(MockComponent).prop('authUser')).toBeNull()
  })
})