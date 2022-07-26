import eslintTapPluginConfig from '../../src'
import { TapRuleTester } from '../tap-eslint-adaptor'
import type { Rule } from 'eslint'

const rule = eslintTapPluginConfig.rules[
  'no-unknown-modifiers'
] as Rule.RuleModule

const ruleTester = TapRuleTester('rules > no-unknown-modifiers', {
  env: eslintTapPluginConfig.configs.recommended.env,
})

const header = `const tap = require('tap');\n`

ruleTester.run('no-unknown-modifiers', rule, {
  valid: [
    `${header} tap.test("my test name", t => {});`,
    `${header} tap.only("my only test name", t => {});`,
    `${header} tap.skip("my skipped test name", t => {});`,
    `${header} tap.Test.prototype.addAssert('titleCase', 1, function (str, message, extra) {
        message = message || 'should be in Title Case'
        const tc = str.toLowerCase().replace(/\b./, match => match.toUpperCase())
        return this.equal(str, tc, message, extra)
    });
    tap.titleCase('This Passes');`,
    // shouldn't be triggered since it's not a test file
    `test.boop(t => {});`,
  ],
  invalid: [
    {
      code: `${header} tap.boop("my test name", t => {});`,
      errors: [{ message: 'Unknown test modifier `boop`.' }],
    },
    {
      code: `${header} tap.onlu("my test name", t => {});`,
      errors: [{ message: 'Unknown test modifier `onlu`.' }],
    },
    {
      code: `${header} tap.c.only("my test name", t => {});`,
      errors: [{ message: 'Unknown test modifier `c`.' }],
    },
    {
      code: `${header} tap.only.onlu("my test name", t => {});`,
      errors: [{ message: 'Unknown test modifier `onlu`.' }],
    },
    {
      code: `${header} tap.boop.snoot.wow("my test name", t => {});`,
      errors: [{ message: 'Unknown test modifier `boop`.' }],
    },
    {
      code: `${header} tap.default("my test name", t => {});`,
      errors: [{ message: 'Unknown test modifier `default`.' }],
    },
  ],
})
