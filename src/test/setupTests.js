import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach } from 'vitest'

const defaultLocalStorage = globalThis.localStorage
const defaultSessionStorage = globalThis.sessionStorage

beforeEach(() => {
  defaultLocalStorage?.clear()
  defaultSessionStorage?.clear()
})

afterEach(() => {
  Object.defineProperty(globalThis, 'localStorage', {
    value: defaultLocalStorage,
    configurable: true,
  })
  Object.defineProperty(globalThis, 'sessionStorage', {
    value: defaultSessionStorage,
    configurable: true,
  })
  defaultLocalStorage?.clear()
  defaultSessionStorage?.clear()
})
