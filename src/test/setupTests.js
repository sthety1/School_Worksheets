import '@testing-library/jest-dom/vitest'
import { beforeEach } from 'vitest'

beforeEach(() => {
  try {
    globalThis.localStorage?.clear?.()
    globalThis.sessionStorage?.clear?.()
  } catch {
    // Some DOM shims can deny storage access; tests that need storage install their own mock.
  }
})
