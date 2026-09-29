import { chromium } from 'playwright';
import fs from 'node:fs';

const URL = process.env.U, OUT = process.env.OUT;
fs.mkdirSync(OUT, { recursive: true });

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 2400 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
const wait = (ms = 700) => p.waitForTimeout(ms);
const shot = async (n) => { await wait(400); await p.screenshot({ path: `${OUT}/${n}.png` }); console.log('shot', n); };
const size = async (h) => { await p.setViewportSize({ width: 1440, height: h }); await wait(700); };
const setVariant = async (label) => {
  await p.mouse.click(8, 8);
  await wait(500);
  await p.getByRole('button', { name: label, exact: true }).first().click();
  await wait(700);
  await p.getByRole('button', { name: 'סגירת בקרות' }).click();
  await wait(600);
};
const go = async () => { await p.getByRole('button', { name: 'כל ההערכות' }).first().click(); await wait(900); };

await p.goto(URL, { waitUntil: 'networkidle' });
await wait(1200);
await go();

/* ---------- main screen ---------- */
await shot('m1-default');

await size(900);
await shot('m2-above-the-fold');

await p.evaluate(() => { const m = document.querySelector('main'); if (m) m.scrollTop = m.scrollHeight; });
await wait(700);
await shot('m3-scrolled-to-bottom');

// deleting a queued task asks first
await p.evaluate(() => { const m = document.querySelector('main'); if (m) m.scrollTop = 0; });
await wait(500);
await p.getByRole('button', { name: /^מחיקה:/ }).first().click();
await wait(800);
await shot('m4-delete-confirm');
await p.getByRole('button', { name: 'ביטול' }).click();
await wait(600);

/* ---------- filtering ---------- */
await size(2400);
await p.getByRole('button', { name: 'פתוחים', exact: true }).click();
await wait(800);
await shot('f1-filter-open');

await p.getByRole('button', { name: 'מתוזמנים', exact: true }).click();
await wait(800);
await shot('f2-filter-scheduled');

await p.getByRole('button', { name: 'הסתיימו', exact: true }).click();
await wait(800);
await shot('f3-filter-ended');

// the cascade: a נושא, then a יחידה under it
await p.getByRole('button', { name: 'הכל', exact: true }).click();
await wait(700);
await p.getByRole('button', { name: 'נושא', exact: true }).click();
await wait(500);
await p.getByRole('option', { name: 'אנליזה' }).click();
await wait(700);
await p.getByRole('button', { name: 'יחידה', exact: true }).click();
await wait(500);
// the first option is "כל היחידות" — take a real one, so תת נושא opens
await p.getByRole('option').nth(1).click();
await wait(800);
await shot('f4-filter-topic-and-unit');

// and the תתי נושא under that, picked from the open list
await p.getByRole('button', { name: /תת נושא/ }).first().click();
await wait(800);
await shot('f5-filter-subtopics');
await p.keyboard.press('Escape');
await wait(600);

// a combination nothing answers
await p.getByRole('button', { name: 'הסתיימו', exact: true }).click();
await wait(900);
await shot('f6-no-results');

// a class with nothing in it yet
await setVariant('blank');
await size(900);
await shot('f7-empty');

await b.close();
console.log('done');
