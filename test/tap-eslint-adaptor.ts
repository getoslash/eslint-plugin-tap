import { RuleTester } from 'eslint'
import tap from 'tap'
import type { Linter } from 'eslint'

interface RuleTesterThrownError extends Error {
  actual: string
  expected: string
}

const versionBuilder = (): ((name: string) => string) => {
  const state: Map<string, number> = new Map()
  return (name: string) => {
    const version = state.get(name) || 0
    state.set(name, version + 1)
    return version ? `${name} v${version + 1}` : name
  }
}

export const TapRuleTester = (testName: string, options: Linter.BaseConfig) => {
  let validity: 'valid' | 'invalid'
  const getName = versionBuilder()

  /* eslint-disable @typescript-eslint/ban-ts-comment */
  // @ts-ignore -- The RuleTester class has incomplete types. See https://eslint.org/docs/developer-guide/nodejs-api#customizing-ruletester
  RuleTester.describe = (text: 'valid' | 'invalid', method: () => void) => {
    validity = text
    return method.call(this)
  }

  /* eslint-disable @typescript-eslint/ban-ts-comment */
  // @ts-ignore -- The RuleTester class has incomplete types. See https://eslint.org/docs/developer-guide/nodejs-api#customizing-ruletester
  RuleTester.it = (text: string, method: () => void) => {
    const name = `${testName} → ${getName(`${validity} → ${text}`)}`
    void tap.test(name, (t: Tap.Test) => {
      try {
        method()
      } catch (error) {
        if ((error as Error).message.includes('Output is incorrect')) {
          const { actual, expected } = error as RuleTesterThrownError

          ;(
            error as RuleTesterThrownError
          ).message += `\n\nActual:\n${actual}\n\nExpected:\n${expected}`
        }
        throw error
      }
      t.end()
    })
  }

  return new RuleTester(options)
}
