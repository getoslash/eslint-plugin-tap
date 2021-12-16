import eslintTapPluginConfig from '../../src'
import { TapRuleTester } from '../tap-eslint-adaptor'
import type { Rule } from 'eslint'

const rule = eslintTapPluginConfig.rules['use-t-well'] as Rule.RuleModule

const ruleTester = TapRuleTester('rules > use-t-well', {
  env: eslintTapPluginConfig.configs.recommended.env,
})

const header = `const tap = require('tap');\n`
const testContentTemplate = (content: string): string =>
  `tap.test("rules > use-t-well > inner test", t => { ${content} });`

const testCase = (contents: string, prependHeader?: boolean) => {
  const content = testContentTemplate(contents)

  if (prependHeader !== false) {
    return header + content
  }

  return content
}

ruleTester.run('use-t-well', rule, {
  valid: [
    testCase('t;'),
    testCase('fn(t);'),
    testCase('t.end();'),
    testCase('t.pass();'),
    testCase('t.fail();'),
    testCase('t.ok(v);'),
    testCase('t.notOk(v);'),
    testCase('t.not(v);'),
    testCase('t.throws(fn);'),
    testCase('t.doesNotThrow(fn);'),
    testCase('setImmediate(t.end);'),
    testCase('t.deepEqual;'),
    testCase('t.plan(1);'),
    testCase('a.boop();'),
    // shouldn't be triggered since it's not a test file
    testCase('t.boop(a, a);', false),
    testCase('t.snoot;', false),
  ],
  invalid: [
    {
      code: testCase('t();'),
      errors: [{ message: '`t` is not a function.' }],
    },
    {
      code: testCase('t.is(v);'),
      errors: [
        {
          message: '`t.is()` is deprecated, use `equal()` instead.',
        },
      ],
      output: `${header}${testContentTemplate('t.equal(v);')}`,
    },
    {
      code: testCase('t.true(v);'),
      errors: [
        {
          message: '`t.true()` is deprecated, use `ok()` instead.',
        },
      ],
      output: `${header}${testContentTemplate('t.ok(v);')}`,
    },
    {
      code: testCase('t.false(v);'),
      errors: [
        {
          message: '`t.false()` is deprecated, use `notOk()` instead.',
        },
      ],
      output: `${header}${testContentTemplate('t.notOk(v);')}`,
    },
    {
      code: testCase('t.deepEqual(v, v);'),
      errors: [
        {
          message: '`t.deepEqual()` is deprecated, use `same()` instead.',
        },
      ],
      output: `${header}${testContentTemplate('t.same(v, v);')}`,
    },
    {
      code: testCase('t.boop(a, a);'),
      errors: [{ message: 'Unknown assertion method `boop`.' }],
    },
    {
      code: testCase('t.depEqual(a, a);'),
      errors: [{ message: 'Unknown assertion method `depEqual`.' }],
    },
    {
      code: testCase('t.context();'),
      errors: [{ message: 'Unknown assertion method `context`.' }],
    },
    {
      code: testCase('t.a = 1;'),
      errors: [{ message: 'Unknown tap method `a`.' }],
    },
    {
      code: testCase('t.ctx.a = 1;'),
      errors: [{ message: 'Unknown tap method `ctx`.' }],
    },
    {
      code: testCase('t.deepEqu;'),
      errors: [{ message: 'Unknown tap method `deepEqu`.' }],
    },
    {
      code: testCase('t.paln(1);'),
      errors: [{ message: 'Unknown assertion method `paln`.' }],
    },
    {
      code: testCase('t.skip();'),
      errors: [{ message: 'Missing assertion method.' }],
    },
  ],
})
