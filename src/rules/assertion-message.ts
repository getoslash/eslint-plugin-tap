import { nameOfRootObject } from '../utils'
import { createTapRule } from '../create-tap-rule'
import { tapAssertMethods } from '../tap-methods'
import type {
  CallExpression,
  MemberExpression,
  PrivateIdentifier,
} from 'estree'
import type { Rule } from 'eslint'

const getArgumentsCount = (node: MemberExpression): number => {
  const propertyName = (node.property as PrivateIdentifier)
    .name as keyof typeof tapAssertMethods
  const method = tapAssertMethods[propertyName]

  if (method !== undefined) {
    return method.arguments
  }

  if (node.object.type === 'MemberExpression') {
    return getArgumentsCount(node.object)
  }

  return -1
}

export const assertionMessageTapRule = (
  context: Rule.RuleContext
): Rule.RuleListener => {
  const tap = createTapRule()
  const shouldHaveMessage = context.options[0] !== 'never'

  return tap.merge({
    CallExpression: (node: CallExpression & Rule.NodeParentExtension) => {
      if (
        !tap.isTestFile() ||
        !tap.currentTestNode() ||
        node.callee.type !== 'MemberExpression'
      ) {
        return
      }

      const { callee } = node
      if (callee.property && nameOfRootObject(callee) === 't') {
        const argsCount = getArgumentsCount(callee)

        if (argsCount === -1) {
          return
        }

        const hasMessage = argsCount <= node.arguments.length

        if (!hasMessage && shouldHaveMessage) {
          context.report({
            node,
            message: 'Expected an assertion message, but found none.',
          })
        } else if (hasMessage && !shouldHaveMessage) {
          context.report({
            node,
            message: 'Expected no assertion message, but found one.',
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

export default assertionMessageTapRule
