import { defineConfig } from 'tsup';

export default defineConfig((opts) => {
  return {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    minify: false,
    dts: true,
    sourcemap: true,
    splitting: true,
    clean: !opts.watch,
  };
});
