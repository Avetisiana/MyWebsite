// Génère les assets binaires du site : images responsives (case study), image OG, favicons.
// Ne touche jamais aux fichiers HTML — build.mjs s'en charge séparément.
// Lancer avec `node scripts/gen-assets.mjs` (ou `npm run assets`) avant `node build.mjs`.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import toIco from 'to-ico';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// ---------- 1. Images responsives — étude de cas Cabinet Laperonnie ----------

async function genResponsiveImages() {
  const srcPath = path.join(root, 'images/cabinet-laperonnie-1200.jpg');
  if (!fs.existsSync(srcPath)) {
    console.log('⚠ images/cabinet-laperonnie-1200.jpg introuvable, étape ignorée');
    return;
  }
  const srcBuffer = fs.readFileSync(srcPath); // lu en mémoire pour ne jamais écrire sur le fichier source
  const widths = [600, 900, 1200];
  for (const w of widths) {
    const base = sharp(srcBuffer).resize({ width: w });
    await base.clone().avif({ quality: 55 }).toFile(path.join(root, `images/cabinet-laperonnie-${w}.avif`));
    const jpegBuffer = await base.clone().jpeg({ quality: 82, mozjpeg: true }).toBuffer();
    fs.writeFileSync(path.join(root, `images/cabinet-laperonnie-${w}.jpg`), jpegBuffer);
    console.log(`✓ images/cabinet-laperonnie-${w}.avif + .jpg`);
  }
}

// ---------- 2. Image OG (1200x630) ----------

async function genOgImage() {
  const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face { font-family: 'Playfair Display'; font-style: normal; font-weight: 700 800; src: url('file://${path.join(root, 'fonts/playfair-display-700-800-normal-latin.woff2').replace(/\\/g, '/')}') format('woff2'); }
  @font-face { font-family: 'Montserrat'; font-style: normal; font-weight: 400 700; src: url('file://${path.join(root, 'fonts/montserrat-400-700-normal-latin.woff2').replace(/\\/g, '/')}') format('woff2'); }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px;
    background: #12241E;
    background-image: radial-gradient(circle at 15% 15%, rgba(250,246,239,0.06), transparent 55%), radial-gradient(circle at 85% 90%, rgba(30,59,50,0.5), transparent 60%);
    display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
    font-family: 'Montserrat', sans-serif;
  }
  .eyebrow { color: #DCE7DF; font-size: 20px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 28px; }
  h1 { font-family: 'Playfair Display', serif; font-weight: 800; font-size: 76px; color: #FAF6EF; letter-spacing: -0.02em; }
  p { margin-top: 22px; font-size: 26px; color: rgba(250,246,239,0.75); }
</style></head>
<body>
  <div class="eyebrow">Création de sites internet</div>
  <h1>Arthur Avetisian</h1>
  <p>Angoulême &amp; Charente</p>
</body></html>`;

  const tmpFile = path.join(root, '_tmp-og.html');
  fs.writeFileSync(tmpFile, html);

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.goto(`file://${tmpFile}`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: path.join(root, 'og/og-default.png') });
  await browser.close();
  fs.unlinkSync(tmpFile);
  console.log('✓ og/og-default.png');
}

// ---------- 3. Favicons depuis favicon.svg ----------

async function genFavicons() {
  const svgPath = path.join(root, 'favicon.svg');
  if (!fs.existsSync(svgPath)) {
    console.log('⚠ favicon.svg introuvable, étape ignorée');
    return;
  }
  const svg = fs.readFileSync(svgPath, 'utf-8');

  // favicon-32.png, icon-192.png, icon-512.png : le monogramme sur fond circulaire existant
  for (const size of [32, 192, 512]) {
    await sharp(Buffer.from(svg)).resize(size, size).png().toFile(path.join(root, size === 32 ? 'favicon-32.png' : `icon-${size}.png`));
    console.log(`✓ ${size === 32 ? 'favicon-32.png' : `icon-${size}.png`}`);
  }

  // apple-touch-icon.png (180x180) : fond plein carré (pas de transparence, iOS arrondit lui-même)
  const squareSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
    <rect width="180" height="180" fill="#1E3B32"/>
    <text x="90" y="115" text-anchor="middle" font-family="Georgia, 'Playfair Display', serif" font-size="72" font-weight="700" fill="#FAF6EF">AA</text>
  </svg>`;
  await sharp(Buffer.from(squareSvg)).resize(180, 180).png().toFile(path.join(root, 'apple-touch-icon.png'));
  console.log('✓ apple-touch-icon.png');

  // favicon.ico depuis le PNG 32px
  const png32 = await sharp(Buffer.from(svg)).resize(32, 32).png().toBuffer();
  const ico = await toIco([png32]);
  fs.writeFileSync(path.join(root, 'favicon.ico'), ico);
  console.log('✓ favicon.ico');
}

// ---------- run ----------

await genResponsiveImages();
await genOgImage();
await genFavicons();
console.log('\nAssets générés.');
