import eslintTapPluginConfig from '../../src'
import { TapRuleTester } from '../tap-eslint-adaptor'
import type { RuleTester, Rule } from 'eslint'

const rule = eslintTapPluginConfig.rules[
  'no-identical-title'
] as Rule.RuleModule

const ruleTester = TapRuleTester('rules > no-identical-title', {
  env: eslintTapPluginConfig.configs.recommended.env,
})

const errors: Array<RuleTester.TestCaseError> = [
  { message: 'Test title is used multiple times in the same file.' },
]
const header = `const tap = require('tap');\n`

ruleTester.run('no-identical-title', rule, {
  valid: [
    `${header}tap.test("my test name", t => {});`,
    `${header}tap.test("a", t => {}); tap.test(t => {});`,
    `${header}tap.test("a", t => {}); tap.test("b", t => {});`,
    `${header}tap.skip("a"); test.skip("b");`,
    `${header}tap.test("a", t => {}); notTest("a", t => {});`,
    `${header}const name = "boop"; tap.test(name + " 1", t => {}); tap.test(name + " 1", t => {});`,
    `${header}tap.test("a", t => {}); notTest("a", t => {});`,
    `${header}notTest("a", t => {}); notTest("a", t => {});`,
    `${header}tap.before(t => {}); test.before(t => {});`,
    `${header}tap.after(t => {}); test.after(t => {});`,
    `${header}tap.beforeEach(t => {}); test.beforeEach(t => {});`,
    `${header}tap.afterEach(t => {}); test.afterEach(t => {});`,
    // shouldn't be triggered since it's not a test file
    'test(t => {}); test(t => {});',
    'test("a", t => {}); test("a", t => {});',
  ],
  invalid: [
    {
      code: `${header}tap.test("a", t => {}); tap.test("a", t => {});`,
      errors,
    },
    {
      code: `${header}tap.test(\`a\`, t => {}); tap.test(\`a\`, t => {});`,
      errors,
    },
    {
      code: `${header}tap.test(\`boop \${name}\`, t => {}); tap.test(\`boop \${name}\`,  t => {});`,
      errors,
    },
    {
      code: `${header}tap.test("a", t => {}); tap.skip("a", t => {});`,
      errors,
    },
    {
      code: `${header}tap.test("boop" + 1, t => {}); tap.test("boop" + 1, t => {});`,
      errors,
    },
    {
      code: `${header}tap.test(\`\${"boop" + 1}\`, t => {}); tap.test(\`\${"boop" + 1}\`, t => {});`,
      errors,
    },
    {
      code: `${header}tap.skip("a", () => {}); tap.skip("a", () => {});`,
      errors,
    },
  ],
})
