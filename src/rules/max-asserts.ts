import { nameOfRootObject } from '../utils'
import { createTapRule } from '../create-tap-rule'
import { tapTestHelperMethods } from '../tap-methods'
import type { Rule } from 'eslint'
import type { CallExpression, Node, PrivateIdentifier } from 'estree'

const notAssertionMethods = tapTestHelperMethods.slice()
const defaultMaxAssertions = 8 as const

export const maxAssertsTapRule = (
  context: Rule.RuleContext
): Rule.RuleListener => {
  const tap = createTapRule()
  const maxAssertions: number =
    Number(context.options[0]) || defaultMaxAssertions
  let assertionCount = 0
  let nodeToReport: Node | null = null

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

      if (
        nameOfRootObject(callee) === 't' &&
        !notAssertionMethods.includes(
          (callee.property as PrivateIdentifier)
            ?.name as typeof notAssertionMethods[number]
        )
      ) {
        assertionCount += 1

        if (assertionCount === maxAssertions + 1) {
          nodeToReport = node
        }
      }
    },
    'CallExpression:exit': (
      node: CallExpression & Rule.NodeParentExtension
    ) => {
      if (nodeToReport && tap.currentTestNode() === node) {
        if (assertionCount > maxAssertions) {
          context.report({
            node: nodeToReport,
            message: `Expected at most ${maxAssertions} assertions, but found ${assertionCount}.`,
          })
        }

        assertionCount = 0
        nodeToReport = null
      }
    },
  })
}

export const schema: Rule.RuleMetaData['schema'] = [
  {
    type: 'integer',
  },
]

export default maxAssertsTapRule
