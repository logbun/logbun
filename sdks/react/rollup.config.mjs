import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import pkg from './package.json' assert { type: 'json' };

export default [
  {
    input: 'dist/index.js',
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: true, exports: 'named' },
      { file: pkg.module, format: 'es', sourcemap: true, exports: 'named' },
      {
        file: pkg.unpkg,
        format: 'iife',
        sourcemap: true,
        exports: 'named',
        name: 'LogbunReact',
        globals: { react: 'React', '@logbun/js': 'Logbun' },
      },
    ],
    external: ['react', '@logbun/js'],
    plugins: [
      replace({ preventAssignment: false, exclude: 'node_modules/**', values: { __VERSION__: pkg.version } }),
      commonjs(),
    ],
  },
];
