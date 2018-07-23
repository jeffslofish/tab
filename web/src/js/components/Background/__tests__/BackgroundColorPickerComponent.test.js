/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
import { SketchPicker } from 'react-color'

jest.mock('react-color')

const mockOnBackgroundColorSelection = jest.fn()
const mockProps = {
  user: {
    backgroundColor: '#FF0000'
  },
  onBackgroundColorSelection: mockOnBackgroundColorSelection
}

afterEach(() => {
  jest.clearAllMocks()
})

describe('Background color picker component', () => {
  it('renders without error', () => {
    const BackgroundColorPicker = require('../BackgroundColorPickerComponent').default
    shallow(
      <BackgroundColorPicker {...mockProps} />
    )
  })

  it('calls onBackgroundColorSelection prop when the color changes', () => {
    const BackgroundColorPicker = require('../BackgroundColorPickerComponent').default
    const wrapper = shallow(
      <BackgroundColorPicker {...mockProps} />
    )

    // Mock that our color picker fires its change callback
    const colorData = {
      hex: '#CDCDCD'
    }
    wrapper.find(SketchPicker).prop('onChangeComplete')(colorData)
    expect(mockOnBackgroundColorSelection).toHaveBeenCalledWith('#CDCDCD')
  })
})
