import { describe, it, expect } from 'vitest'

describe('Environment Sanity Check', () => {
  it('crypto.getRandomValues is available in the test runner', () => {
    expect(globalThis.crypto).toBeDefined()
    expect(typeof globalThis.crypto.getRandomValues).toBe('function')

    const array = new Uint32Array(1)
    globalThis.crypto.getRandomValues(array)
    expect(array[0]).toBeTypeOf('number')
  })
})
