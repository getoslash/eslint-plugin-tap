import eslintTapPluginConfig from '../../src'
import { TapRuleTester } from '../tap-eslint-adaptor'
import type { RuleTester, Rule } from 'eslint'

const rule = eslintTapPluginConfig.rules['use-t'] as Rule.RuleModule

const ruleTester = TapRuleTester('rules > assertion-message', {
  env: eslintTapPluginConfig.configs.recommended.env,
  parserOptions: {
    sourceType: 'module',
  },
})

const parameterNotNamedTErrors: Array<RuleTester.TestCaseError> = [
  {
    message: 'Test parameter should be named `t`.',
  },
]

const tooManyParametersErrors: Array<RuleTester.TestCaseError> = [
  {
    message: 'Test should only have one parameter named `t`.',
  },
]

const header = `const tap = require('tap');\n`

ruleTester.run('use-t', rule, {
  valid: [
    `${header}tap.test("test name", () => {});`,
    `${header}tap.test("test name", t => {});`,
    `${header}tap.test("test name", function (t) {});`,
    `${header}tap.test("test name", testFunction);`,
    `${header}tap.todo("test name");`,
    // shouldn't be triggered since it's not a test file
    'tap.test(boop => {});',
  ],
  invalid: [
    {
      code: `${header}tap.test("test name", boop => {});`,
      errors: parameterNotNamedTErrors,
    },
    {
      code: `${header}tap.test("test name", snoot => {});`,
      errors: parameterNotNamedTErrors,
    },
    {
      code: `${header}tap.test("test name", hey => { hey.end(); });`,
      errors: parameterNotNamedTErrors,
    },
    {
      code: `${header}tap.test("test name", function (lol) {});`,
      errors: parameterNotNamedTErrors,
    },
    {
      code: `${header}tap.test("test name", (t, boop) => {});`,
      errors: tooManyParametersErrors,
    },
    {
      code: `${header}tap.test("test name", (snoot, t) => {});`,
      errors: tooManyParametersErrors,
    },
    {
      code: `${header}tap.test("test name", (t, ding) => {});`,
      errors: tooManyParametersErrors,
    },
  ],
})
