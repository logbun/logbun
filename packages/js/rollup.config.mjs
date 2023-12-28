import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';
import pkg from './package.json' assert { type: 'json' };

const sharedPlugins = [
  replace({ preventAssignment: false, exclude: 'node_modules/**', values: { __VERSION__: pkg.version } }),
  commonjs(),
  resolve(),
];

const mainFile = pkg.browser;
const miniFile = pkg.browser.replace('.js', '.min.js');

export default [
  {
    input: 'dist/index.js',
    output: { name: 'Logbun', file: mainFile, format: 'umd', sourcemap: true },
    plugins: sharedPlugins,
  },
  {
    input: 'dist/index.js',
    output: { file: pkg.module, format: 'es', sourcemap: true, exports: 'named' },
    plugins: sharedPlugins,
  },
  {
    input: 'dist/index.js',
    output: { name: 'Logbun', file: miniFile, format: 'umd', sourcemap: true },
    plugins: [...sharedPlugins, terser(), copy({ targets: [{ src: miniFile, dest: '../../examples/browser' }] })],
  },
];
