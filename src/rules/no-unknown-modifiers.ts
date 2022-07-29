import { createTapRule } from '../create-tap-rule'
import { tapTopLevelMethods } from '../tap-methods'
import type { Rule } from 'eslint'
import type {
  BaseCallExpression,
  BaseExpression,
  CallExpression,
  Expression,
  MemberExpression,
  PrivateIdentifier,
  SimpleLiteral,
} from 'estree'
import type { Writable } from 'type-fest'

const TAP_TOP_LEVEL_METHODS: Writable<Array<string>> = [...tapTopLevelMethods]

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
  const allTestModifiers = getAllTestModifiers(node)
  // If a custom assertion has been added using the official example (see https://node-tap.org/docs/api/advanced/#taddassertname-length-fn)
  // add that as a top-level method.
  if (
    allTestModifiers[0] === 'Test' &&
    allTestModifiers[1] === 'prototype' &&
    allTestModifiers[2] === 'addAssert'
  ) {
    const customModifier = (
      (node as BaseCallExpression).arguments[0] as SimpleLiteral
    ).value as string
    TAP_TOP_LEVEL_METHODS.push(customModifier)
  }
  return allTestModifiers.filter((modifier) => {
    return !TAP_TOP_LEVEL_METHODS.includes(modifier)
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
