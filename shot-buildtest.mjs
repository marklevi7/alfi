import { chromium } from 'playwright';
import fs from 'node:fs';

const URL = process.env.U;
const OUT = process.env.OUT;
fs.mkdirSync(OUT, { recursive: true });

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
const wait = (ms = 700) => p.waitForTimeout(ms);
const shot = async (n) => { await wait(400); await p.screenshot({ path: `${OUT}/${n}.png` }); console.log('shot', n); };
const tall = async (h) => { await p.setViewportSize({ width: 1440, height: h }); await wait(600); };

const goBuild = async () => {
  await p.getByRole('button', { name: 'בניית מבחן' }).first().click();
  await wait(900);
};
// the dev bar lives behind an invisible hotspot at the page's inline end (left, in RTL)
const setVariant = async (label) => {
  await p.mouse.click(8, 8);
  await wait(500);
  await p.getByRole('button', { name: label, exact: true }).first().click();
  await wait(700);
  await p.getByRole('button', { name: 'סגירה' }).first().click();
  await wait(600);
};

await p.goto(URL, { waitUntil: 'networkidle' });
await wait(1200);
await goBuild();

/* ---------- split view (the default) ---------- */
await shot('13-split-view');

/* ---------- select preset test ---------- */
// the whole test, read on its own screen
await p.getByRole('button', { name: 'המשך' }).first().click();
await wait(1000);
await shot('11-ready-test-preview');
// one question of it, locked
await p.locator('button.MuiCard-root, .MuiCard-root button').first().click();
await wait(900);
await shot('12-locked-question-view');
await p.keyboard.press('Escape');
await wait(700);
console.log('buttons here:', (await p.getByRole('button').allInnerTexts()).map(t => t.trim()).filter(Boolean).slice(0, 25).join(' | '));
await p.getByRole('button', { name: 'חזרה לעריכה' }).first().click();
await wait(800);

// the plain shelf, without the split
await setVariant('ready tests');
await tall(2400);
await shot('10-ready-tests');
await tall(900);

/* ---------- build test from questions ---------- */
await p.getByRole('tab', { name: 'בחירת שאלות' }).click();
await wait(900);
await tall(2400);
await shot('1-empty');
await tall(900);

// the filter box, narrowed down the cascade
await p.getByLabel('נושא').click();
await wait(500);
await p.getByRole('option', { name: 'אנליזה' }).click();
await wait(700);
await p.getByLabel('יחידה').click();
await wait(500);
await p.getByRole('option').first().click();
await wait(700);
await shot('2-filters');

// nothing matches
await p.getByPlaceholder('חיפוש בטקסט השאלה').fill('זזזזז');
await wait(900);
await shot('3-no-results');
await p.getByPlaceholder('חיפוש בטקסט השאלה').fill('');
await p.mouse.click(8, 8); await wait(400);
await p.getByRole('button', { name: 'pick questions', exact: true }).first().click();
await wait(600);
await p.getByRole('button', { name: 'סגירה' }).first().click();
await wait(700);

// one question read in full, with the way to take it
const withGraph = p.locator('.MuiCard-root', { hasText: 'לפניכם גרף של פונקציה' }).first();
await withGraph.locator('.MuiCardActionArea-root').first().click();
await wait(900);
await shot('14-question-with-graph');
await p.getByRole('button', { name: 'סגירה' }).first().click();
await wait(600);

await p.locator('.MuiCard-root .MuiCardActionArea-root').first().click();
await wait(900);
await shot('5-add-question-dialog');
await p.getByRole('button', { name: 'סגירה' }).first().click();
await wait(600);

// three questions ticked
for (let i = 0; i < 3; i++) {
  await p.locator('input[type=checkbox]').nth(i).check();
  await wait(300);
}
await tall(2400);
await shot('4-questions-selected');
await tall(900);

// the assembled test, read end to end
await p.getByRole('button', { name: 'המשך' }).click();
await wait(1000);
await shot('6-assembled-test-preview');

// dropping a question from inside it
await p.getByRole('button', { name: 'הסרת שאלה 2' }).click();
await wait(800);
await shot('7-remove-question-confirm');
await p.getByRole('button', { name: 'ביטול' }).click();
await wait(600);

// what is missing before it can go out
await p.getByRole('button', { name: 'שליחה לתלמידים' }).click();
await wait(800);
await shot('9-missing-info-to-send');
await p.getByRole('button', { name: 'הבנתי' }).click();
await wait(600);

// named, so it can go
await p.getByLabel('שם המבחן').fill('מבחן באנליזה - נגזרות');
await wait(500);
await p.getByRole('button', { name: 'שליחה לתלמידים' }).click();
await wait(900);
await shot('8-send-confirm');

await b.close();
console.log('done');
