import { chromium } from 'playwright';
import fs from 'node:fs';

const URL = process.env.U, OUT = process.env.OUT;
fs.mkdirSync(OUT, { recursive: true });

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 2079 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
const wait = (ms = 700) => p.waitForTimeout(ms);
const shot = async (n) => { await wait(400); await p.screenshot({ path: `${OUT}/${n}.png` }); console.log('shot', n); };
const setVariant = async (label) => {
  await p.mouse.click(8, 8);
  await wait(500);
  await p.getByRole('button', { name: label, exact: true }).first().click();
  await wait(700);
  await p.getByRole('button', { name: 'סגירת בקרות' }).click();
  await wait(600);
};

await p.goto(URL, { waitUntil: 'networkidle' });
await wait(1200);
await p.getByRole('button', { name: 'מצב התלמידים' }).first().click();
await wait(1000);
await shot('1-mid-use');

await setVariant('blank');
await p.setViewportSize({ width: 1440, height: 1048 });
await wait(700);
await shot('2-blank');

await b.close();
console.log('done');
