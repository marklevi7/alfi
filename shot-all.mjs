import { chromium } from 'playwright';

const OUT = process.argv[2];
const W = 1440;

const clickText = (t) => `(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()===${JSON.stringify(t)}); if(b){b.click();return true;} return false; })()`;
const navTo = (t) => `(() => { const n=[...document.querySelectorAll('[role="button"]')].find(x=>x.textContent.trim()===${JSON.stringify(t)}); if(n){n.click();return true;} return false; })()`;

async function openBar(page) {
  const open = await page.evaluate(() => !!document.querySelector('[aria-label="סגירת בקרות"]'));
  if (!open) await page.mouse.click(6, 6);
  await page.waitForTimeout(250);
}
async function closeBar(page) {
  await page.evaluate(`(() => { const b=document.querySelector('[aria-label="סגירת בקרות"]'); if(b) b.click(); })()`);
  await page.waitForTimeout(250);
}

/** pick an option out of a MUI select, found by its field label */
async function pickSelect(page, label, option) {
  await page.evaluate((l) => {
    const fc = [...document.querySelectorAll('.MuiFormControl-root')]
      .find((f) => f.querySelector('label')?.textContent.trim() === l);
    fc.querySelector('.MuiSelect-select').click();
  }, label);
  await page.waitForTimeout(350);
  await page.evaluate((t) => {
    const li = [...document.querySelectorAll('li[role="option"]')].find((x) => x.textContent.trim() === t);
    li.click();
  }, option);
  await page.waitForTimeout(350);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
}

async function shot(page, name, { tall = true } = {}) {
  await page.mouse.move(W - 5, 5);
  await page.waitForTimeout(350);
  if (tall) {
    const h = await page.evaluate(() => Math.ceil(document.querySelector('main').scrollHeight) + 48);
    await page.setViewportSize({ width: W, height: Math.min(Math.max(h, 900), 12000) });
    await page.waitForTimeout(450);
  } else {
    await page.setViewportSize({ width: W, height: 1000 });
    await page.waitForTimeout(300);
  }
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log('shot', name);
  await page.setViewportSize({ width: W, height: 1000 });
  await page.waitForTimeout(250);
}

const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: W, height: 1000 }, deviceScaleFactor: 2 });
await page.goto('http://localhost:5174', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

/* ---------- כל ההערכות: the four states ---------- */
await page.evaluate(navTo('כל ההערכות'));
await page.waitForTimeout(600);
await shot(page, '01-all-state-all');

for (const [label, name] of [['פתוחים', '02-all-state-open'], ['מתוזמנים', '03-all-state-scheduled'], ['הסתיימו', '04-all-state-ended']]) {
  await page.evaluate(clickText(label));
  await page.waitForTimeout(500);
  await shot(page, name);
}

/* ---------- filtered by content, and over-filtered ---------- */
await page.evaluate(clickText('הכל'));
await page.waitForTimeout(400);
await pickSelect(page, 'נושא', 'אנליזה');
await shot(page, '05-all-filtered-topic');

await page.evaluate(clickText('מתוזמנים'));
await page.waitForTimeout(400);
await pickSelect(page, 'נושא', 'גאומטריה');
await shot(page, '06-all-no-results');

/* ---------- the blank class ---------- */
await page.evaluate(clickText('הכל'));
await page.waitForTimeout(300);
await pickSelect(page, 'נושא', 'כל הנושאים');
await openBar(page);
await page.evaluate(clickText('blank'));
await page.waitForTimeout(500);
await closeBar(page);
await shot(page, '07-all-blank');

await openBar(page);
await page.evaluate(clickText('mid-use'));
await page.waitForTimeout(500);
await closeBar(page);

/* ---------- a scheduled task, opened from the list ---------- */
await page.evaluate(`(() => { const c=[...document.querySelectorAll('button')].filter(x=>x.className.indexOf('MuiCardActionArea')>=0); c[0].click(); })()`);
await page.waitForTimeout(700);
await shot(page, '08-scheduled-task');

await page.evaluate(`(() => { const b=[...document.querySelectorAll('button')].find(x=>(x.getAttribute('aria-label')||'')==='הסרת שאלה 1'); b.click(); })()`);
await page.waitForTimeout(600);
await shot(page, '09-scheduled-confirm-remove', { tall: false });
await page.evaluate(clickText('ביטול'));
await page.waitForTimeout(400);

/* ---------- the question library ---------- */
await page.evaluate(clickText('הוספת שאלה'));
await page.waitForTimeout(700);
await shot(page, '10-library-top', { tall: false });

// scrolled down to where the questions that already went out begin
await page.evaluate(() => { document.querySelector('.MuiDialogContent-root').scrollTop = 1500; });
await page.waitForTimeout(500);
await shot(page, '11-library-used-before', { tall: false });

await page.evaluate(() => { document.querySelector('.MuiDialogContent-root').scrollTop = 0; });
await page.waitForTimeout(400);
await page.evaluate(`(() => { const c=[...document.querySelectorAll('.MuiDialogContent-root button')].filter(x=>x.className.indexOf('MuiCardActionArea')>=0); c[0].click(); })()`);
await page.waitForTimeout(500);
await shot(page, '12-library-selected', { tall: false });

await page.fill('input[aria-label="חיפוש בטקסט השאלה"]', 'אינטגרל');
await page.waitForTimeout(600);
await shot(page, '13-library-no-results', { tall: false });

await b.close();
console.log('done');
