// rollup.config.js
const tsconfigPaths = require('rollup-plugin-tsconfig-paths');
const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('rollup-plugin-typescript2');
const pkg = require('./package.json');

module.exports = {
  input: 'src/index.ts',
  output: {
    file: pkg.main,
    format: 'cjs',
    sourcemap: true,
  },
  external: [
    ...Object.keys(pkg.peerDependencies || {}),
    ...Object.keys(pkg.dependencies || {}),
  ],
  plugins: [
    tsconfigPaths(),
    resolve({ extensions: ['.ts', '.js', '.json'] }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      tsconfigOverride: {
        compilerOptions: {
          moduleResolution: 'node',
        },
      },
    }),
  ],
};
