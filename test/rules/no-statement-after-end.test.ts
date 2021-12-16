import eslintTapPluginConfig from '../../src'
import { TapRuleTester } from '../tap-eslint-adaptor'
import type { RuleTester, Rule } from 'eslint'

const rule = eslintTapPluginConfig.rules[
  'no-statement-after-end'
] as Rule.RuleModule

const ruleTester = TapRuleTester('rules > no-statement-after-end', {
  env: eslintTapPluginConfig.configs.recommended.env,
})

const errors: Array<RuleTester.TestCaseError> = [
  { message: 'No statements following a call to `t.end()` or `t.endAll()`.' },
]
const header = `const tap = require('tap');\n`

const makeTest = (contents: string, hasHeader?: boolean): string => {
  let testCode = `tap.test("rules > no-statement-after-end > inner test", t => { ${contents} });`

  if (hasHeader !== false) {
    testCode = header + testCode
  }

  return testCode
}

ruleTester.run('no-statement-after-end', rule, {
  valid: [
    makeTest('t.end();'),
    makeTest('t.equal(1, 1); t.end();'),
    makeTest('notT.end(); t.equal(1, 1);'),
    makeTest(
      'if (t.context.a === 1) { return t.end(); } \n t.is(1, 1); t.end();'
    ),
    makeTest('return t.end();'),
    makeTest('t.end(); return;'),
    // valid because it is not a test file (no header)
    makeTest('t.end(); t.equal(1, 1);', false),
  ],
  invalid: [
    {
      code: makeTest('t.end(); t.equal(1, 1);'),
      errors,
    },
    {
      code: makeTest('t.end(); return 3 + 4;'),
      errors,
    },
    {
      code: makeTest('t.end(); console.log("end");'),
      errors,
    },
    {
      code: makeTest(
        'if (t.context.a === 1) { t.end(); }\nt.equal(1, 1); t.end();'
      ),
      errors,
    },
  ],
})
