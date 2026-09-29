import { chromium } from 'playwright';
import fs from 'node:fs';

const URL = process.env.U || 'http://localhost:51803';
const OUT = process.env.OUT;
fs.mkdirSync(OUT, { recursive: true });

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1600 }, deviceScaleFactor: 2 });
const wait = (ms = 700) => p.waitForTimeout(ms);
const shot = async (name) => { await wait(400); await p.screenshot({ path: `${OUT}/${name}.png` }); console.log('shot', name); };

await p.goto(URL, { waitUntil: 'networkidle' });
await wait(1200);

// כל ההערכות → the scheduled task that the section is built around
await p.getByRole('button', { name: 'כל ההערכות' }).first().click();
await wait();
await p.locator('.MuiCard-root', { hasText: 'חקירת פונקציה רציונלית' }).first().locator('.MuiCardActionArea-root').first().click();
await wait(900);
await shot('1-edit');

// one question, read in full
await p.locator('.MuiCardActionArea-root').nth(1).click();
await wait(900);
await shot('2-question-preview');
await p.getByRole('button', { name: 'סגירה' }).first().click();
await wait();

// removing a question asks first
await p.getByRole('button', { name: /^הסרת שאלה/ }).first().click();
await wait(700);
await shot('3-remove-question');
await p.getByRole('button', { name: 'ביטול' }).first().click();
await wait();

// the bank
await p.getByRole('button', { name: 'הוספת שאלה' }).click();
await wait(900);
await shot('4-library-top');

// only what the class has already seen
await p.getByRole('button', { name: 'כבר בשימוש' }).click();
await wait(700);
await shot('5-library-used-before');
await p.getByRole('button', { name: 'הכל', exact: true }).click();
await wait();

// one picked
await p.locator('.MuiDialog-root input[type=checkbox]:not([disabled])').first().check();
await wait(700);
await shot('6-library-selected');
await p.locator('.MuiDialog-root input[type=checkbox]:not([disabled])').first().uncheck();
await wait();

// nothing matches
await p.getByPlaceholder('חיפוש בטקסט השאלה').fill('זזזזז');
await wait(900);
await shot('7-library-no-results');

await b.close();
console.log('done');
