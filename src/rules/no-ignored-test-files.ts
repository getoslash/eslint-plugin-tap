import path from 'path'
import { sync } from 'pkg-up'
import multimatch from 'multimatch'
import { createTapRule } from '../create-tap-rule'
import type { Linter, Rule } from 'eslint'
import type { CallExpression, Program } from 'estree'

const defaultFiles = [
  'test/**/*.{js,ts}',
  'tests/**/*.{js,ts}',
  '**/__tests__/**/*.{js,ts}',
]

const defaultExcludedFiles: Array<string> = []

const isIgnored = (
  rootDir: string,
  files: Array<string>,
  excludedFiles: Array<string>,
  filepath: string
): string | null => {
  const relativeFilePath = path.relative(rootDir, filepath)
  if (multimatch([relativeFilePath], excludedFiles).length !== 0) {
    return `Test file is ignored because it is in \`${excludedFiles.join(
      ' '
    )}\`.`
  }

  if (multimatch([relativeFilePath], files).length === 0) {
    return `Test file is ignored because it is not in \`${files.join(' ')}\`.`
  }

  return null
}

function getRootDir(): string | undefined | null {
  const packageFilePath = sync()
  return packageFilePath && path.dirname(packageFilePath)
}

export const noIgnoredTestFilesTapRule = (
  context: Rule.RuleContext
): Rule.RuleListener => {
  const tap = createTapRule()
  const rootDir = getRootDir()
  const options = (context.options[0] as Linter.ConfigOverride) || {}
  /* eslint-disable no-nested-ternary */
  const files = options.files
    ? Array.isArray(options.files)
      ? options.files
      : [options.files]
    : defaultFiles
  const excludedFiles = options.excludedFiles
    ? Array.isArray(options.excludedFiles)
      ? options.excludedFiles
      : [options.excludedFiles]
    : defaultExcludedFiles
  /* eslint-enable no-nested-ternary */

  let hasTestCall = false

  if (!rootDir) {
    // Could not find a folder with a package.json
    return {}
  }

  return tap.merge({
    CallExpression(node: CallExpression & Rule.NodeParentExtension) {
      if (tap.isTestFile() && tap.currentTestNode() === node) {
        hasTestCall = true
      }
    },
    'Program:exit': (node: Program) => {
      if (!hasTestCall) {
        return
      }

      const ignoredReason = isIgnored(
        rootDir,
        files,
        excludedFiles,
        context.getFilename()
      )

      if (ignoredReason) {
        context.report({
          node,
          message: ignoredReason,
        })
      }

      hasTestCall = false
    },
  })
}

export const schema: Rule.RuleMetaData['schema'] = [
  {
    type: 'object',
    properties: {
      files: {
        type: 'array',
      },
    },
  },
]

export default noIgnoredTestFilesTapRule
