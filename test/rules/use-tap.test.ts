import eslintTapPluginConfig from '../../src'
import { TapRuleTester } from '../tap-eslint-adaptor'
import type { RuleTester, Rule } from 'eslint'

const rule = eslintTapPluginConfig.rules['use-tap'] as Rule.RuleModule

const ruleTester = TapRuleTester('rules > use-tap', {
  env: eslintTapPluginConfig.configs.recommended.env,
  parserOptions: {
    sourceType: 'module',
  },
})

const errors: Array<RuleTester.TestCaseError> = [
  { message: 'tap should be imported as `tap`.' },
]

ruleTester.run('use-tap', rule, {
  valid: [
    `var tap = require('tap');`,
    `let tap = require('tap');`,
    `const tap = require('tap');`,
    `const a = 1, tap = require('tap'), b = 2;`,
    `const test = require('boop');`,
    `import tap from 'tap';`,
    `import tap, {} from 'tap';`,
    `import tap from 'boop';`,
  ],
  invalid: [
    {
      code: `var t = require('tap');`,
      errors,
    },
    {
      code: `const test = require('tap');`,
      errors,
    },
    {
      code: `const test = require('tap');`,
      errors,
    },
    {
      code: `const a = 1, test = require('tap'), b = 2;`,
      errors,
    },
    {
      code: `import test from 'tap';`,
      errors,
    },
  ],
})
