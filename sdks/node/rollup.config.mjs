import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import pkg from './package.json' assert { type: 'json' };

const external = [...Object.keys(pkg.dependencies), 'http', 'https', '@aws-sdk/client-s3'];

export default [
  {
    input: 'dist/index.js',
    external,
    output: { file: pkg.main, format: 'cjs', sourcemap: true },
    plugins: [
      replace({ preventAssignment: false, exclude: 'node_modules/**', values: { __VERSION__: pkg.version } }),
      commonjs(),
      resolve(),
    ],
  },
];
