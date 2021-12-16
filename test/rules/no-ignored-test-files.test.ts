import path from 'path'
import eslintTapPluginConfig from '../../src'
import { TapRuleTester } from '../tap-eslint-adaptor'
import type { Rule } from 'eslint'

const rule = eslintTapPluginConfig.rules[
  'no-ignored-test-files'
] as Rule.RuleModule

const ruleTester = TapRuleTester('rules > no-ignored-test-files', {
  env: eslintTapPluginConfig.configs.recommended.env,
})

const header = `const tap = require('tap');\n`
const rootDir = process.cwd()

const toPath = (subPath: string): string => {
  return path.join(rootDir, subPath)
}

const code = (hasHeader: boolean): string => {
  return `${
    hasHeader ? header : ''
  }tap.test("rules > no-ignored-test-files > rule tester run", t => { t.pass("ok"); });`
}

ruleTester.run('no-ignored-test-files', rule, {
  valid: [
    {
      code: code(true),
      filename: toPath('test/module/component.js'),
    },
    {
      code: code(true),
      filename: toPath('test/module/component.ts'),
    },
    {
      code: code(true),
      filename: toPath('src/module/__tests__/component.js'),
    },
    {
      code: `${header}method(t => {});`,
      filename: toPath('test/module/fixtures/component.js'),
      options: [{ excludedFiles: ['**/fixtures/**'] }],
    },
    {
      code: code(false),
      filename: toPath('test/module/fixtures/component.js'),
      options: [{ excludedFiles: ['**/fixtures/**'] }],
    },
    {
      code: code(true),
      filename: toPath('src/module/__tests__/component.ts'),
    },
    {
      code: `${header}method(t => {});`,
      filename: toPath('test/module/fixtures/component.ts'),
      options: [{ excludedFiles: ['**/fixtures/**'] }],
    },
    {
      code: code(false),
      filename: toPath('test/module/fixtures/component.ts'),
      options: [{ excludedFiles: ['**/fixtures/**'] }],
    },
  ],
  invalid: [
    {
      code: code(true),
      filename: toPath('test/module/fixtures/component.js'),
      errors: [
        {
          message:
            'Test file is ignored because it is in `**/fixtures/** **/helpers/**`.',
        },
      ],
      options: [{ excludedFiles: ['**/fixtures/**', '**/helpers/**'] }],
    },
    {
      code: code(true),
      filename: toPath('test/module/fixtures/component.ts'),
      errors: [
        {
          message:
            'Test file is ignored because it is in `**/fixtures/** **/helpers/**`.',
        },
      ],
      options: [{ excludedFiles: ['**/fixtures/**', '**/helpers/**'] }],
    },
    {
      code: code(true),
      filename: toPath('test/module/helpers/component.js'),
      errors: [
        {
          message:
            'Test file is ignored because it is in `**/fixtures/** **/helpers/**`.',
        },
      ],
      options: [{ excludedFiles: ['**/fixtures/**', '**/helpers/**'] }],
    },
    {
      code: code(true),
      filename: toPath('test/module/helpers/component.ts'),
      errors: [
        {
          message:
            'Test file is ignored because it is in `**/fixtures/** **/helpers/**`.',
        },
      ],
      options: [{ excludedFiles: ['**/fixtures/**', '**/helpers/**'] }],
    },
    {
      code: code(true),
      filename: toPath('lib/module.spec.js'),
      errors: [
        {
          message:
            'Test file is ignored because it is not in `test/**/*.{js,ts} tests/**/*.{js,ts} **/__tests__/**/*.{js,ts}`.',
        },
      ],
    },
    {
      code: code(true),
      filename: toPath('lib/module.spec.ts'),
      errors: [
        {
          message:
            'Test file is ignored because it is not in `test/**/*.{js,ts} tests/**/*.{js,ts} **/__tests__/**/*.{js,ts}`.',
        },
      ],
    },
    {
      code: code(true),
      filename: toPath('test/module/component.js'),
      options: [{ files: ['lib/**/*.spec.js'] }],
      errors: [
        {
          message:
            'Test file is ignored because it is not in `lib/**/*.spec.js`.',
        },
      ],
    },
    {
      code: code(true),
      filename: toPath('test/module/component.ts'),
      options: [{ files: ['lib/**/*.spec.ts'] }],
      errors: [
        {
          message:
            'Test file is ignored because it is not in `lib/**/*.spec.ts`.',
        },
      ],
    },
    {
      code: code(true),
      filename: toPath('lib/module.not-test.js'),
      options: [{ files: ['lib/**/*.spec.js'] }],
      errors: [
        {
          message:
            'Test file is ignored because it is not in `lib/**/*.spec.js`.',
        },
      ],
    },
    {
      code: code(true),
      filename: toPath('lib/module.not-test.ts'),
      options: [{ files: ['lib/**/*.spec.ts'] }],
      errors: [
        {
          message:
            'Test file is ignored because it is not in `lib/**/*.spec.ts`.',
        },
      ],
    },
  ],
})
