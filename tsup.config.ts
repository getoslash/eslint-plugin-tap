/* eslint-disable import/no-extraneous-dependencies -- This file is only used during build-time, so this is fine. */
import { defineConfig } from 'tsup'

export default defineConfig({
  splitting: false,
  sourcemap: false,
  minify: true,
  clean: true,
  esbuildOptions: (options) => {
    // eslint-disable-next-line no-param-reassign
    options.footer = {
      // This will ensure we can continue writing this plugin
      // as a modern ECMA module, while still publishing this as a CommonJS
      // library with a default export, as that's how ESLint expects plugins to look.
      // @see https://github.com/evanw/esbuild/issues/1182#issuecomment-1011414271
      js: 'module.exports = module.exports.default;',
    }
  },
  entry: ['src/index.ts'],
})
