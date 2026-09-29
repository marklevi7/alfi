import { chromium } from 'playwright';
const url = process.env.U;
const clicks = Number(process.env.CLICKS || 0);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true });
await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
await p.waitForTimeout(1200);
const btn = await p.$('text=Open the page');
if (btn) { await btn.click(); await p.waitForTimeout(3000); }
for (let i = 0; i < clicks; i++) {
  await p.click('[aria-label="פריסה הבאה"]');
  await p.waitForTimeout(250);
}
await p.waitForTimeout(600);
await p.screenshot({ path: 'preview-githack.png' });
await b.close();
console.log('ok clicks=' + clicks);
