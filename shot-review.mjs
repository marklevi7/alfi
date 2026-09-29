import { chromium } from 'playwright';
import fs from 'node:fs';

const URL = process.env.U, OUT = process.env.OUT;
fs.mkdirSync(OUT, { recursive: true });

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 3623 }, deviceScaleFactor: 2 });
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
// the review opens from a row of תרגולים אחרונים on the main screen
await p.locator('.MuiCard-root', { hasText: 'תרגולים אחרונים' }).locator('.MuiButtonBase-root').first().click();
await wait(1200);
await shot('1-full');

await setVariant('blank');
await p.setViewportSize({ width: 1440, height: 3454 });
await wait(700);
await shot('2-blank');

// the answers of one question, and then one student's answer in full
await setVariant('full');
await p.setViewportSize({ width: 1440, height: 1000 });
await wait(700);
await p.locator('.MuiCard-root .MuiButtonBase-root').filter({ hasText: 'תשובות' }).first().click();
await wait(1000);
await shot('3-answers-popup');

await p.locator('.MuiDialog-root').getByText('ראה עוד').first().click();
await wait(1000);
await shot('4-student-answer');

await b.close();
console.log('done');
