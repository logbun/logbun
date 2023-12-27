import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';

import pkg from './package.json' assert { type: 'json' };

const sharedPlugins = [
  replace({
    preventAssignment: false,
    exclude: 'node_modules/**',
    values: { __VERSION__: pkg.version },
  }),
  commonjs(),
  resolve(),
];

export default [
  {
    input: 'dist/index.js',
    output: { name: 'Logbun', file: pkg.browser, format: 'umd', sourcemap: true },
    plugins: sharedPlugins,
  },
  {
    input: 'dist/index.js',
    output: { name: 'Logbun', file: pkg.browser.replace('.js', '.min.js'), format: 'umd', sourcemap: true },
    plugins: [...sharedPlugins, terser()],
  },
];
