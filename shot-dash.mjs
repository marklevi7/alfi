import { chromium } from 'playwright';
const url = process.env.U;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, ignoreHTTPSErrors: true });
await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
await p.waitForTimeout(1200);
const gate = await p.$('text=Open the page');
if (gate) { await gate.click(); await p.waitForTimeout(3000); }
await p.click('button[type=submit]');
await p.waitForTimeout(1200);
await p.screenshot({ path: 'preview-githack.png' });
await b.close();
console.log('ok');
