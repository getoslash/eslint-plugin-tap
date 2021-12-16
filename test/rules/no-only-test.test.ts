import eslintTapPluginConfig from '../../src'
import { TapRuleTester } from '../tap-eslint-adaptor'
import type { RuleTester, Rule } from 'eslint'

const rule = eslintTapPluginConfig.rules['no-only-test'] as Rule.RuleModule

const ruleTester = TapRuleTester('rules > no-only-test', {
  env: eslintTapPluginConfig.configs.recommended.env,
})

const errors: Array<RuleTester.TestCaseError> = [
  { message: '`tap.only()` should not be used.' },
]
const header = `const tap = require('tap');\n`

ruleTester.run('no-only-test', rule, {
  valid: [
    `${header}tap.test("my test name", t => { t.pass(); });`,
    `${header}tap.test("my test name", t => { t.pass(); }); tap.test("my another test name", t => { t.pass(); });`,
    `${header}notTest.only();`,
    // shouldn't be triggered since it's not a test file
    'tap.only(t => {});',
  ],
  invalid: [
    {
      code: `${header}tap.only("run only this test", t => { t.pass(); });`,
      errors,
    },
  ],
})
