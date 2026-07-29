import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotDir = path.join(__dirname, 'temporary screenshots');

if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

const url    = process.argv[2] || 'http://localhost:3000';
const label  = process.argv[3] ? `-${process.argv[3]}` : '';
const width  = process.argv[4] ? parseInt(process.argv[4], 10) : 1440;
const height = process.argv[5] ? parseInt(process.argv[5], 10) : 900;
const fullPage = process.argv[6] === 'full';

// find next available N
let n = 1;
while (fs.existsSync(path.join(screenshotDir, `screenshot-${n}${label}.png`))) n++;
const outFile = path.join(screenshotDir, `screenshot-${n}${label}.png`);

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width, height, deviceScaleFactor: 1.5 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 500));

if (fullPage) {
  // scroll through the whole page so scroll-triggered (IntersectionObserver) reveals fire,
  // otherwise a full-page capture freezes below-the-fold content at opacity:0
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  const step = Math.round(height / 2);
  for (let y = 0; y < scrollHeight; y += step) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await new Promise(r => setTimeout(r, 180));
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 400));
} else {
  await new Promise(r => setTimeout(r, 700)); // let in-view animations settle
}

await page.screenshot({ path: outFile, fullPage });
await browser.close();

console.log(`Screenshot saved: ${outFile}`);
