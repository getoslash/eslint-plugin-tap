declare module 'espurify' {
  /**
   * Clone ESTree AST Node without extra properties.
   *
   * Leaves out properties defined in The [ESTree Spec](https://github.com/estree/estree)
   * (formerly known as [Mozilla SpiderMonkey Parser API](https://speakerdeck.com/michaelficarra/spidermonkey-parser-api-a-standard-for-structured-js-representations)) only.
   * Also note that extra information (such as loc, range and raw) is eliminated too.
   * @param node ESTree AST Node.
   * @returns Purified ESTree AST Node.
   */
  function espurify(node: import('estree').Node): import('estree').Node

  /**
   * Clone ESTree AST Node without extra properties.
   *
   * Leaves out properties defined in The [ESTree Spec](https://github.com/estree/estree)
   * (formerly known as [Mozilla SpiderMonkey Parser API](https://speakerdeck.com/michaelficarra/spidermonkey-parser-api-a-standard-for-structured-js-representations)) only.
   * Also note that extra information (such as loc, range and raw) is eliminated too.
   * @param node ESTree AST Node.
   * @returns Purified ESTree AST Node.
   */
  espurify.purifyAst = espurify

  /**
   * Returns customized function for cloning ESTree AST, configured by custom `options`.
   *
   * `options` is the list of properties to be left in result AST.
   * For example, functions returned by `espurify.customize({extra: ['raw']})`
   * will preserve the `raw` properties of Literal. Functions return by
   * `espurify.customize({extra: ['loc', 'range']})` will preserve
   * `loc` and `range` properties of each `Node`.
   * @param options (Optional) Extra options.
   * @returns Instance of `espurify`.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  espurify.customize = (options: { extra: Array<string> }) => espurify

  /**
   * Returns customized function for cloning ESTRee AST, with user-provided allow list.
   *
   * `whiteList` is an object containing NodeType as keys and properties as values.
   *
   * @param whitelist Configuration of properties allowed for each `NodeType`.
   * @returns Instance of `espurify`
   */
  espurify.cloneWithAllowlist = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    whitelist: Record<import('estree').Expression['type'], Array<string>>
  ) => espurify

  /**
   * @deprecated since version 3.0.0. Use `espurify.cloneWithAllowlist` instead.
   */
  espurify.cloneWithWhitelist = espurify.cloneWithAllowlist

  export default espurify
}
