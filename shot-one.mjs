import { chromium } from 'playwright';
const URL = process.env.U, OUT = process.env.OUT;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const wait = (ms = 700) => p.waitForTimeout(ms);
await p.goto(URL, { waitUntil: 'networkidle' });
await wait(1200);
await p.getByRole('button', { name: 'בניית תרגול' }).first().click();
await wait(1000);
// the shelf is the first column; open a different test in the reading pane
await p.locator('.MuiCard-root', { hasText: 'תרגול אסימפטוטות' }).last().click();
await wait(1200);
await p.screenshot({ path: `${OUT}/b2-another-task-selected.png` });
await b.close();
console.log('done');
