import { createTapRule } from '../create-tap-rule'
import { nameOfRootObject } from '../utils'
import { tapAssertMethods } from '../tap-methods'
import type { Rule } from 'eslint'
import type { CallExpression, Node, PrivateIdentifier } from 'estree'

export const usePlanWellRule = (
  context: Rule.RuleContext
): Rule.RuleListener => {
  const tap = createTapRule()
  const maxPlans = 1 as const
  const methodsUsed: Array<string> = []
  let planCount = 0
  let nodeToReport: Node | null = null
  let planWithNoArgumentFound = false
  let assertionUsedBeforePlan = false

  const wasAssertionUsedBeforePlan = () => {
    const planPosition = methodsUsed.findIndex((m) => m === 'plan')
    const methodsBeforePlan = methodsUsed.slice(0, planPosition + 1)
    return Object.keys(tapAssertMethods).some((m) =>
      methodsBeforePlan.includes(m)
    )
  }

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

      assertionUsedBeforePlan = wasAssertionUsedBeforePlan()
      if (assertionUsedBeforePlan) {
        nodeToReport = node
        return
      }

      if (nameOfRootObject(callee) === 't' && method === 'plan') {
        if (node.arguments.length === 0) {
          planWithNoArgumentFound = true
          nodeToReport = node
          return
        }

        planCount += 1

        if (planCount > maxPlans) {
          nodeToReport = node
        }
      }
    },
    'CallExpression:exit': (
      node: CallExpression & Rule.NodeParentExtension
    ) => {
      if (tap.isTestFile() && tap.currentTestNode() === node) {
        if (methodsUsed.includes('plan') && nodeToReport) {
          if (assertionUsedBeforePlan) {
            context.report({
              node: nodeToReport,
              message: '`t.plan()` must be used before any assertions.',
            })
          }
          if (planWithNoArgumentFound) {
            context.report({
              node: nodeToReport,
              message:
                '`t.plan()` must be given an argument of the plan count.',
            })
          }

          if (planCount > maxPlans) {
            context.report({
              node: nodeToReport,
              message: `Expected only ${maxPlans} \`t.plan()\` statement, but found ${planCount}.`,
            })
          }
        }

        planCount = 0
        nodeToReport = null
        planWithNoArgumentFound = false
        assertionUsedBeforePlan = false
      }
    },
  })
}

export default usePlanWellRule
