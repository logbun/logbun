import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import dts from 'rollup-plugin-dts';
import pkg from './package.json' assert { type: 'json' };

const external = [...Object.keys(pkg.dependencies), 'fs', 'path', 'next', '@logbun/react'];

const sharedPlugins = [
  replace({ preventAssignment: false, exclude: 'node_modules/**', values: { __VERSION__: pkg.version } }),
  commonjs(),
];

export default [
  {
    input: 'dist/client.js',
    output: [{ file: pkg.browser, format: 'es', sourcemap: true, exports: 'named' }],
    external: ['@logbun/react'],
    plugins: sharedPlugins,
  },
  {
    input: 'dist/server.js',
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: true, exports: 'named' },
      { file: pkg.module, format: 'es', sourcemap: true, exports: 'named' },
    ],
    external,
    plugins: [...sharedPlugins, nodeResolve()],
  },
  {
    input: 'src/types.ts',
    external,
    plugins: [dts(), nodeResolve()],
    output: [{ file: pkg.types, format: 'es' }],
  },
];
