import { createTapRule } from '../create-tap-rule'
import type { Rule } from 'eslint'
import type { CallExpression, PrivateIdentifier } from 'estree'

export const usePlanRule = (context: Rule.RuleContext): Rule.RuleListener => {
  const tap = createTapRule()
  const shouldHavePlan = context.options[0] !== 'never'
  const methodsUsed: Array<string> = []

  return tap.merge({
    CallExpression(node: CallExpression & Rule.NodeParentExtension) {
      if (
        !tap.isTestFile() ||
        !tap.currentTestNode() ||
        node.callee.type !== 'MemberExpression'
      ) {
        return
      }

      const { callee } = node
      const method = (callee.property as PrivateIdentifier)?.name
      methodsUsed.push(method)
    },
    'CallExpression:exit': (
      node: CallExpression & Rule.NodeParentExtension
    ) => {
      if (
        tap.isTestFile() &&
        tap.currentTestNode() === node &&
        shouldHavePlan
      ) {
        if (!methodsUsed.includes('plan')) {
          context.report({
            node,
            message: `Every test must have a \`t.plan()\` statement.`,
          })
        }
      }
    },
  })
}

export const schema: Rule.RuleMetaData['schema'] = [
  {
    enum: ['always', 'never'],
  },
]

export default usePlanRule
