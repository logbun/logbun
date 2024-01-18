import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
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
  {
    input: 'src/cli.ts',
    external,
    plugins: [esbuild(), nodeResolve(), json()],
    output: {
      file: pkg.bin,
      format: 'cjs',
      banner: '#!/usr/bin/env node\n',
    },
  },
];
