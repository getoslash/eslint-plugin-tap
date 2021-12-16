import type {
  BaseExpression,
  Expression,
  Identifier,
  MemberExpression,
  Node,
} from 'estree'

const isMember = (node: BaseExpression): node is MemberExpression => {
  return (node as MemberExpression)?.object?.type === 'MemberExpression'
}

export const nameOfRootObject = (node: Node | Expression): string => {
  if (isMember(node)) return nameOfRootObject(node.object)
  return ((node as unknown as MemberExpression).object as Identifier).name
}
