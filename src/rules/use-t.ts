import { createTapRule } from '../create-tap-rule'
import type { Rule } from 'eslint'
import type { BaseFunction, CallExpression, Identifier } from 'estree'

export const useTTapRule = (context: Rule.RuleContext): Rule.RuleListener => {
  const tap = createTapRule()

  return tap.merge({
    CallExpression(node: CallExpression & Rule.NodeParentExtension) {
      if (!tap.isTestFile() || tap.currentTestNode() !== node) {
        return
      }

      const functionArg = node.arguments[
        node.arguments.length - 1
      ] as BaseFunction

      if (!functionArg.params || !functionArg.params.length) {
        return
      }

      if (functionArg.params.length > 1) {
        context.report({
          node,
          message: 'Test should only have one parameter named `t`.',
        })
      } else if ((functionArg.params[0] as Identifier).name !== 't') {
        context.report({
          node,
          message: 'Test parameter should be named `t`.',
        })
      }
    },
  })
}

export default useTTapRule
