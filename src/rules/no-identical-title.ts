import { isDeepStrictEqual } from 'util'
import espurify from 'espurify'
import { createTapRule } from '../create-tap-rule'
import type { Rule } from 'eslint'
import type {
  BaseExpression,
  BinaryExpression,
  CallExpression,
  Expression,
  Node,
  TemplateLiteral,
} from 'estree'

const isLiteral = (node: BaseExpression): node is TemplateLiteral => {
  return node.type === 'Literal' || node.type === 'TemplateLiteral'
}

const isBinary = (node: BaseExpression): node is BinaryExpression => {
  return node.type === 'BinaryExpression' || node.type === 'TemplateLiteral'
}

const isStatic = (node: BaseExpression | undefined): boolean => {
  if (!node) return false
  if (isLiteral(node)) return true // TODO: check this out -≥ node.expressions.every(isStatic)
  if (isBinary(node)) return isStatic(node.left) && isStatic(node.right)
  return false
}

const purify = (node: Node): Node => {
  return node && espurify(node)
}

const isTitleUsed = (
  usedTitleNodes: Array<Node>,
  titleNode: Expression
): boolean => {
  const purifiedNode = purify(titleNode)
  return usedTitleNodes.some((usedTitle) =>
    isDeepStrictEqual(purifiedNode, usedTitle)
  )
}

export const noIdenticalTitleTapRule = (
  context: Rule.RuleContext
): Rule.RuleListener => {
  const tap = createTapRule()
  let usedTitleNodes: Array<Node> = []

  return tap.merge({
    CallExpression: (node: CallExpression & Rule.NodeParentExtension) => {
      if (
        !tap.isTestFile() ||
        tap.currentTestNode() !== node ||
        tap.hasHookModifier()
      ) {
        return
      }

      const args = node.arguments
      const titleNode =
        args.length > 1 || tap.hasTestModifier('todo') ? args[0] : undefined

      if (!titleNode || !isStatic(titleNode)) {
        return
      }

      if (isTitleUsed(usedTitleNodes, titleNode as Expression)) {
        context.report({
          node,
          message: 'Test title is used multiple times in the same file.',
        })
        return
      }

      usedTitleNodes.push(purify(titleNode as Node))
    },
    'Program:exit': () => {
      usedTitleNodes = []
    },
  })
}

export default noIdenticalTitleTapRule
