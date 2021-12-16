import { createTapRule } from '../create-tap-rule'
import type { Rule } from 'eslint'
import type { Node, ReturnStatement } from 'estree'

type CustomCodePathSegment = Rule.CodePathSegment & {
  ended?: boolean
}

// This rule makes heavy use of eslints code path analysis
// @see http://eslint.org/docs/developer-guide/code-path-analysis.html

const isEndExpression = (node: Node) => {
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression' &&
    node.callee.object.type === 'Identifier' &&
    node.callee.object.name === 't' &&
    node.callee.property.type === 'Identifier' &&
    (node.callee.property.name === 'end' ||
      node.callee.property.name === 'endAll')
  )
}

export const noStatementAfterEndTapRule = (
  context: Rule.RuleContext
): Rule.RuleListener => {
  const tap = createTapRule()
  const segmentInfoMap: Record<string, CustomCodePathSegment> = {}
  const segmentInfoStack: Array<CustomCodePathSegment | null | undefined> = []
  let currentSegmentInfo: CustomCodePathSegment | null | undefined = null

  const segmentStart = (segment: Rule.CodePathSegment) => {
    // A new CodePathSegment has started, create an "info" object to track this segments state.
    segmentInfoStack.push(currentSegmentInfo)

    currentSegmentInfo = {
      id: segment.id,
      reachable: true,
      nextSegments: segment.nextSegments.map((nextSegment) => {
        return segmentInfoMap[nextSegment.id]
      }),
      prevSegments: segment.prevSegments.map((prevSegment) => {
        return segmentInfoMap[prevSegment.id]
      }),
    }

    segmentInfoMap[segment.id] = currentSegmentInfo
  }

  const segmentEnd = () => {
    currentSegmentInfo = segmentInfoStack.pop()
  }

  const checkForEndExpression = (node: Node) => {
    if (isEndExpression(node)) {
      ;(currentSegmentInfo as CustomCodePathSegment).ended = true
    }
  }

  const isEnded = (segment: CustomCodePathSegment) => {
    return segment.ended
  }

  const checkStatement = (node: Node) => {
    if (!tap.isTestFile()) {
      return
    }

    const ended = [currentSegmentInfo]
      .concat(currentSegmentInfo?.prevSegments)
      .filter((segment) => isEnded(segment as CustomCodePathSegment))

    // If this segment or any previous segment has already ended, further statements are not allowed, report as an error.
    if (ended.length) {
      ended.forEach((info) => {
        // Unset ended state to avoid generating lots of errors.
        /* eslint-disable-next-line no-param-reassign */
        if (info) info.ended = false
      })

      context.report({
        node,
        message: 'No statements following a call to `t.end()` or `t.endAll()`.',
      })
    }
  }

  return tap.merge({
    ExpressionStatement: checkStatement,
    WithStatement: checkStatement,
    IfStatement: checkStatement,
    SwitchStatement: checkStatement,
    ThrowStatement: checkStatement,
    TryStatement: checkStatement,
    WhileStatement: checkStatement,
    DoWhileStatement: checkStatement,
    ForStatement: checkStatement,
    ForInStatement: checkStatement,
    ForOfStatement: checkStatement,
    ReturnStatement(node: ReturnStatement) {
      // empty return statements are OK even after `t.end` and `t.endAll`,
      // only check it if there is an argument
      if (node.argument) {
        checkStatement(node)
      }
    },
    onCodePathSegmentStart: segmentStart,
    onCodePathSegmentEnd: segmentEnd,
    CallExpression: checkForEndExpression,
  })
}

export default noStatementAfterEndTapRule
