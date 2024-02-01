// import commonjs from '@rollup/plugin-commonjs';
// import resolve from '@rollup/plugin-node-resolve';
// import replace from '@rollup/plugin-replace';
// import pkg from './package.json' assert { type: 'json' };

// export default [
//   {
//     input: 'dist/plugin.js',
//     output: { file: pkg.main, format: 'cjs', sourcemap: true },
//     external: ['@logbun/utils/helpers'],
//     plugins: [
//       replace({ preventAssignment: false, exclude: 'node_modules/**', values: { __VERSION__: pkg.version } }),
//       commonjs(),
//       resolve(),
//     ],
//   },
// ];

import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import pkg from './package.json' assert { type: 'json' };

const external = [...Object.keys(pkg.dependencies), 'assert', 'fs'];

export default [
  {
    input: 'src/index.ts',
    plugins: [esbuild()],
    external,
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: true },
      { file: pkg.module, format: 'es', sourcemap: true },
    ],
  },
  {
    input: 'src/index.ts',
    external,
    plugins: [dts()],
    output: [{ file: pkg.typings, format: 'es' }],
  },
];
