import { promises as fs } from 'fs';
import path from 'path';

const SRC_DIR = path.resolve('src');
const INDEX_FILE = path.resolve('src/index.ts');
const IGNORE = ['index.ts', '.spec.ts', '.e2e-spec.ts', '.test.ts', '.d.ts'];

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(entry => {
    const res = path.resolve(dir, entry.name);
    if (entry.isDirectory()) return walk(res);
    return res.endsWith('.ts') && !IGNORE.some(s => res.endsWith(s)) ? [res] : [];
  }));
  return files.flat();
}

function toExportPath(filePath: string): string {
  const relPath = path.relative(SRC_DIR, filePath).replace(/\.ts$/, '');
  return `export * from './${relPath.replace(/\\/g, '/')}';`;
}

async function generateExports() {
  const files = await walk(SRC_DIR);
  const exportLines = files.map(toExportPath).sort();
  const banner = `// This file is auto-generated. Do not edit manually.\n\n`;
  await fs.writeFile(INDEX_FILE, banner + exportLines.join('\n') + '\n');
  console.log(`✅ index.ts updated with ${exportLines.length} exports`);
}

generateExports().catch((e) => {
  console.error('❌ Failed to generate exports:', e);
  process.exit(1);
});
