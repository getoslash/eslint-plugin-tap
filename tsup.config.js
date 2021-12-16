import { defineConfig } from 'tsup'

export default defineConfig({
  splitting: false,
  sourcemap: false,
  minify: true,
  clean: true,
  entryPoints: [
      'src/index.ts'
    ],
})
