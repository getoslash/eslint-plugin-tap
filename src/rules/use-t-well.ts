import { nameOfRootObject } from '../utils'
import { createTapRule } from '../create-tap-rule'
import {
  tapAssertMethods,
  tapDeprecatedAssertMethods,
  tapTestHelperMethods,
} from '../tap-methods'
import type {
  BaseExpression,
  CallExpression,
  Identifier,
  MemberExpression,
  PrivateIdentifier,
  SimpleCallExpression,
} from 'estree'
import type { Rule } from 'eslint'

const methods = [...tapTestHelperMethods, ...Object.keys(tapAssertMethods)]

const isTapMethod = (name: string): boolean => {
  return methods.includes(name)
}

const isDeprecated = (name: string): boolean => {
  return Object.keys(tapDeprecatedAssertMethods).includes(name)
}

const isCall = (node: BaseExpression): node is CallExpression => {
  return (
    (node.type === 'CallExpression' || node.type === 'MemberExpression') &&
    (
      (node as SimpleCallExpression & Rule.NodeParentExtension)
        .parent as CallExpression
    ).callee === node
  )
}

const isMember = (node: BaseExpression): node is MemberExpression => {
  return node.type === 'MemberExpression'
}

const getMembers = (node: MemberExpression): Array<string> => {
  const { name } = node.property as PrivateIdentifier

  if (node.object.type === 'MemberExpression') {
    return getMembers(node.object).concat(name)
  }

  return [name]
}

const getMemberStats = (members: Array<string>) => {
  const initial = {
    skip: [],
    method: [],
    deprecated: [],
    other: [],
  } as {
    skip: Array<string>
    method: Array<string>
    deprecated: Array<keyof typeof tapDeprecatedAssertMethods>
    other: Array<string>
  }

  return members.reduce((res, member) => {
    if (member === 'skip') {
      res.skip.push(member)
    } else if (isTapMethod(member)) {
      res.method.push(member)
    } else if (isDeprecated(member)) {
      res.deprecated.push(member as keyof typeof tapDeprecatedAssertMethods)
    } else {
      res.other.push(member)
    }

    return res
  }, initial)
}

export const useTWellTapRule = (
  context: Rule.RuleContext
): Rule.RuleListener => {
  const tap = createTapRule()

  return tap.merge({
    CallExpression(node: CallExpression & Rule.NodeParentExtension) {
      if (
        tap.isTestFile() &&
        tap.currentTestNode() &&
        node.callee.type !== 'MemberExpression' &&
        (node.callee as Identifier).name === 't'
      ) {
        context.report({
          node,
          message: '`t` is not a function.',
        })
      }
    },
    MemberExpression(node: MemberExpression & Rule.NodeParentExtension) {
      if (
        !tap.isTestFile() ||
        !tap.currentTestNode() ||
        node.parent.type === 'MemberExpression' ||
        nameOfRootObject(node) !== 't'
      ) {
        return
      }

      const members = getMembers(node)
      const stats = getMemberStats(members)

      if (isCall(node)) {
        if (stats.deprecated.length > 0) {
          const deprecated = stats.deprecated[0]
          const suggestion = tapDeprecatedAssertMethods[deprecated].replacement
          context.report({
            node,
            message: `\`t.${deprecated}()\` is deprecated, use \`${suggestion}()\` instead.`,
            fix: (fixer) => {
              if (isMember(node)) {
                if (
                  ((node as MemberExpression).property as PrivateIdentifier)
                    .name === deprecated
                ) {
                  return fixer.replaceText(
                    (node as MemberExpression).property,
                    suggestion
                  )
                }
              }
              return null
            },
          })
        } else if (stats.other.length > 0) {
          context.report({
            node,
            message: `Unknown assertion method \`${stats.other[0]}\`.`,
          })
        } else if (stats.method.length === 0) {
          context.report({
            node,
            message: 'Missing assertion method.',
          })
        }
      } else if (stats.other.length > 0) {
        context.report({
          node,
          message: `Unknown tap method \`${stats.other[0]}\`.`,
        })
      }
    },
  })
}

export default useTWellTapRule
