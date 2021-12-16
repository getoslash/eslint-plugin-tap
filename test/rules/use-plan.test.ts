import eslintTapPluginConfig from '../../src'
import { TapRuleTester } from '../tap-eslint-adaptor'
import type { RuleTester, Rule } from 'eslint'

const rule = eslintTapPluginConfig.rules['use-plan'] as Rule.RuleModule

const ruleTester = TapRuleTester('rules > use-plan', {
  env: eslintTapPluginConfig.configs.recommended.env,
})

const missingError: Array<RuleTester.TestCaseError> = [
  {
    message: 'Every test must have a `t.plan()` statement.',
  },
]

const header = `const tap = require('tap');\n`

const testCase = (
  option: RuleTester.ValidTestCase['options'],
  content: string,
  errors?: RuleTester.InvalidTestCase['errors'],
  useHeader?: boolean
): RuleTester.ValidTestCase | RuleTester.InvalidTestCase => {
  const testFn = `
          tap.test('rules > use-plan > ${content.split('(')[0]}', (t) => {
              ${content}
              t.end();
          });
      `

  return {
    errors: errors || [],
    options: [option],
    code: `${useHeader === false ? '' : header}${testFn}`,
  }
}

ruleTester.run('use-plan', rule, {
  valid: [
    testCase('always', 't.plan(1); fn(v); t.ok(true);'),
    testCase('always', 't.setTimeout(100); t.plan(1); t.ok(true);'),
    testCase('never', 't;'),
    testCase('never', 'fn(t);'),
    testCase('never', 't.plan(1); fn(v); t.ok(true);'),
    testCase('never', `t.ok(true);`),
    // shouldn't be triggered since it's not a test file
    testCase('always', 't.plan();', [], false),
    testCase('always', 't.plan(3);', [], false),
    testCase('always', 't.plan;', [], false),
    testCase('never', 't.plan();', [], false),
    testCase('never', 't.plan(3);', [], false),
    testCase('never', 't.plan;', [], false),
  ],
  invalid: [
    testCase(
      'always',
      `t.ok(true);`,
      missingError
    ) as RuleTester.InvalidTestCase,
  ],
})
