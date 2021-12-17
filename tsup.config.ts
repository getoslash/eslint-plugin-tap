/* eslint-disable import/no-extraneous-dependencies -- This file is only used during build-time, so this is fine. */
import { defineConfig } from 'tsup'

export default defineConfig({
  splitting: false,
  sourcemap: false,
  minify: true,
  clean: true,
  entryPoints: ['src/index.ts'],
})
