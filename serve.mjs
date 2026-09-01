// Serveur de dev local — reflète autant que possible le comportement de production sur Vercel :
// cleanUrls (URLs sans .html), 404.html avec un vrai statut 404, en-têtes de sécurité + CSP et
// Cache-Control lus directement dans vercel.json (généré par build.mjs — même source qu'en prod),
// et une liste blanche d'extensions (les fichiers source ne sont jamais servis, comme sur Vercel
// une fois .vercelignore appliqué).

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.argv[2] ? parseInt(process.argv[2], 10) : 3000;

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};
const ALLOWED_EXT = new Set(Object.keys(MIME));
const ASSET_CACHE_EXT = new Set(['.css', '.js', '.mjs', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.avif', '.woff2', '.woff', '.ico']);
const SHORT_CACHE_FILES = new Set(['/robots.txt', '/sitemap.xml', '/manifest.webmanifest']);

// ---------- en-têtes lus depuis vercel.json (source unique, comme en prod) ----------
// Relu à CHAQUE requête (fichier local, coût négligible) : un `node build.mjs` pendant que le
// serveur tourne (styles/main.css modifié → hash CSP différent) prend effet immédiatement, sans
// jamais avoir à relancer `node serve.mjs` — un décalage entre le HTML servi et la CSP du process
// ferait bloquer le <style> inline par le navigateur (page qui s'affiche sans mise en forme).

function readVercelConfig() {
  let globalHeaders = [];
  let longCacheValue = null;
  let shortCacheValue = null;
  try {
    const vercelConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'vercel.json'), 'utf-8'));
    for (const entry of vercelConfig.headers || []) {
      if (entry.source === '/(.*)') globalHeaders = entry.headers;
      else if (entry.source.includes('woff2') || entry.source.startsWith('/fonts/')) {
        longCacheValue = entry.headers.find(h => h.key === 'Cache-Control')?.value || longCacheValue;
      } else if (entry.source.includes('robots.txt')) {
        shortCacheValue = entry.headers.find(h => h.key === 'Cache-Control')?.value;
      }
    }
  } catch {
    console.warn('⚠ vercel.json introuvable ou invalide — lancez `node build.mjs` d\'abord. En-têtes de sécurité non appliqués.');
  }
  return { globalHeaders, longCacheValue, shortCacheValue };
}

function applyHeaders(res, urlPath, ext) {
  const { globalHeaders, longCacheValue, shortCacheValue } = readVercelConfig();
  for (const h of globalHeaders) res.setHeader(h.key, h.value);
  // Dev uniquement : les .js (silk-bg.js) changent souvent en cours d'itération —
  // pas de cache immuable en local, sinon il faut vider le cache à chaque test (surtout sur mobile).
  if (ext === '.js') res.setHeader('Cache-Control', 'no-cache');
  else if (longCacheValue && ASSET_CACHE_EXT.has(ext)) res.setHeader('Cache-Control', longCacheValue);
  else if (longCacheValue && urlPath.startsWith('/fonts/')) res.setHeader('Cache-Control', longCacheValue);
  else if (shortCacheValue && SHORT_CACHE_FILES.has(urlPath)) res.setHeader('Cache-Control', shortCacheValue);
}

function send(res, status, urlPath, ext, data) {
  applyHeaders(res, urlPath, ext);
  res.writeHead(status, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  res.end(data);
}

function send404(res, urlPath) {
  const filePath = path.join(__dirname, '404.html');
  fs.readFile(filePath, (err, data) => {
    if (err) {
      applyHeaders(res, urlPath, '.html');
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    send(res, 404, urlPath, '.html', data);
  });
}

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);

  // cleanUrls : /index.html -> / ; /page.html -> /page (redirection permanente, comme Vercel)
  if (urlPath === '/index.html') {
    res.writeHead(308, { Location: '/' });
    return res.end();
  }
  if (urlPath.endsWith('.html') && urlPath !== '/') {
    res.writeHead(308, { Location: urlPath.slice(0, -'.html'.length) });
    return res.end();
  }

  if (urlPath === '/') urlPath = '/index.html';

  const ext = path.extname(urlPath).toLowerCase();

  // liste blanche stricte : toute extension hors de MIME est refusée (le code source n'est jamais servi)
  if (ext && !ALLOWED_EXT.has(ext)) return send404(res, urlPath);

  // pas d'extension (hors /) -> URL propre -> on tente le .html correspondant
  const candidatePath = ext ? urlPath : `${urlPath}.html`;
  const candidateExt = ext || '.html';
  const filePath = path.join(__dirname, candidatePath);

  fs.readFile(filePath, (err, data) => {
    if (err) return send404(res, urlPath);
    send(res, 200, urlPath, candidateExt, data);
  });
}).listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
