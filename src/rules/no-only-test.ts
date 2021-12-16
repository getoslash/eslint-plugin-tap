import { createTapRule } from '../create-tap-rule'
import type { Rule } from 'eslint'
import type { CallExpression } from 'estree'

const noOnlyTestTapRule = (context: Rule.RuleContext): Rule.RuleListener => {
  const tap = createTapRule()

  return tap.merge({
    CallExpression(node: CallExpression & Rule.NodeParentExtension) {
      if (
        tap.isTestFile() &&
        tap.currentTestNode() === node &&
        tap.hasTestModifier('only')
      ) {
        context.report({
          node,
          message: '`tap.only()` should not be used.',
        })
      }
    },
  })
}

export default noOnlyTestTapRule
