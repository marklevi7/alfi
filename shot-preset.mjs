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

const goBuild = async () => {
  await p.getByRole('button', { name: 'בניית מבחן' }).first().click();
  await wait(900);
};

await p.goto(URL, { waitUntil: 'networkidle' });
await wait(1200);
await goBuild();

// the shelf as the teacher meets it, and the same shelf with room for more rows
await shot('a-split-view');
await p.setViewportSize({ width: 1440, height: 2400 });
await wait(800);
await shot('b-shelf-tall');
await p.setViewportSize({ width: 1440, height: 900 });
await wait(700);

// reading another test from the shelf
await p.locator('.MuiCard-root', { hasText: 'גאומטריה בדיקה' }).first().click();
await wait(900);
await shot('c-another-test-selected');

// why its questions cannot be touched
await p.getByRole('button', { name: 'למה אי אפשר לערוך את השאלות' }).first().hover();
await wait(900);
await shot('d-locked-explained');
await p.mouse.move(700, 700);
await wait(500);

// the filters, narrowing the shelf
await p.getByRole('button', { name: 'נושא', exact: true }).click();
await wait(500);
await p.getByRole('option', { name: 'אנליזה' }).click();
await wait(900);
await shot('e-filters-applied');

// and when nothing matches
await p.getByPlaceholder('חיפוש בטקסט השאלה').fill('זזזזז');
await wait(900);
await shot('f-no-results');
await p.getByPlaceholder('חיפוש בטקסט השאלה').fill('');
await wait(700);
await p.getByRole('button', { name: /^נושא/ }).first().click();
await wait(500);
await p.getByRole('option', { name: 'כל הנושאים' }).click();
await wait(800);

// the whole test, read on its own screen
await p.getByRole('button', { name: 'המשך' }).first().click();
await wait(1000);
await shot('g-ready-test-preview');

// what this step lets the teacher change: the name, the day and the hours
await p.getByLabel('שם המבחן').fill('מבחן בגאומטריה · כיתה י-1');
await wait(400);
await p.getByRole('button', { name: /שעת פתיחה|^שעת/ }).first().click().catch(() => {});
await wait(700);
await shot('h-preview-details-edited');
await p.keyboard.press('Escape');
await wait(500);

// one question of it, locked and read in full
await p.locator('button.MuiCard-root, .MuiCard-root button').first().click();
await wait(900);
await shot('i-locked-question-view');
await p.keyboard.press('Escape');
await wait(600);

// sending it
await p.getByRole('button', { name: 'שליחה לתלמידים' }).click();
await wait(900);
await shot('j-send-confirm');
await p.getByRole('button', { name: 'ביטול' }).click();
await wait(600);

// and what it says when something it needs is missing
await p.getByLabel('שם המבחן').fill('');
await wait(500);
await p.getByRole('button', { name: 'שליחה לתלמידים' }).click();
await wait(800);
await shot('k-missing-info-to-send');

await b.close();
console.log('done');
