/* eslint-env jest */
import { fragmentArray, fragmentString } from './fragment'

describe('fragmentString', () => {
  it('should fragment a string with no rest', () => {
    const [match, rest] = fragmentString(
      'This is a string',
      {prefix: 'This', exact: ' is a', suffix: ' string'}
    )

    expect(match).toEqual({prefix: 'This', exact: ' is a', suffix: ' string'})
    expect(rest).toEqual({prefix: '', exact: '', suffix: ''})
  })

  it('should cut the string in the prefix', () => {
    const [match, rest] = fragmentString(
      'Th',
      {prefix: 'This', exact: ' is a', suffix: ' string'}
    )

    expect(match).toEqual({prefix: 'Th', exact: '', suffix: ''})
    expect(rest).toEqual({prefix: 'is', exact: ' is a', suffix: ' string'})
  })

  it('should cut the string in the exact', () => {
    const [match, rest] = fragmentString(
      'This is',
      {prefix: 'This', exact: ' is a', suffix: ' string'}
    )

    expect(match).toEqual({prefix: 'This', exact: ' is', suffix: ''})
    expect(rest).toEqual({prefix: '', exact: ' a', suffix: ' string'})
  })

  it('should cut the string in the suffix', () => {
    const [match, rest] = fragmentString(
      'This is a str',
      {prefix: 'This', exact: ' is a', suffix: ' string'}
    )

    expect(match).toEqual({prefix: 'This', exact: ' is a', suffix: ' str'})
    expect(rest).toEqual({prefix: '', exact: '', suffix: 'ing'})
  })

  it('should throw an error for non-valid arguments', () => {
    const fragment = {prefix: 'This', exact: ' is a', suffix: ' string'}
    expect(() => fragmentString('This is a long string', fragment))
      .toThrow()
  })
})

describe('fragmentArray', () => {
  it('should throw an error for a non-valid string', () => {
    const fragment = {prefix: 'This', exact: ' is a', suffix: ' string'}
    expect(() => fragmentArray([''], fragment)).toThrow()
  })

  it('should fragment an array properly', () => {
    const fragment = {prefix: 'This', exact: ' is a', suffix: ' string'}
    const array = ['Th', 'is is ', 'a string']

    expect(fragmentArray(array, fragment)).toEqual([
      {prefix: 'Th', exact: '', suffix: ''},
      {prefix: 'is', exact: ' is ', suffix: ''},
      {prefix: '', exact: 'a', suffix: ' string'}
    ])
  })
})
