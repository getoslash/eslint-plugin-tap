import eslintTapPluginConfig from '../../src'
import { TapRuleTester } from '../tap-eslint-adaptor'
import type { RuleTester, Rule } from 'eslint'

const rule = eslintTapPluginConfig.rules['test-ended'] as Rule.RuleModule

const ruleTester = TapRuleTester('rules > test-ended', {
  env: eslintTapPluginConfig.configs.recommended.env,
})

const errors: Array<RuleTester.TestCaseError> = [
  {
    message:
      'Test was not ended. Make sure to explicitly end the test with `t.end()`.',
  },
]
const header = `const tap = require('tap');\n`

ruleTester.run('test-ended', rule, {
  valid: [
    `${header}tap.test("my test name", function (t) { t.pass(); t.end(); });`,
    `${header}tap.test("my test name", function boop(t) { t.pass(); t.end(); });`,
    `${header}tap.test("my test name", t => { t.pass(); t.end(); });`,
    `${header}tap.test("my test name", t => { t.end(); });`,
    `${header}tap.test("my test name", t => { t.end(); t.pass(); });`,
    `${header}tap.test("my test name", t => { fn(t.end); });`,
    `${header}tap.only("my test name", t => { t.end(); });`,
    `${header}tap.skip("my test name", t => { t.end(); });`,
    `${header}tap.only.skip("my test name", t => { t.end(); });`,
    // shouldn't be triggered since it's not a test file
    'tap.test(t => {});',
  ],
  invalid: [
    {
      code: `${header}tap.test("my test name", function (t) { t.pass(); });`,
      errors,
    },
    {
      code: `${header}tap.test("my test name", t => { t.pass(); });`,
      errors,
    },
    {
      code: `${header}tap.test("my test name", t => {});`,
      errors,
    },
    {
      code: `${header}tap.skip.only("my test name", t => {});`,
      errors,
    },
    {
      code: `${header}tap.only.skip("my test name", t => {});`,
      errors,
    },
  ],
})
