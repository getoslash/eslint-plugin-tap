import { createTapRule } from '../create-tap-rule'
import type { Rule } from 'eslint'
import type { CallExpression } from 'estree'

export const noSkipTestTapRule = (
  context: Rule.RuleContext
): Rule.RuleListener => {
  const tap = createTapRule()

  return tap.merge({
    CallExpression(node: CallExpression & Rule.NodeParentExtension) {
      if (
        tap.isTestFile() &&
        tap.currentTestNode() === node &&
        tap.hasTestModifier('skip')
      ) {
        context.report({
          node,
          message: 'No tests should be skipped.',
        })
      }
    },
  })
}

export default noSkipTestTapRule
