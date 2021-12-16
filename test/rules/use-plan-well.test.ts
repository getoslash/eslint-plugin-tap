import eslintTapPluginConfig from '../../src'
import { TapRuleTester } from '../tap-eslint-adaptor'
import type { RuleTester, Rule } from 'eslint'

const rule = eslintTapPluginConfig.rules['use-plan-well'] as Rule.RuleModule

const ruleTester = TapRuleTester('rules > use-plan-well', {
  env: eslintTapPluginConfig.configs.recommended.env,
})

const beforeError: Array<RuleTester.TestCaseError> = [
  {
    message: '`t.plan()` must be used before any assertions.',
  },
]

const argumentError: Array<RuleTester.TestCaseError> = [
  {
    message: '`t.plan()` must be given an argument of the plan count.',
  },
]

const countError: Array<RuleTester.TestCaseError> = [
  {
    message: /^Expected only 1 `t.plan\(\)` statement, but found [0-9]+.$/,
  },
]

const header = `const tap = require('tap');\n`

const testCase = (
  content: string,
  errors?: RuleTester.InvalidTestCase['errors'],
  useHeader?: boolean
): RuleTester.ValidTestCase | RuleTester.InvalidTestCase => {
  const testFn = `
          tap.test('rules > use-plan-well > ${content.split('(')[0]}', (t) => {
              ${content}
              t.end();
          });
      `

  return {
    errors: errors || [],
    code: `${useHeader === false ? '' : header}${testFn}`,
  }
}

ruleTester.run('use-plan-well', rule, {
  valid: [
    testCase('t.plan(1); fn(v); t.ok(true);'),
    testCase('t.setTimeout(100); t.plan(1); t.ok(true);'),
    testCase('t;'),
    testCase('fn(t);'),
    testCase('t.plan(1); fn(v); t.ok(true);'),
    testCase(`t.ok(true);`),
    // shouldn't be triggered since it's not a test file
    testCase('t.plan();', [], false),
    testCase('t.plan(3);', [], false),
    testCase('t.plan;', [], false),
  ],
  invalid: [
    testCase(
      `t.ok(true); t.plan(1);`,
      beforeError
    ) as RuleTester.InvalidTestCase,
    testCase(`t.plan();`, argumentError) as RuleTester.InvalidTestCase,
    testCase(
      `t.plan(1); t.ok(true); t.plan(3);`,
      countError
    ) as RuleTester.InvalidTestCase,
  ],
})
