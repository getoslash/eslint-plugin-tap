import { isDeepStrictEqual } from 'util'
import espurify from 'espurify'
import type { Rule } from 'eslint'
import type {
  Identifier,
  ImportDeclaration,
  Node,
  VariableDeclarator,
} from 'estree'

const tapVariableDeclaratorInitAst = {
  type: 'CallExpression',
  callee: {
    type: 'Identifier',
    name: 'require',
  },
  arguments: [
    {
      type: 'Literal',
      value: 'tap',
    },
  ],
} as const

const report = (context: Rule.RuleContext, node: Node): void => {
  context.report({
    node,
    message: 'tap should be imported as `tap`.',
  })
}

export const useTapTapRule = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    ImportDeclaration(node: ImportDeclaration) {
      if (
        node.source.value === 'tap' &&
        node.specifiers[0].local.name !== 'tap'
      ) {
        report(context, node)
      }
    },
    VariableDeclarator(node: VariableDeclarator) {
      if (
        (node.id as Identifier).name !== 'tap' &&
        node.init &&
        isDeepStrictEqual(espurify(node.init), tapVariableDeclaratorInitAst)
      ) {
        report(context, node)
      }
    },
  }
}

export default useTapTapRule
