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
const tall = async (h) => { await p.setViewportSize({ width: 1440, height: h }); await wait(700); };

const goBuild = async () => {
  await p.getByRole('button', { name: 'בניית תרגול' }).first().click();
  await wait(900);
};

await p.goto(URL, { waitUntil: 'networkidle' });
await wait(1200);
await goBuild();

/* ================= build task from questions ================= */
await p.getByRole('tab', { name: 'בחירת שאלות' }).click();
await wait(900);
await tall(2400);
await shot('a1-empty');
await tall(900);
await p.evaluate(() => { const m = document.querySelector('main'); if (m) m.scrollTop = 0; window.scrollTo(0, 0); });
await wait(600);

await p.getByRole('button', { name: 'נושא', exact: true }).click();
await wait(500);
await p.getByRole('option', { name: 'אנליזה' }).click();
await wait(700);
await p.getByRole('button', { name: 'יחידה', exact: true }).click();
await wait(500);
await p.getByRole('option').first().click();
await wait(800);
await shot('a2-filters');

await p.getByPlaceholder('חיפוש בטקסט השאלה').fill('זזזזז');
await wait(900);
await shot('a3-no-results');
await p.getByPlaceholder('חיפוש בטקסט השאלה').fill('');
await wait(700);
await p.getByRole('button', { name: /^נושא/ }).first().click();
await wait(500);
await p.getByRole('option', { name: 'כל הנושאים' }).click();
await wait(800);

const withGraph = p.locator('.MuiCard-root', { hasText: 'לפניכם גרף של פונקציה' }).first();
await withGraph.locator('.MuiCardActionArea-root').first().click();
await wait(900);
await shot('a10-question-with-graph');
await p.getByRole('button', { name: 'סגירה' }).first().click();
await wait(600);

await p.locator('.MuiCard-root .MuiCardActionArea-root').first().click();
await wait(900);
await shot('a5-add-question-dialog');
await p.getByRole('button', { name: 'סגירה' }).first().click();
await wait(600);

for (let i = 0; i < 3; i++) {
  await p.locator('input[type=checkbox]').nth(i).check();
  await wait(300);
}
await tall(2400);
await shot('a4-questions-selected');
await tall(900);

await p.getByRole('button', { name: 'המשך' }).click();
await wait(1000);
await shot('a6-assembled-task-preview');

await p.getByRole('button', { name: 'הסרת שאלה 2', exact: true }).click();
await wait(800);
await shot('a7-remove-question-confirm');
await p.getByRole('button', { name: 'ביטול' }).click();
await wait(600);

await p.getByRole('button', { name: 'שליחה לתלמידים' }).click();
await wait(900);
await shot('a8-send-confirm');
await p.getByRole('button', { name: 'ביטול' }).click();
await wait(600);

await p.getByLabel('שם התרגול').fill('');
await wait(500);
await p.getByRole('button', { name: 'שליחה לתלמידים' }).click();
await wait(800);
await shot('a9-missing-info-to-send');


// back out to the shelf for the other route
await p.getByRole('button', { name: 'הבנתי' }).click();
await wait(600);
await p.getByRole('button', { name: 'חזרה לעריכה' }).first().click();
await wait(800);
await p.getByRole('tab', { name: 'בחירה מהערכות קיימות' }).click();
await wait(900);

/* ================= select preset task ================= */
await shot('b1-split-view');

await p.locator('.MuiCard-root', { hasText: 'תרגול אסימפטוטות' }).last().click();
await wait(900);
await shot('b2-another-task-selected');

await p.getByRole('button', { name: 'למה אי אפשר לערוך את השאלות' }).first().hover();
await wait(900);
await shot('b3-locked-explained');
await p.mouse.move(700, 700);
await wait(500);

await p.getByRole('button', { name: 'נושא', exact: true }).click();
await wait(500);
await p.getByRole('option').nth(1).click();
await wait(900);
await shot('b4-filters-applied');

await p.getByPlaceholder('חיפוש בטקסט השאלה').fill('זזזזז');
await wait(900);
await shot('b5-no-results');
await p.getByPlaceholder('חיפוש בטקסט השאלה').fill('');
await wait(600);
await p.getByRole('button', { name: /^נושא/ }).first().click();
await wait(500);
await p.getByRole('option', { name: 'כל הנושאים' }).click();
await wait(800);

await p.getByRole('button', { name: 'המשך' }).first().click();
await wait(1000);
await shot('b6-ready-task-preview');

await p.getByLabel('שם התרגול').fill('תרגול חזרה · כיתה י-1');
await wait(400);
await p.getByRole('button', { name: /שעת פתיחה/ }).first().click().catch(() => {});
await wait(700);
await shot('b7-preview-details-edited');
await p.keyboard.press('Escape');
await wait(500);

await p.locator('button.MuiCard-root, .MuiCard-root button').first().click();
await wait(900);
await shot('b8-locked-question-view');
await p.keyboard.press('Escape');
await wait(600);

await p.getByRole('button', { name: 'שליחה לתלמידים' }).click();
await wait(900);
await shot('b9-send-confirm');
await p.getByRole('button', { name: 'ביטול' }).click();
await wait(600);

await p.getByRole('textbox', { name: 'תאריך', exact: true }).fill('');
await wait(500);
await p.getByRole('button', { name: 'שליחה לתלמידים' }).click();
await wait(800);
await shot('b10-missing-info-to-send');


await b.close();
console.log('done');
