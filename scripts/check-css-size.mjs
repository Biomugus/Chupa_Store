#!/usr/bin/env node

/**
 * CSS bundle size reporter.
 * Scans the Next.js build output (.next/static/css) and reports CSS file sizes.
 * Run after `next build` to track CSS output size.
 *
 * Usage:
 *   node scripts/check-css-size.mjs
 *   node scripts/check-css-size.mjs --max-total-kb 80
 */

import { readdirSync, statSync } from 'fs';
import { basename, join } from 'path';

const CSS_DIR = join(process.cwd(), '.next', 'static', 'css');
const args = process.argv.slice(2);
const maxIdx = args.indexOf('--max-total-kb');
const maxTotalKb = maxIdx !== -1 ? Number(args[maxIdx + 1]) : null;

let totalBytes = 0;
let files;

try {
  files = readdirSync(CSS_DIR).filter((f) => f.endsWith('.css'));
} catch {
  console.error('⚠  No CSS output found. Run `npm run build` first.');
  process.exit(1);
}

console.log('\n📦 CSS Bundle Size Report');
console.log('─'.repeat(50));

for (const file of files) {
  const size = statSync(join(CSS_DIR, file)).size;
  totalBytes += size;
  const kb = (size / 1024).toFixed(2);
  console.log(`  ${basename(file).padEnd(32)} ${kb.padStart(8)} KB`);
}

console.log('─'.repeat(50));
const totalKb = totalBytes / 1024;
console.log(`  ${'TOTAL'.padEnd(32)} ${totalKb.toFixed(2).padStart(8)} KB\n`);

if (maxTotalKb !== null && totalKb > maxTotalKb) {
  console.error(`❌ CSS total (${totalKb.toFixed(2)} KB) exceeds limit (${maxTotalKb} KB)`);
  process.exit(1);
} else if (maxTotalKb !== null) {
  console.log(`✅ CSS total is within the ${maxTotalKb} KB budget.\n`);
}
