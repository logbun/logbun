import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import pkg from './package.json' assert { type: 'json' };

export default [
  {
    input: 'src/index.ts',
    plugins: [esbuild()],
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: true },
      { file: pkg.module, format: 'es', sourcemap: true },
    ],
  },
  {
    input: 'src/index.ts',
    plugins: [dts()],
    output: [{ file: pkg.typings, format: 'es' }],
  },
];
