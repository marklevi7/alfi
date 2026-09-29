import { chromium } from 'playwright';
import fs from 'node:fs';

const URL = process.env.U;
const OUT = process.env.OUT;
fs.mkdirSync(OUT, { recursive: true });

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 2600 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
const wait = (ms = 700) => p.waitForTimeout(ms);
const shot = async (n) => { await wait(400); await p.screenshot({ path: `${OUT}/${n}.png` }); console.log('shot', n); };

const openTest = async () => {
  await p.getByRole('button', { name: 'כל ההערכות' }).first().click();
  await wait();
  await p.locator('.MuiCard-root', { hasText: 'בוחן סיכום - אנליזה' }).first()
    .locator('.MuiCardActionArea-root').first().click();
  await wait(900);
};

await p.goto(URL, { waitUntil: 'networkidle' });
await wait(1200);
await openTest();
await shot('1-full');                 // the whole locked test, 1440×2600

// the same screen in the 1440×900 frames
await p.setViewportSize({ width: 1440, height: 900 });
await wait(700);
await shot('2-top');

await p.evaluate(() => { const m = document.querySelector('main'); m.scrollTop = m.scrollHeight; });
await wait(700);
await shot('3-scrolled-to-bottom');

await p.evaluate(() => { const m = document.querySelector('main'); m.scrollTop = 0; });
await wait(500);
await p.getByRole('button', { name: 'למה אי אפשר לערוך את השאלות' }).first().hover();
await wait(900);
await shot('4-locked-explained');

await p.mouse.move(20, 20);
await wait(500);
await p.evaluate(() => { const m = document.querySelector('main'); m.scrollTop = m.scrollHeight; });
await wait(500);
await p.getByRole('button', { name: 'מחיקת המשימה' }).click();
await wait(800);
await shot('5-delete-task-confirm');

await b.close();
console.log('done');
