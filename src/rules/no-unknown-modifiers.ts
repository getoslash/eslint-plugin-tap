import { createTapRule } from '../create-tap-rule'
import { tapTopLevelMethods } from '../tap-methods'
import type { Rule } from 'eslint'
import type {
  BaseExpression,
  CallExpression,
  Expression,
  MemberExpression,
  PrivateIdentifier,
} from 'estree'

const isCall = (node: BaseExpression): node is CallExpression => {
  return node.type === 'CallExpression'
}

const isMember = (node: BaseExpression): node is MemberExpression => {
  return node.type === 'MemberExpression'
}

const getAllTestModifiers = (node: BaseExpression): Array<string> => {
  if (isCall(node)) return getAllTestModifiers(node.callee)
  if (isMember(node))
    return getAllTestModifiers(node.object).concat(
      (node.property as PrivateIdentifier).name
    )
  return []
}

const getUnknownTestModifiers = (node: Expression): Array<string> => {
  return getAllTestModifiers(node).filter((modifier) => {
    return !(tapTopLevelMethods as Readonly<Array<string>>).includes(modifier)
  })
}

export const noUnknownModifierTapRule = (
  context: Rule.RuleContext
): Rule.RuleListener => {
  const tap = createTapRule()

  return tap.merge({
    CallExpression(node: CallExpression & Rule.NodeParentExtension) {
      if (!tap.isTestFile() || tap.currentTestNode() !== node) {
        return
      }

      const unknownModifiers = getUnknownTestModifiers(node)

      if (unknownModifiers.length !== 0) {
        context.report({
          node,
          message: `Unknown test modifier \`${unknownModifiers[0]}\`.`,
        })
      }
    },
  })
}

export default noUnknownModifierTapRule
