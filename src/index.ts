/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
const assertionMessageRule = require('./rules/assertion-message').default
const maxAssertsRule = require('./rules/max-asserts').default
const noIdenticalTitleRule = require('./rules/no-identical-title').default
const noIgnoredTestFilesRule = require('./rules/no-ignored-test-files').default
const noOnlyTestRule = require('./rules/no-only-test').default
const noSkipTestRule = require('./rules/no-skip-test').default
const noStatementAfterEndRule =
  require('./rules/no-statement-after-end').default
const noUnknownModifiersRule = require('./rules/no-unknown-modifiers').default
const testEndedRule = require('./rules/test-ended').default
const usePlanRule = require('./rules/use-plan').default
const usePlanWellRule = require('./rules/use-plan-well').default
const useTWellRule = require('./rules/use-t-well').default
const useTRule = require('./rules/use-t').default
const useTapRule = require('./rules/use-tap').default

const eslintTapPluginConfig = {
  rules: {
    'assertion-message': { create: assertionMessageRule },
    'max-asserts': { create: maxAssertsRule },
    'no-identical-title': { create: noIdenticalTitleRule },
    'no-ignored-test-files': { create: noIgnoredTestFilesRule },
    'no-only-test': { create: noOnlyTestRule },
    'no-skip-test': { create: noSkipTestRule },
    'no-statement-after-end': { create: noStatementAfterEndRule },
    'no-unknown-modifiers': { create: noUnknownModifiersRule },
    'test-ended': { create: testEndedRule },
    'use-plan': { create: usePlanRule },
    'use-plan-well': { create: usePlanWellRule },
    'use-t-well': {
      create: useTWellRule,
      meta: {
        type: 'problem',
        fixable: 'code',
      },
    },
    'use-t': { create: useTRule },
    'use-tap': { create: useTapRule },
  },
  /* eslint-enable */
  configs: {
    recommended: {
      env: {
        es6: true,
      },
      parserOptions: {
        ecmaVersion: 7,
        sourceType: 'module',
      },
      rules: {
        'tap/assertion-message': ['error', 'always'],
        'tap/max-asserts': ['error', 8],
        'tap/no-identical-title': 'error',
        'tap/no-ignored-test-files': 'error',
        'tap/no-only-test': 'error',
        'tap/no-skip-test': 'error',
        'tap/no-statement-after-end': 'error',
        'tap/no-unknown-modifiers': 'error',
        'tap/test-ended': 'error',
        'tap/use-plan': ['error', 'always'],
        'tap/use-plan-well': 'error',
        'tap/use-t-well': 'error',
        'tap/use-t': 'error',
        'tap/use-tap': 'error',
      },
    },
  },
}

module.exports = eslintTapPluginConfig
// Why do this instead of `export default ...`?
// This is just how esbuild/tsup handle exports from CJS and to maintain CJS/ESM interop.
// @see https://github.com/egoist/tsup/issues/283
module.exports.default = eslintTapPluginConfig
