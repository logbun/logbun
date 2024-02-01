import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import pkg from './package.json' assert { type: 'json' };

const sharedPlugins = [
  replace({ preventAssignment: false, exclude: 'node_modules/**', values: { __VERSION__: pkg.version } }),
  commonjs(),
];

export default [
  {
    input: 'dist/server.js',
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: true, exports: 'named' },
      { file: pkg.module, format: 'es', sourcemap: true, exports: 'named' },
    ],
    external: ['fs', 'path', 'next', '@logbun/node'],
    plugins: [...sharedPlugins, nodeResolve()],
  },
  {
    input: 'dist/client.js',
    output: [{ file: pkg.browser, format: 'es', sourcemap: true, exports: 'named' }],
    external: ['@logbun/react'],
    plugins: sharedPlugins,
  },
];
