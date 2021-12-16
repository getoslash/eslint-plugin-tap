import tap from 'tap'
import eslintTapPluginConfig from '../../src'
import { TapRuleTester } from '../tap-eslint-adaptor'
import type { RuleTester, Rule } from 'eslint'

const rule = eslintTapPluginConfig.rules['no-skip-test'] as Rule.RuleModule

const ruleTester = TapRuleTester('rules > no-skip-test', {
  env: eslintTapPluginConfig.configs.recommended.env,
})

const errors: Array<RuleTester.TestCaseError> = [
  { message: 'No tests should be skipped.' },
]
const header = `const tap = require('tap');\n`

void tap.test('rules > no-skip-test', (t) => {
  t.plan(0)
  ruleTester.run('no-skip-test', rule, {
    valid: [
      `${header}tap.test("my test name", t => { t.pass(); });`,
      `${header}tap.test("my test name", t => { t.pass(); }); test("my other test name", t => { t.pass(); });`,
      `${header}notTest.skip();`,
      // shouldn't be triggered since it's not a test file
      'tap.skip(t => {});',
    ],
    invalid: [
      {
        code: `${header}tap.skip("skip this test", t => { t.pass(); });`,
        errors,
      },
    ],
  })
  t.end()
})
