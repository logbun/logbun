import replace from '@rollup/plugin-replace';
import deepMerge from 'deepmerge';
import fs from 'fs';
import { builtinModules } from 'module';
import path from 'path';
import { dts } from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), './package.json'), { encoding: 'utf8' }));

const replacePlugin = replace({
  preventAssignment: false,
  exclude: 'node_modules/**',
  values: { __VERSION__: pkg.version },
});

export const init = (options = {}, config = [], initialConfig = {}) => {
  const { input = ['src/index.ts'], ...restOptions } = initialConfig;

  const output = [
    { file: pkg.main, format: 'cjs', sourcemap: true },
    { file: pkg.module, format: 'es', sourcemap: true },
  ];

  if (pkg.browser) {
    output.push({ file: pkg.browser, format: 'es', sourcemap: true, exports: 'named' });
  }

  const defaultConfig = {
    input,
    output,
    plugins: [replacePlugin, esbuild()],
    external: [...builtinModules, ...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
  };

  const root = [deepMerge(defaultConfig, restOptions)];

  if (options.declaration) {
    root.push({
      input: 'src/index.ts',
      plugins: [dts()],
      output: [{ file: pkg.types, format: 'es' }],
    });
  }

  return [...root, ...config];
};
