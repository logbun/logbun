import { defineConfig } from 'tsup';

export default defineConfig({
  entryPoints: ['src/index.ts'],
  format: ['esm', 'cjs'],
  minify: true,
  dts: true,
  sourcemap: true,
  splitting: true,
  clean: true,
});
