// rollup.config.js
const pkg = require('./package.json');
const json = require('@rollup/plugin-json');
const { builtinModules } = require('module');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('rollup-plugin-typescript2');
const tsconfigPaths = require('rollup-plugin-tsconfig-paths');
const resolve = require('@rollup/plugin-node-resolve').default;

module.exports = {
  input: 'src/index.ts',
  output: {
    file: pkg.main,
    format: 'cjs',
    sourcemap: true,
  },
  external: (id) => {
    // Exclure toutes les deps et peerDeps (même si elles sont nestées ou scopées)
    const externals = [
      ...builtinModules,
      ...builtinModules.map((m) => `node:${m}`), 
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ];
  
    return externals.some(name => id === name || id.startsWith(`${name}/`));
  },
  onwarn(warning, warn) {
    // Filtrage des warnings non bloquants
    if (
      warning.code === 'CIRCULAR_DEPENDENCY' ||
      warning.code === 'UNRESOLVED_IMPORT' ||
      warning.code === 'EVAL'
    ) {
      return;
    }
    warn(warning);
  },
  plugins: [
    tsconfigPaths(),
    resolve({ 
      extensions: ['.ts', '.js', '.json'],
      preferBuiltins: false,
    }),
    commonjs({
      include: /node_modules/,
    }),
    json({
      compact: true,
      preferConst: true,
    }),
    typescript({
      tsconfig: './tsconfig.json',
      useTsconfigDeclarationDir: true
    }),
  ],
};
