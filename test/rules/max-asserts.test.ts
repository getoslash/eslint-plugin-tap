import eslintTapPluginConfig from '../../src'
import { TapRuleTester } from '../tap-eslint-adaptor'
import type { Rule, RuleTester } from 'eslint'

const rule = eslintTapPluginConfig.rules['max-asserts'] as Rule.RuleModule

const ruleTester = TapRuleTester('rules > max-asserts', {
  env: eslintTapPluginConfig.configs.recommended.env,
})
const errors: Array<RuleTester.TestCaseError> = [
  {
    message: /^Expected at most [0-9]+ assertions, but found [0-9]+.$/,
  },
]

const header = `const tap = require('tap');\n`

const generateAssertionsOfCount = (n: number): string => {
  return Array.from({ length: n })
    .map(() => 't.equal(1, 1);')
    .join('\n')
}

ruleTester.run('max-asserts', rule, {
  valid: [
    `${header} tap.tap.test(t => { ${generateAssertionsOfCount(3)} });`,
    `${header}
				tap.test(t => { ${generateAssertionsOfCount(3)} });
				tap.test(t => { ${generateAssertionsOfCount(3)} });
			`,
    `${header} tap.test(t => { t.plan(5); ${generateAssertionsOfCount(8)} });`,
    `${header} tap.test(t => { t.teardown(() => {}); ${generateAssertionsOfCount(
      4
    )} });`,
    `${header} test.cb(t => { ${generateAssertionsOfCount(5)} t.end(); });`,
    {
      code: `${header} tap.test(t => { ${generateAssertionsOfCount(3)} });`,
      options: [3],
    },
    {
      code: `${header} tap.test(t => { notT.equal(1, 1); notT.equal(1, 1); notT.equal(1, 1); });`,
      options: [2],
    },
    // shouldn't be triggered since it's not a test file
    `tap.test(t => { ${generateAssertionsOfCount(10)} });`,
  ],
  invalid: [
    {
      code: `${header} tap.test(t => { ${generateAssertionsOfCount(9)} });`,
      errors,
    },
    {
      code: `${header} tap.test(t => { t.plan(5); ${generateAssertionsOfCount(
        9
      )} });`,
      errors,
    },
    {
      code: `${header} tap.test(t => { t.pass(1); ${generateAssertionsOfCount(
        9
      )} });`,
      errors,
    },
    {
      code: `${header} tap.test(t => { ${generateAssertionsOfCount(4)} });`,
      options: [3],
      errors,
    },
    {
      code: `${header} tap.test(t => { ${generateAssertionsOfCount(
        10
      )} }); tap.test(t => { ${generateAssertionsOfCount(10)} });`,
      errors: errors.concat(errors), // Should have two errors, one per test
    },
  ],
})
