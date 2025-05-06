// scripts/check-externals.js
// 🔍 Script to detect NestJS dependencies not marked as external

const fs = require('fs');
const path = require('path');

const distFile = path.resolve(__dirname, '../dist/index.js');
const bundle = fs.readFileSync(distFile, 'utf-8');

const dynamicRequireRegex = /require\(["'](@nestjs\/[^"']+)["']\)/g;

const usedNestDeps = new Set();
let match;
while ((match = dynamicRequireRegex.exec(bundle))) {
  usedNestDeps.add(match[1]);
}

const pkg = require('../package.json');
const declared = new Set([
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]);

const missing = [...usedNestDeps].filter(dep => !declared.has(dep.split('/')[0]));

if (missing.length > 0) {
  console.error('\n❌ Missing peerDependencies in package.json:');
  for (const dep of missing) {
    console.error(` - ${dep}`);
  }
  process.exit(1);
} else {
  console.log('✅ All NestJS modules are correctly declared as peerDependencies.');
}
