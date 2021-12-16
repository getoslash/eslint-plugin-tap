import { isDeepStrictEqual } from 'util'
import espurify from 'espurify'
import type { Rule } from 'eslint'
import type {
  BaseExpression,
  BaseNode,
  CallExpression,
  Expression,
  Identifier,
  ImportDeclaration,
  MemberExpression,
  Node,
  VariableDeclarator,
} from 'estree'

const moduleName = 'tap' as const

const tapImportDeclarationAst = {
  type: 'ImportDeclaration',
  specifiers: [
    {
      type: 'ImportDefaultSpecifier',
      local: {
        type: 'Identifier',
        name: moduleName,
      },
    },
  ],
  source: {
    type: 'Literal',
    value: moduleName,
  },
} as const

const tapVariableDeclaratorAst = {
  type: 'VariableDeclarator',
  id: {
    type: 'Identifier',
    name: moduleName,
  },
  init: {
    type: 'CallExpression',
    callee: {
      type: 'Identifier',
      name: 'require',
    },
    arguments: [
      {
        type: 'Literal',
        value: moduleName,
      },
    ],
  },
} as const

const isCall = (node: BaseExpression): node is CallExpression => {
  return node.type === 'CallExpression'
}

const isMember = (node: BaseExpression): node is MemberExpression => {
  return node.type === 'MemberExpression'
}

const isIdentifier = (node: BaseExpression): node is Identifier => {
  return node.type === 'Identifier'
}

const isTestFunctionCall = (node: BaseNode): boolean => {
  if (!node) return false
  if (isIdentifier(node)) {
    return node.name === moduleName
  }
  if (isMember(node)) {
    return isTestFunctionCall(node.object)
  }
  return false
}

const hasTestModifier = (
  node: BaseNode | BaseExpression | null,
  mod: string
): boolean => {
  if (!node) return false
  if (isCall(node)) {
    return hasTestModifier(node.callee, mod)
  }
  if (isMember(node)) {
    if (node.property.type === 'Identifier' && node.property.name === mod) {
      return true
    }
    return hasTestModifier(node.object, mod)
  }
  return false
}

export const createTapRule = () => {
  let isTestFile = false
  let currentTestNode: BaseNode | BaseExpression | null = null

  const predefinedRules: Rule.RuleListener = {
    ImportDeclaration: (node: ImportDeclaration): void => {
      if (
        !isTestFile &&
        isDeepStrictEqual(espurify(node), tapImportDeclarationAst)
      ) {
        isTestFile = true
      }
    },
    VariableDeclarator: (node: VariableDeclarator): void => {
      if (
        !isTestFile &&
        isDeepStrictEqual(espurify(node), tapVariableDeclaratorAst)
      ) {
        isTestFile = true
      }
    },
    CallExpression: (node: CallExpression & Rule.NodeParentExtension): void => {
      if (!currentTestNode) {
        if (isTestFunctionCall(node.callee)) {
          currentTestNode = node
        }
      }
    },
    'CallExpression:exit': (
      node: CallExpression & Rule.NodeParentExtension
    ): void => {
      if (currentTestNode === node) {
        currentTestNode = null
      }
    },
    'Program:exit': (): void => {
      isTestFile = false
    },
  }

  const rule = {
    hasTestModifier: (mod: string): boolean => {
      return hasTestModifier(currentTestNode, mod)
    },
    hasHookModifier: (): boolean => {
      return (
        hasTestModifier(currentTestNode, 'before') ||
        hasTestModifier(currentTestNode, 'beforeEach') ||
        hasTestModifier(currentTestNode, 'after') ||
        hasTestModifier(currentTestNode, 'afterEach')
      )
    },
    merge: (customHandlers: Partial<Rule.RuleListener>): Rule.RuleListener => {
      Object.entries(predefinedRules).forEach((predefinedRule) => {
        const key = predefinedRule[0]
        const predefinedMethod = predefinedRule[1] as (node: Node) => void
        if (typeof customHandlers[key] === 'function') {
          predefinedRules[key] = (node: Node | Expression) => {
            const customMethod = customHandlers[key] as (node: Node) => void
            if (key.endsWith(':exit')) {
              customMethod(node)
              predefinedMethod(node) // Append predefined rules on exit.
            } else {
              predefinedMethod(node) // Prepend predefined rules on enter.
              customMethod(node)
            }
          }
        }
      })

      const mergedRules = { ...customHandlers, ...predefinedRules }
      return mergedRules
    },
    isTestFile: (): boolean => isTestFile,
    currentTestNode: (): BaseNode | BaseExpression | null => currentTestNode,
  }

  return rule
}
