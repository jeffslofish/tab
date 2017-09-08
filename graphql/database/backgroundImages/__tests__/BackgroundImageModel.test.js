/* eslint-env jest */

import tableNames from '../../tables'
import BackgroundImageModel from '../BackgroundImageModel'

jest.mock('../../databaseClient')

describe('BackgroundImageModel', () => {
  it('implements the name property', () => {
    expect(BackgroundImageModel.name).toBe('BackgroundImage')
  })

  it('implements the hashKey property', () => {
    expect(BackgroundImageModel.hashKey).toBe('id')
  })

  it('implements the tableName property', () => {
    expect(BackgroundImageModel.tableName).toBe(tableNames.backgroundImages)
  })

  it('has the correct get permission', () => {
    expect(BackgroundImageModel.permissions.get()).toBe(true)
  })

  it('has the correct getAll permission', () => {
    expect(BackgroundImageModel.permissions.getAll()).toBe(true)
  })

  it('has the correct update permission', () => {
    expect(BackgroundImageModel.permissions.update).toBeUndefined()
  })

  it('has the correct create permission', () => {
    expect(BackgroundImageModel.permissions.create).toBeUndefined()
  })
})