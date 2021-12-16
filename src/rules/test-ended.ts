import { createTapRule } from '../create-tap-rule'
import type { Rule } from 'eslint'
import type { CallExpression, Identifier, MemberExpression } from 'estree'

export const testEndedTapRule = (
  context: Rule.RuleContext
): Rule.RuleListener => {
  const tap = createTapRule()
  let endCalled = false

  return tap.merge({
    MemberExpression: (node: MemberExpression & Rule.NodeParentExtension) => {
      if (!tap.isTestFile() || !tap.currentTestNode()) {
        return
      }

      if (
        (node.object as Identifier).name === 't' &&
        (node.property as Identifier).name === 'end'
      ) {
        endCalled = true
      }
    },
    'CallExpression:exit': (
      node: CallExpression & Rule.NodeParentExtension
    ) => {
      if (!tap.isTestFile() || !tap.currentTestNode()) {
        return
      }

      if (tap.currentTestNode() === node) {
        // leaving test function
        if (endCalled) {
          endCalled = false
        } else {
          context.report({
            node,
            message:
              'Test was not ended. Make sure to explicitly end the test with `t.end()`.',
          })
        }
      }
    },
  })
}

export default testEndedTapRule
