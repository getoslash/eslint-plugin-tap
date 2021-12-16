import eslintTapPluginConfig from '../../src'
import { TapRuleTester } from '../tap-eslint-adaptor'
import type { RuleTester, Rule } from 'eslint'

const rule = eslintTapPluginConfig.rules['assertion-message'] as Rule.RuleModule

const ruleTester = TapRuleTester('rules > assertion-message', {
  env: eslintTapPluginConfig.configs.recommended.env,
})

const missingError: Array<RuleTester.TestCaseError> = [
  {
    message: 'Expected an assertion message, but found none.',
  },
]

const foundError: Array<RuleTester.TestCaseError> = [
  {
    message: 'Expected no assertion message, but found one.',
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
		tap.test('rules > assertion-message > ${content.split('(')[0]}', (t) => {
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

ruleTester.run('assertion-message', rule, {
  valid: [
    testCase('always', `t.pass('message');`),
    testCase('always', `t.fail('message');`),
    testCase('always', `t.ok('unicorn', 'message');`),
    testCase('always', `t.notOk('unicorn', 'message');`),
    testCase('always', `t.true(true, 'message');`),
    testCase('always', `t.false(false, 'message');`),
    testCase('always', `t.is('same', 'same', 'message');`),
    testCase('always', `t.same({}, {}, 'message');`),
    testCase('always', `t.notSame({}, {a: true}, 'message');`),
    testCase('always', `t.throws(new Error('oops'), new Error(), 'message');`),
    testCase('always', `t.doesNotThrow(Promise.resolve(), 'message');`),
    testCase(
      'always',
      `t.resolveMatch(Promise.resolve('ok'), 'ok', 'message');`
    ),
    testCase(
      'always',
      `t.resolveMatchSnapshot(Promise.resolve('ok'), 'message');`
    ),
    testCase('always', `t.matchSnapshot('ok', 'message');`),
    testCase(
      'always',
      `t.expectUncaughtException(() => { throw new Error('oops') }, new Error(), 'message');`
    ),
    testCase('always', `t.equal({a: true}, {a: true}, 'message');`),
    testCase('always', `t.not({a: false}, {a: true}, 'message');`),
    testCase('always', `t.same({a: true}, {a: true}, 'message');`),
    testCase('always', `t.notSame({a: false}, {a: true}, 'message');`),
    testCase('always', `t.strictSame({a: true}, {a: true}, 'message');`),
    testCase('always', `t.strictNotSame({a: false}, {a: true}, 'message');`),
    testCase(
      'always',
      `t.match({x: 'asdf',y: 'z'}, {x: /a[sdf]{3}/}, 'message');`
    ),
    testCase('always', `t.has({x: 'asdf',y: 'z'}, ['x', 'y'], 'message');`),
    testCase(
      'always',
      `t.notMatch({x: 'asdf',y: 'z'}, {x: /a[bcd]{3}/}, 'message');`
    ),
    testCase('always', `t.type({a: true}, 'object', 'message');`),
    testCase('always', `t.plan(1);`),
    testCase('always', `t.end();`),
    // shouldn't be triggered since it's not a test file
    testCase('always', `t.ok(true);`, [], false),

    testCase('never', `t.pass();`),
    testCase('never', `t.fail();`),
    testCase('never', `t.ok('unicorn');`),
    testCase('never', `t.notOk('unicorn');`),
    testCase('never', `t.true(true);`),
    testCase('never', `t.false(false);`),
    testCase('never', `t.deepEqual({}, {});`),
    testCase('never', `t.notDeepEqual({}, {a: true});`),
    testCase('never', `t.throws(Promise.reject());`),
    testCase('never', `t.doesNotThrow(Promise.resolve());`),
    testCase('never', `t.skip.is('same', 'same');`),
    testCase('never', `t.plan('a', 'b', 'c', 'd');`),
    testCase('never', `t.end('a', 'b', 'c', 'd');`),
    // shouldn't be triggered since it's not a test file
    testCase('never', `t.true(true, 'message');`, [], false),
  ],
  invalid: [
    testCase(
      'always',
      `t.ok('unicorn');`,
      missingError
    ) as RuleTester.InvalidTestCase,
    testCase(
      'always',
      `t.notOk('unicorn');`,
      missingError
    ) as RuleTester.InvalidTestCase,
    testCase(
      'always',
      `t.same({}, {});`,
      missingError
    ) as RuleTester.InvalidTestCase,
    testCase(
      'always',
      `t.notSame({}, {a: true});`,
      missingError
    ) as RuleTester.InvalidTestCase,
    testCase(
      'always',
      `t.throws(new Error());`,
      missingError
    ) as RuleTester.InvalidTestCase,
    testCase(
      'always',
      `t.doesNotThrow(() => {});`,
      missingError
    ) as RuleTester.InvalidTestCase,

    testCase(
      'never',
      `t.ok('unicorn', 'message');`,
      foundError
    ) as RuleTester.InvalidTestCase,
    testCase(
      'never',
      `t.notOk('unicorn', 'message');`,
      foundError
    ) as RuleTester.InvalidTestCase,
    testCase(
      'never',
      `t.same({}, {}, 'message');`,
      foundError
    ) as RuleTester.InvalidTestCase,
    testCase(
      'never',
      `t.notSame({}, {a: true}, 'message');`,
      foundError
    ) as RuleTester.InvalidTestCase,
    testCase(
      'never',
      `t.throws(new Error('oops'), new Error(), 'message');`,
      foundError
    ) as RuleTester.InvalidTestCase,
    testCase(
      'never',
      `t.doesNotThrow(() => {}, 'message');`,
      foundError
    ) as RuleTester.InvalidTestCase,
  ],
})
