#!/usr/bin/env node
/* ALFI token guard — fails the build when a hand-picked value appears in the code.
 * Every size, spacing, line height and letter spacing must come from MUI:
 * the type scale, the spacing scale, or the palette. Nothing invented.
 *
 * Run: npm run check:tokens   (runs automatically as part of npm run build)
 * A value that genuinely has no MUI equivalent gets an allow-line right above it:
 *   // token-guard: <reason>
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../src', import.meta.url));

// MUI's own type scale, in rem
const FONT_SIZES = new Set(['6rem', '3.75rem', '3rem', '2.125rem', '1.5rem', '1.25rem', '1rem', '0.875rem', '0.75rem']);
// MUI's own line heights
const LINE_HEIGHTS = new Set(['1.167', '1.2', '1.235', '1.334', '1.43', '1.5', '1.57', '1.6', '1.66', '1.75', '2.66']);
// MUI's own letter spacings
const LETTER_SPACING = new Set(['-0.01562em', '-0.00833em', '0em', '0.00735em', '0.0075em', '0.00938em', '0.00714em', '0.02857em', '0.03333em', '0.08333em']);

// old versions that are no longer reachable from the app; they are kept for reference only
const RETIRED = ['Dashboard.tsx', 'DashboardV1.tsx', 'DashboardV2.tsx', 'DashboardV4.tsx', 'DashboardV6.tsx', 'Analytics.tsx'];

const RULES = [
  {
    name: 'font size',
    re: /fontSize:\s*'([^']+)'/g,
    ok: (v) => FONT_SIZES.has(v) || !/^[\d.]+(rem|em|px)$/.test(v),
    hint: 'use a MUI type-scale size: theme.typography.<variant>.fontSize, or variant="…"',
  },
  {
    name: 'line height',
    re: /lineHeight:\s*([\d.]+)\b/g,
    ok: (v) => LINE_HEIGHTS.has(v),
    hint: 'use theme.typography.<variant>.lineHeight',
  },
  {
    name: 'letter spacing',
    re: /letterSpacing:\s*'([^']+)'/g,
    ok: (v) => LETTER_SPACING.has(v),
    hint: 'use theme.typography.<variant>.letterSpacing',
  },
  {
    name: 'spacing in px',
    re: /\b(?:m|mt|mb|ml|mr|mx|my|p|pt|pb|pl|pr|px|py|gap|rowGap|columnGap|spacing)\s*[:=]\s*['"{]?(-?\d+px)/g,
    ok: () => false,
    hint: 'use the spacing scale: 1 = 8px, 0.5 = 4px',
  },
  {
    name: 'raw hex colour',
    re: /(#[0-9a-fA-F]{3,8})\b/g,
    ok: () => false,
    hint: 'use the palette: theme.palette.*, or alpha() on a token',
  },
];

const files = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (['.ts', '.tsx'].includes(extname(p)) && !p.endsWith('.bak') && !RETIRED.some((r) => p.endsWith(r))) files.push(p);
  }
})(ROOT);

const problems = [];
for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    // an explicit, reasoned exception on the line above
    if ((lines[i - 1] || '').includes('token-guard:')) return;
    for (const rule of RULES) {
      rule.re.lastIndex = 0;
      let m;
      while ((m = rule.re.exec(line))) {
        if (rule.ok(m[1])) continue;
        problems.push({ file: file.replace(ROOT, 'src'), line: i + 1, rule, value: m[1], text: line.trim() });
      }
    }
  });
}

if (problems.length) {
  console.error(`\n✗ token guard: ${problems.length} hand-picked value${problems.length > 1 ? 's' : ''} found.\n`);
  for (const p of problems) {
    console.error(`  ${p.file}:${p.line}  ${p.rule.name} "${p.value}"`);
    console.error(`      ${p.text.slice(0, 100)}`);
    console.error(`      → ${p.rule.hint}\n`);
  }
  console.error('  A value with no MUI equivalent needs a reason on the line above:');
  console.error('      // token-guard: why this one cannot come from a token\n');
  process.exit(1);
}
console.log(`✓ token guard: ${files.length} files, every value comes from MUI.`);
