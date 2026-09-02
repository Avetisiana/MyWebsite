// Build statique — génère les pages HTML (+ vercel.json) à partir de
// content/site-content.mjs + styles/main.css.
// Aucune dépendance : Node pur. Lancer avec `node build.mjs` (après `node scripts/gen-assets.mjs`
// si les images/favicons n'existent pas encore).

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { content } from './content/site-content.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const css = fs.readFileSync(path.join(__dirname, 'styles/main.css'), 'utf-8');

// Cache-busting de silk-bg.js : servi en `immutable` 1 an sur Vercel. Sans ça, un visiteur
// qui a déjà chargé le fichier garde l'ancienne version jusqu'à un an. Le hash du contenu
// dans l'URL (`?v=...`) ne change QUE si le fichier change → re-téléchargement au bon moment,
// cache long conservé le reste du temps. `serve.mjs` et Vercel ignorent la query string.
const SILK_JS_V = crypto.createHash('sha256')
  .update(fs.readFileSync(path.join(__dirname, 'silk-bg.js')))
  .digest('hex').slice(0, 10);

// ---------- URL de base : domaine réel si renseigné, sinon preview Vercel ----------

const SITE_URL = content.meta.domain.includes('DOMAINE-A-DEFINIR') ? content.meta.previewUrl : content.meta.domain;
const IS_PREVIEW = SITE_URL === content.meta.previewUrl;
const GA_CONFIGURED = !content.meta.gaId.includes('[');
const BUILD_DATE = new Date().toISOString().split('T')[0];

// ---------- CSP : hashes des blocs inline collectés au fil du build ----------

const cspScriptHashes = new Set();
const cspStyleHashes = new Set();

function sha256b64(str) {
  return crypto.createHash('sha256').update(str, 'utf8').digest('base64');
}

cspStyleHashes.add(sha256b64(css));

const NOSCRIPT_CSS = '.reveal,.reveal-stagger>*{opacity:1!important;transform:none!important}.ht-w{opacity:1!important;filter:none!important;transform:none!important}.process-rail .process-step-dot{background:var(--color-accent);border-color:var(--color-accent);color:var(--color-bg)}.process-rail .process-step:not(:last-child)::after{transform:none}.config-recap,.config-hint{display:none}';
cspStyleHashes.add(sha256b64(NOSCRIPT_CSS));

// Préchargement des fontes critiques (auto-hébergées, /fonts/)
const FONT_PRELOADS = `<link rel="preload" as="font" type="font/woff2" href="/fonts/montserrat-400-700-normal-latin.woff2" crossorigin>
  <link rel="preload" as="font" type="font/woff2" href="/fonts/playfair-display-700-800-normal-latin.woff2" crossorigin>
  <link rel="preload" as="font" type="font/woff2" href="/fonts/playfair-display-700-italic-latin.woff2" crossorigin>`;

// ---------- helpers ----------

function jsonLdScripts(jsonLdInput) {
  if (!jsonLdInput) return '';
  const items = Array.isArray(jsonLdInput) ? jsonLdInput : [jsonLdInput];
  return items.map(obj => {
    const body = JSON.stringify(obj);
    cspScriptHashes.add(sha256b64(body));
    return `<script type="application/ld+json">${body}</script>`;
  }).join('\n  ');
}

function webPageJsonLd({ title, description, pagePath }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: `${SITE_URL}${pagePath}`,
    inLanguage: 'fr-FR',
    isPartOf: {
      '@type': 'WebSite',
      name: content.nav.logo,
      url: SITE_URL,
    },
  };
}

function serviceJsonLd({ name, description, pagePath }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: `${SITE_URL}${pagePath}`,
    areaServed: [
      { '@type': 'City', name: 'Angoulême' },
      { '@type': 'AdministrativeArea', name: 'Charente' },
    ],
    provider: { '@id': `${SITE_URL}/#organization` },
  };
}

function heroTitleHTML() {
  const { title, titleAccent, titleAccentWords } = content.hero;
  const idx = title.lastIndexOf(titleAccent);
  const before = idx >= 0 ? title.slice(0, idx).trim() : title.trim();
  const staticWords = before.split(/\s+/).map(w => `<span class="ht-w">${w}</span>`).join(' ');
  const rotList = (titleAccentWords && titleAccentWords.length) ? titleAccentWords : [titleAccent];
  // texte initial = dernier mot (= état figé, phrase canonique) : correct sans JS / reduced-motion.
  // Le JS repart sur rotList[0] pour lancer le carrousel.
  const finalWord = rotList[rotList.length - 1];
  return `${staticWords} <span class="ht-w ht-rot" aria-hidden="true"><span class="ht-rot-w" data-rot-words="${rotList.join('|')}">${finalWord}</span></span>`;
}

// 2490 -> "2 490" (espace insécable fine comme séparateur de milliers, convention FR)
function fmtEUR(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function attr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function ga() {
  const body = `(function () {
    var GA_ID = '${content.meta.gaId}';
    window.__loadGA = function () {
      if (GA_ID.indexOf('[') !== -1) return; // placeholder non configuré : jamais de requête vers Google
      if (window.__gaLoaded) return;
      window.__gaLoaded = true;
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { dataLayer.push(arguments); };
      gtag('js', new Date());
      gtag('config', GA_ID);
    };
    if (localStorage.getItem('cookie-consent') === 'accepted') window.__loadGA();
  })();`;
  cspScriptHashes.add(sha256b64(body));
  return `<script>${body}</script>`;
}

function head({ title, description, pagePath, ogType = 'website', jsonLd = null, robots = IS_PREVIEW ? 'noindex, follow' : 'index, follow' }) {
  const canonical = `${SITE_URL}${pagePath}`;
  const ogImage = `${SITE_URL}/og/og-default.png`;
  return `<meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonical}">
  <meta name="robots" content="${robots}">
  <meta property="og:site_name" content="${content.nav.logo}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:type" content="${ogType}">
  <meta property="og:locale" content="fr_FR">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${content.nav.logo} — ${content.meta.title}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${ogImage}">
  <meta name="theme-color" content="#FAF6EF">
  <meta name="color-scheme" content="light">
  <link rel="icon" href="/favicon.ico" sizes="32x32">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/manifest.webmanifest">
  ${FONT_PRELOADS}
  ${jsonLdScripts(jsonLd)}
  ${ga()}
  <style>${css}</style>
  <noscript><style>${NOSCRIPT_CSS}</style></noscript>`;
}

function nav() {
  // Les services complémentaires viennent après le cœur de l'offre, juste avant Contact.
  const insertIndex = content.nav.links.findIndex(l => l.label === 'Contact');
  const before = content.nav.links.slice(0, insertIndex === -1 ? 0 : insertIndex);
  const after = content.nav.links.slice(insertIndex === -1 ? 0 : insertIndex);
  const solutionItems = content.digitalSolutions.items;

  const linkHTML = l => `<a href="${l.href}">${l.label}</a>`;
  const desktopBefore = before.map(linkHTML).join('\n        ');
  const desktopAfter = after.map(linkHTML).join('\n        ');
  const mobileBefore = before.map(linkHTML).join('\n        ');
  const mobileAfter = after.map(linkHTML).join('\n        ');

  const desktopDropdown = `<div class="nav-dropdown">
        <button type="button" class="nav-dropdown-trigger" id="nav-solutions-trigger" aria-haspopup="true" aria-expanded="false" aria-controls="nav-solutions-menu">
          ${content.nav.solutionsLabel}
          <span class="chevron" aria-hidden="true"></span>
        </button>
        <div class="nav-dropdown-menu" id="nav-solutions-menu" role="menu" aria-label="${content.nav.solutionsLabel}">
          <div class="nav-dropdown-menu-inner">
            ${solutionItems.map(it => `<a href="/${it.slug}" role="menuitem">${it.cardTitle}</a>`).join('\n            ')}
          </div>
        </div>
      </div>`;

  const mobileDropdown = `<details class="nav-mobile-dropdown">
        <summary>${content.nav.solutionsLabel}<span class="chevron" aria-hidden="true"></span></summary>
        <div class="nav-mobile-dropdown-links">
          ${solutionItems.map(it => `<a href="/${it.slug}">${it.cardTitle}</a>`).join('\n          ')}
        </div>
      </details>`;

  return `<header class="nav" id="nav">
    <div class="container">
      <a href="/" class="nav-logo">${content.nav.logo}</a>
      <nav class="nav-links" aria-label="Navigation principale">
        ${desktopBefore}
        ${desktopDropdown}
        ${desktopAfter}
      </nav>
      <a href="${content.hero.ctaPrimary.href}" class="btn btn-primary nav-cta">${content.nav.cta}</a>
      <button class="nav-toggle" id="nav-toggle" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="nav-mobile-panel">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
  <div class="nav-mobile-panel" id="nav-mobile-panel" role="dialog" aria-modal="true" aria-label="Menu">
    <div class="nav-mobile-top container">
      <a href="/" class="nav-logo">${content.nav.logo}</a>
      <button class="nav-mobile-close" id="nav-mobile-close" aria-label="Fermer le menu"></button>
    </div>
    <nav class="nav-mobile-links container" aria-label="Navigation mobile">
      ${mobileBefore}
      ${mobileDropdown}
      ${mobileAfter}
    </nav>
    <div class="container">
      <a href="${content.hero.ctaPrimary.href}" class="btn btn-primary" id="nav-mobile-cta">${content.nav.cta}</a>
    </div>
  </div>`;
}

function footer() {
  const anchorLinks = content.nav.links.map(l => `<a href="${l.href}">${l.label}</a>`).join('\n          ');
  const legalLinks = content.footer.legalLinks.map(l => `<a href="${l.href}">${l.label}</a>`).join('\n          ');
  const solutionLinks = content.digitalSolutions.items.map(it => `<a href="/${it.slug}">${it.cardTitle}</a>`).join('\n          ');
  return `<footer class="footer">
    <canvas class="silk-canvas silk-canvas--footer" data-dark="1" data-strength="1.2" aria-hidden="true"></canvas>
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <h3>${content.nav.logo}</h3>
          <p>${content.footer.tagline}</p>
        </div>
        <div class="footer-links">
          <div class="footer-col">
            <span class="head">Navigation</span>
            ${anchorLinks}
          </div>
          <div class="footer-col">
            <span class="head">${content.nav.solutionsLabel}</span>
            ${solutionLinks}
          </div>
          <div class="footer-col">
            <span class="head">Légal</span>
            ${legalLinks}
            <button type="button" class="footer-cookie-btn" id="cookie-reset">${content.cookieBanner.manage}</button>
          </div>
          <div class="footer-col">
            <span class="head">Contact</span>
            <a href="mailto:${content.meta.email}">${content.meta.email}</a>
            <a href="tel:${content.meta.phone}">${content.meta.phoneDisplay}</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${content.meta.year} ${content.nav.logo}. Tous droits réservés.</span>
        <span>Angoulême, Charente</span>
      </div>
    </div>
  </footer>`;
}

function cookieBanner() {
  const c = content.cookieBanner;
  return `<div class="cookie-banner" id="cookie-banner" role="region" aria-label="Consentement aux cookies">
    <p>${c.text} <a href="${c.link.href}">${c.link.label}</a></p>
    <div class="cookie-actions">
      <button class="cookie-refuse" id="cookie-refuse">${c.refuse}</button>
      <button class="cookie-accept" id="cookie-accept">${c.accept}</button>
    </div>
  </div>`;
}

function mobileCta() {
  return `<div class="mobile-cta">
    <a href="${content.mobileCta.href}" class="btn btn-primary">${content.mobileCta.label}</a>
  </div>`;
}

function scripts() {
  const body = `(function () {
    var GA_CONFIGURED = ${GA_CONFIGURED};

    // nav scroll state
    var nav = document.getElementById('nav');
    function onScroll() {
      if (window.scrollY > 24) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // CTA mobile : utile pendant la lecture, discret là où un CTA existe déjà ou quand le
    // clavier recouvre la page (hero, formulaire, footer et saisie dans un champ).
    var mobileCtaEl = document.querySelector('.mobile-cta');
    if (mobileCtaEl) {
      var mobileCtaZones = new Set();
      var mobileCtaFieldFocused = false;
      var mobileCtaTargets = document.querySelectorAll('.hero, #contact, .footer');
      function updateMobileCta() {
        mobileCtaEl.classList.toggle('is-hidden', mobileCtaZones.size > 0 || mobileCtaFieldFocused);
      }
      function syncMobileCtaZones() {
        mobileCtaZones.clear();
        mobileCtaTargets.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.bottom > 0 && r.top < window.innerHeight) mobileCtaZones.add(el);
        });
        updateMobileCta();
      }
      syncMobileCtaZones();
      if ('IntersectionObserver' in window) {
        var mobileCtaIo = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) mobileCtaZones.add(entry.target);
            else mobileCtaZones.delete(entry.target);
          });
          updateMobileCta();
        }, { threshold: 0 });
        mobileCtaTargets.forEach(function (el) { mobileCtaIo.observe(el); });
      } else {
        window.addEventListener('scroll', syncMobileCtaZones, { passive: true });
        window.addEventListener('resize', syncMobileCtaZones);
      }
      document.addEventListener('focusin', function (e) {
        if (!e.target.matches('input, textarea, select')) return;
        mobileCtaFieldFocused = true;
        updateMobileCta();
      });
      document.addEventListener('focusout', function () {
        setTimeout(function () {
          mobileCtaFieldFocused = !!(document.activeElement && document.activeElement.matches('input, textarea, select'));
          updateMobileCta();
        }, 80);
      });
    }

    // mobile menu — ouverture/fermeture + piège de focus + Échap + retour de focus
    var toggle = document.getElementById('nav-toggle');
    var panel = document.getElementById('nav-mobile-panel');
    var close = document.getElementById('nav-mobile-close');
    var focusableSelector = 'a[href], button:not([disabled]), summary';
    // ne compte que les éléments réellement visibles : un <details> mobile fermé contient des
    // liens toujours présents dans le DOM mais non focusables tant qu'il n'est pas ouvert.
    function getFocusables() {
      return Array.prototype.filter.call(panel.querySelectorAll(focusableSelector), function (el) {
        return el.offsetParent !== null;
      });
    }

    function onPanelKeydown(e) {
      if (e.key === 'Escape' || e.keyCode === 27) { closePanel(); return; }
      if (e.key !== 'Tab' && e.keyCode !== 9) return;
      var focusables = getFocusables();
      if (!focusables.length) return;
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    var openFocusTimer = null;
    function openPanel() {
      panel.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onPanelKeydown);
      if (openFocusTimer) clearTimeout(openFocusTimer);
      openFocusTimer = setTimeout(function () { openFocusTimer = null; if (close) close.focus(); }, 50);
    }
    function closePanel() {
      panel.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onPanelKeydown);
      if (openFocusTimer) { clearTimeout(openFocusTimer); openFocusTimer = null; }
      panel.querySelectorAll('details[open]').forEach(function (d) { d.open = false; });
      if (toggle) toggle.focus();
    }
    if (toggle) toggle.addEventListener('click', openPanel);
    if (close) close.addEventListener('click', closePanel);
    if (panel) panel.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closePanel); });

    // logo -> accueil. Déjà sur l'accueil : remonter en haut (respecte scroll-behavior CSS) sans recharger.
    document.querySelectorAll('.nav-logo').forEach(function (logo) {
      logo.addEventListener('click', function (e) {
        if (location.pathname === '/' || location.pathname === '/index.html') {
          e.preventDefault();
          window.scrollTo(0, 0);
        }
      });
    });

    // dropdown "Solutions" du header desktop — hover en CSS pur (voir style), + clic/clavier ici
    var solutionsDropdown = document.querySelector('.nav-dropdown');
    var solutionsTrigger = document.getElementById('nav-solutions-trigger');
    if (solutionsDropdown && solutionsTrigger) {
      function closeSolutionsDropdown() {
        solutionsDropdown.classList.remove('is-open');
        solutionsTrigger.setAttribute('aria-expanded', 'false');
      }
      solutionsTrigger.addEventListener('click', function () {
        var isOpen = solutionsDropdown.classList.toggle('is-open');
        solutionsTrigger.setAttribute('aria-expanded', String(isOpen));
      });
      document.addEventListener('click', function (e) {
        if (!solutionsDropdown.contains(e.target)) closeSolutionsDropdown();
      });
      solutionsDropdown.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' || e.keyCode === 27) { closeSolutionsDropdown(); solutionsTrigger.focus(); }
      });
    }

    // scroll reveal
    var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
    if ('IntersectionObserver' in window && revealEls.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }

    // process — rail « méthode » : la ligne se remplit et les pastilles s'allument en cascade
    // dès que la section entre dans le champ de vision (comportement identique desktop / mobile).
    var rail = document.querySelector('[data-rail]');
    if (rail) {
      if ('IntersectionObserver' in window) {
        var railIo = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) { rail.classList.add('is-lit'); railIo.disconnect(); }
          });
        }, { threshold: 0.35 });
        railIo.observe(rail);
      } else {
        rail.classList.add('is-lit');
      }
    }

    // Utilitaires partagés par le configurateur.
    var prefersReduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    function frCount(n) { return String(n).replace(/\\B(?=(\\d{3})+(?!\\d))/g, '\\u00a0'); }

    // configurateur de devis — total live, détail de la formule, envoi progressif
    var config = document.querySelector('[data-config]');
    if (config) {
      var cBases = config.querySelectorAll('input[name="config-formule"]');
      var cOpts = config.querySelectorAll('input[name^="config-opt-"]');
      var cTotal = config.querySelector('[data-config-total]');
      var cWeeks = config.querySelector('[data-config-weeks]');
      var cRecap = config.querySelector('[data-config-recap]');
      var cCta = config.querySelector('[data-config-cta]');
      var cLead = config.getAttribute('data-lead') || '';
      var cBasePrefix = config.getAttribute('data-base-prefix') || '';
      var cShown = parseFloat((cTotal && cTotal.textContent || '0').replace(/\\D/g, '')) || 0;
      var cState = { formule: '', type: '', total: 0, timeline: '', opts: [], recurring: 0 };
      var cRaf;

      function cAnimate(target) {
        if (prefersReduce) { if (cTotal) cTotal.textContent = frCount(target); cShown = target; return; }
        var from = cShown, t0 = performance.now();
        if (cRaf) cancelAnimationFrame(cRaf);
        (function step(t) {
          var pr = Math.min(1, (t - t0) / 420);
          var e = 1 - Math.pow(1 - pr, 3);
          if (cTotal) cTotal.textContent = frCount(Math.round(from + (target - from) * e));
          if (pr < 1) cRaf = requestAnimationFrame(step); else cShown = target;
        })(performance.now());
      }

      function cPaint() {
        var base = null;
        for (var i = 0; i < cBases.length; i++) { if (cBases[i].checked) { base = cBases[i]; break; } }
        var total = 0, timeline = '', recurring = 0, opts = [];
        if (cRecap) cRecap.innerHTML = '';
        if (base) {
          total = parseFloat(base.getAttribute('data-price'));
          timeline = base.getAttribute('data-timeline') || '';
          if (cRecap) {
            var brow = document.createElement('div');
            brow.className = 'config-recap-row config-recap-row--base';
            var bn = document.createElement('span'); bn.textContent = base.value;
            var bp = document.createElement('span'); bp.textContent = frCount(total) + ' \\u20ac';
            brow.appendChild(bn); brow.appendChild(bp);
            cRecap.appendChild(brow);
          }
        }
        cOpts.forEach(function (o) {
          if (!o.checked) return;
          var nm = o.getAttribute('data-name');
          var rec = o.getAttribute('data-recurring');
          if (rec) { recurring += parseFloat(rec); opts.push(nm + ' (' + rec + ' \\u20ac/mois)'); }
          else {
            var pr = parseFloat(o.getAttribute('data-price')) || 0;
            total += pr;
            opts.push(nm + ' (+' + frCount(pr) + ' \\u20ac)');
          }
          if (cRecap) {
            var row = document.createElement('div');
            row.className = 'config-recap-row';
            var a = document.createElement('span'); a.textContent = nm;
            var b = document.createElement('span');
            b.textContent = rec ? ('+ ' + rec + ' \\u20ac/mois') : ('+ ' + frCount(parseFloat(o.getAttribute('data-price'))) + ' \\u20ac');
            row.appendChild(a); row.appendChild(b);
            cRecap.appendChild(row);
          }
        });
        if (cWeeks) cWeeks.textContent = timeline || '\\u2014';
        cAnimate(total);

        cState = {
          formule: base ? base.value : '',
          type: base ? base.getAttribute('data-type') : '',
          total: total, timeline: timeline, opts: opts, recurring: recurring
        };
      }

      cBases.forEach(function (b) { b.addEventListener('change', cPaint); });
      cOpts.forEach(function (o) { o.addEventListener('change', cPaint); });
      cPaint();

      // « Recevoir ce devis détaillé » -> pré-remplit le formulaire de contact, puis y amène
      if (cCta) cCta.addEventListener('click', function () {
        var lines = [cLead];
        if (cState.formule) lines.push('\\u2022 ' + cBasePrefix + ' : ' + cState.formule);
        cState.opts.forEach(function (o) { lines.push('\\u2022 Option : ' + o); });
        lines.push('');
        lines.push('Total estim\\u00e9 : ' + frCount(cState.total) + ' \\u20ac' + (cState.recurring ? (' + ' + cState.recurring + ' \\u20ac/mois') : ''));
        lines.push('D\\u00e9lai estim\\u00e9 : ' + cState.timeline);
        var msg = lines.join('\\n');
        var mEl = document.getElementById('contact-message');
        var tEl = document.getElementById('contact-project-type');
        if (mEl) mEl.value = msg;
        if (tEl && cState.type) {
          for (var j = 0; j < tEl.options.length; j++) {
            if (tEl.options[j].value === cState.type) { tEl.selectedIndex = j; break; }
          }
        }
        var focusEl = document.getElementById('contact-name') || document.getElementById('contact-email');
        if (focusEl) setTimeout(function () { focusEl.focus({ preventScroll: true }); }, 500);
      });
    }

    // hero — titre en entrée blur-zoom mot à mot, puis carrousel du dernier mot qui se fige sur "faire confiance"
    var heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      var htReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var htWords = heroTitle.querySelectorAll('.ht-w');
      var htEl = heroTitle.querySelector('.ht-rot-w');
      var htWrap = htEl && htEl.parentNode; // .ht-w.ht-rot
      var htList = (htEl && htEl.getAttribute('data-rot-words') || '').split('|').filter(Boolean);
      if (htReduce) {
        htWords.forEach(function (w) { w.classList.add('is-in'); });
        if (htWrap) htWrap.classList.add('ht-final'); // texte déjà = mot final
      } else {
        if (htEl && htList.length > 1) htEl.textContent = htList[0]; // repart au début du carrousel avant la 1re peinture
        requestAnimationFrame(function () {
          htWords.forEach(function (w, i) {
            w.style.transitionDelay = (120 + i * 55) + 'ms';
            w.classList.add('is-in');
          });
        });
        var htEnd = 120 + htWords.length * 55 + 650;
        setTimeout(function () {
          htWords.forEach(function (w) { w.style.transitionDelay = ''; });
        }, htEnd);

        if (htEl && htWrap && htList.length > 1) {
          var htBegin = function () {
            // largeur naturelle de chaque mot (conteneur en auto), pour animer la largeur ensuite
            var rest = htEl.textContent, widths = {};
            htWrap.style.width = '';
            htList.forEach(function (w) { htEl.textContent = w; widths[w] = Math.ceil(htEl.offsetWidth); });
            htEl.textContent = rest;
            htWrap.style.width = widths[rest] + 'px';

            var seq = htList.slice(1); // la liste se déroule dans l'ordre, le dernier mot fige
            var si = 0;
            var advance = function () {
              htEl.classList.add('ht-out'); // le mot grossit + se floute + disparaît
              setTimeout(function () {
                var w = seq[si];
                var last = (si === seq.length - 1);
                htEl.textContent = w;
                htWrap.style.width = widths[w] + 'px'; // "de vous" glisse pour se recaler
                htEl.classList.remove('ht-out');
                htEl.classList.add('ht-in');
                void htEl.offsetWidth; // applique l'état d'entrée avant transition
                htEl.classList.remove('ht-in');
                si++;
                if (!last) setTimeout(advance, 1650);
                else setTimeout(function () {
                  htWrap.style.width = '';            // figé → largeur redevient responsive
                  htWrap.classList.add('ht-final');   // trait qui se dessine sous "faire confiance"
                }, 460);
              }, 420);
            };
            setTimeout(advance, 600);
          };
          setTimeout(htBegin, htEnd + 500);
        }
      }
    }

    // cookie consent — bannière affichée seulement si Analytics est réellement configuré
    var banner = document.getElementById('cookie-banner');
    var acceptBtn = document.getElementById('cookie-accept');
    var refuseBtn = document.getElementById('cookie-refuse');
    var resetBtn = document.getElementById('cookie-reset');
    function maybeShowBanner() {
      var consent = localStorage.getItem('cookie-consent');
      if (banner && GA_CONFIGURED && !consent) {
        setTimeout(function () { banner.classList.add('is-visible'); }, 800);
      }
    }
    maybeShowBanner();
    if (acceptBtn) acceptBtn.addEventListener('click', function () {
      localStorage.setItem('cookie-consent', 'accepted');
      banner.classList.remove('is-visible');
      if (window.__loadGA) window.__loadGA();
    });
    if (refuseBtn) refuseBtn.addEventListener('click', function () {
      localStorage.setItem('cookie-consent', 'refused');
      banner.classList.remove('is-visible');
    });
    if (resetBtn) resetBtn.addEventListener('click', function () {
      localStorage.removeItem('cookie-consent');
      maybeShowBanner();
    });

    // formulaire de contact — _next robuste + envoi progressif (fetch), repli POST natif sans JS
    var contactForm = document.querySelector('.contact-form');
    if (contactForm) {
      var nextField = contactForm.querySelector('[name="_next"]');
      if (nextField) nextField.value = location.origin + '/merci';
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' },
        }).then(function (res) {
          if (res.ok) { location.href = nextField ? nextField.value : '/merci'; }
          else { contactForm.submit(); }
        }).catch(function () {
          contactForm.submit();
        });
      });
    }
  })();`;
  cspScriptHashes.add(sha256b64(body));
  return `<script>${body}</script>`;
}

function page({ title, description, pagePath, bodyHTML, ogType, jsonLd, robots, includeMobileCta = true }) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
${head({ title, description, pagePath, ogType, jsonLd, robots })}
</head>
<body id="top">
<a href="#contenu" class="skip-link">Aller au contenu</a>
${nav()}
<main id="contenu">
${bodyHTML}
</main>
${footer()}
${cookieBanner()}
${includeMobileCta ? mobileCta() : ''}
<script src="/silk-bg.js?v=${SILK_JS_V}" defer></script>
${scripts()}
</body>
</html>`;
}

// ---------- sections (homepage) ----------

function heroSection() {
  const h = content.hero;
  return `<section class="hero">
    <canvas class="silk-canvas silk-canvas--hero" data-opaque="1" data-strength="1.81" aria-hidden="true"></canvas>
    <div class="container">
      <div class="hero-inner">
        <p class="eyebrow hero-eyebrow reveal">${h.eyebrow}</p>
        <h1 class="hero-title" aria-label="${h.title}">${heroTitleHTML()}</h1>
        <p class="hero-subtitle reveal">${h.subtitle}</p>
        <div class="hero-ctas reveal">
          <a href="${h.ctaPrimary.href}" class="btn btn-primary">${h.ctaPrimary.label}</a>
          <a href="${h.ctaSecondary.href}" class="btn btn-ghost">${h.ctaSecondary.label}</a>
        </div>
        <p class="hero-reassurance reveal">${h.reassurance}</p>
        <div class="scroll-hint reveal">
          <span>${h.scrollHint}</span>
          <span class="scroll-hint-line"></span>
        </div>
      </div>
    </div>
  </section>`;
}

function manifesteSection() {
  const m = content.manifeste;
  return `<section id="manifeste" class="bg-alt">
    <div class="container">
      <div class="manifeste-rail reveal">
        <div class="manifeste-meta">
          <span class="manifeste-mark" aria-hidden="true">À retenir</span>
          <p class="eyebrow manifeste-eyebrow">${m.eyebrow}</p>
        </div>
        <div class="manifeste-copy">
          <p class="manifeste-lead">${m.lead}</p>
          <p class="manifeste-em">${m.emphasis}</p>
        </div>
      </div>
    </div>
  </section>`;
}

function audiencesSection() {
  const a = content.audiences;
  const cards = a.items.map((it, i) => `<div class="card audience-card">
        <span class="mark">0${i + 1}</span>
        <h3>${it.label}</h3>
        <p class="detail">${it.detail}</p>
        <p class="need">${it.need}</p>
      </div>`).join('\n      ');
  return `<section id="pour-qui">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">${a.eyebrow}</p>
        <h2>${a.title}</h2>
      </div>
      <div class="audience-grid reveal-stagger">
        ${cards}
      </div>
    </div>
  </section>`;
}

function prestationsSection() {
  const p = content.prestations;
  const items = p.items.map((it, i) => `<div class="prestation-item">
        <span class="mark">0${i + 1}</span>
        <div>
          <h3>${it.title}</h3>
          <p>${it.desc}</p>
        </div>
      </div>`).join('\n      ');
  return `<section id="prestations" class="bg-alt">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">${p.eyebrow}</p>
        <h2>${p.title}</h2>
      </div>
      <div class="prestations-grid reveal">
        ${items}
      </div>
    </div>
  </section>`;
}

function caseStudySection() {
  const c = content.caseStudy;
  return `<section id="realisation">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">${c.sectionEyebrow}</p>
        <h2>${c.sectionTitle}</h2>
      </div>
      <div class="case-study reveal">
        <canvas class="silk-canvas silk-canvas--case" data-dark="1" data-strength="1.1" aria-hidden="true"></canvas>
        <div class="case-study-inner">
          <div class="case-study-head">
            <div>
              <p class="eyebrow">${c.eyebrow}</p>
              <h3>${c.title}</h3>
              <p class="subtitle">${c.subtitle}</p>
              <p class="case-study-duration"><span>${c.durationLabel}</span>${c.duration}</p>
            </div>
            <a href="${c.link.href}" class="btn btn-invert case-study-link" target="_blank" rel="noopener">${c.link.label} <span aria-hidden="true">↗</span></a>
          </div>

          <div class="case-study-devices" aria-label="Aperçus du site sur ordinateur et téléphone">
            <figure class="case-study-desktop">
              <div class="device-browser-bar" aria-hidden="true"><span></span><span></span><span></span></div>
              <div class="device-screen">
                <picture>
                  <source
                    type="image/avif"
                    srcset="/images/cabinet-laperonnie-desktop.avif">
                  <img
                    src="/images/cabinet-laperonnie-desktop.jpg"
                    alt="Page d’accueil du Cabinet Laperonnie affichée sur ordinateur"
                    width="1440" height="900" loading="lazy" decoding="async">
                </picture>
              </div>
            </figure>
            <figure class="case-study-phone">
              <span class="device-phone-speaker" aria-hidden="true"></span>
              <div class="device-phone-screen">
                <picture>
                  <source type="image/avif" srcset="/images/cabinet-laperonnie-mobile.avif">
                  <img
                    src="/images/cabinet-laperonnie-mobile.jpg"
                    alt="Page d’accueil du Cabinet Laperonnie affichée sur téléphone"
                    width="390" height="844" loading="lazy" decoding="async">
                </picture>
              </div>
            </figure>
          </div>

          <div class="case-study-details">
            <div class="case-study-block">
              <p class="label">${c.needLabel}</p>
              <p>${c.need}</p>
            </div>
            <div class="case-study-block">
              <p class="label">${c.choicesLabel}</p>
              <ul class="case-study-list">
                ${c.choices.map(choice => `<li>${choice}</li>`).join('\n                ')}
              </ul>
            </div>
            <div class="case-study-block case-study-block--facts">
              <p class="label">${c.deliverablesLabel}</p>
              <ul class="case-study-list">
                ${c.deliverables.map(d => `<li>${d}</li>`).join('\n                ')}
              </ul>
            </div>
          </div>

          <div class="case-study-constraint">
            <p class="label">${c.constraintLabel}</p>
            <p>${c.constraint}</p>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

function processSection() {
  const p = content.process;
  const steps = p.steps.map(s => `<li class="process-step">
          <span class="process-step-dot" aria-hidden="true">${s.n}</span>
          <div class="process-step-body">
            <h3 class="process-step-title">${s.title}</h3>
            <p class="process-step-desc">${s.desc}</p>
          </div>
        </li>`).join('\n        ');
  return `<section id="comment-ca-se-passe">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">${p.eyebrow}</p>
        <h2>${p.title}</h2>
      </div>
      <ol class="process-rail reveal" data-rail>
        ${steps}
      </ol>
    </div>
  </section>`;
}

function faqSection() {
  const f = content.faq;
  const items = f.items.map(it => `<details class="faq-item" name="faq">
        <summary>${it.q}<span class="plus"></span></summary>
        <p>${it.a}</p>
      </details>`).join('\n      ');
  return `<section id="faq">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">${f.eyebrow}</p>
        <h2>${f.title}</h2>
      </div>
      <div class="faq-list reveal">
        ${items}
      </div>
    </div>
  </section>`;
}

function digitalSolutionsSection() {
  const s = content.digitalSolutions;
  const cards = s.items.map(it => `<div class="card solution-card">
        <h3>${it.cardTitle}</h3>
        <p>${it.cardDesc}</p>
        <a href="/${it.slug}" class="link-arrow">En savoir plus →</a>
      </div>`).join('\n      ');
  return `<section id="solutions" class="bg-alt">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">${s.eyebrow}</p>
        <h2>${s.title}</h2>
      </div>
      <div class="solution-teaser-grid reveal-stagger">
        ${cards}
      </div>
    </div>
  </section>`;
}

function proofSection() {
  const p = content.proof;

  const stats = p.stats.map(s => {
    const inner = s.plain
      ? `${s.value}${s.suffix || ''}`
      : `<span data-count="${s.value}">${s.value}</span>${s.suffix || ''}`;
    return `<div class="proof-stat">
          <span class="proof-stat-num">${inner}</span>
          <span class="proof-stat-label">${s.label}</span>
        </div>`;
  }).join('\n        ');

  const details = p.details.map(item => `<li>${item}</li>`).join('\n            ');

  return `<section id="resultats">
    <div class="container">
      <div class="proof">
        <div class="proof-main">
          <div class="section-head reveal">
            <p class="eyebrow">${p.eyebrow}</p>
            <h2>${p.title}</h2>
            <p>${p.intro}</p>
          </div>
          <div class="proof-stats">
        ${stats}
          </div>
        </div>
        <aside class="proof-commitments">
          <p class="proof-commitments-label">${p.detailsLabel}</p>
          <ul class="proof-commitments-list">
            ${details}
          </ul>
          <p class="proof-commitments-note">${p.note}</p>
          <a href="${p.cta.href}" class="btn btn-invert proof-commitments-cta">${p.cta.label}</a>
        </aside>
      </div>
    </div>
  </section>`;
}

function configuratorSection() {
  const cf = content.configurator;
  const pn = cf.panel;
  const def = cf.bases.find(b => b.recommended) || cf.bases[0];

  const bases = cf.bases.map(b => {
    const price = `${b.pricePrefix ? `<span class="config-formule-prefix">${b.pricePrefix}</span>` : ''}${fmtEUR(b.price)} €${b.priceNote ? `<span class="config-formule-pricenote">${b.priceNote}</span>` : ''}`;
    return `<label class="config-formule${b.recommended ? ' config-formule--reco' : ''}">
            <input type="radio" name="config-formule" value="${attr(b.name)}" data-price="${b.price}" data-timeline="${attr(b.timeline)}" data-type="${attr(b.contactType)}"${b === def ? ' checked' : ''}>
            <span class="config-formule-top">
              <span class="config-formule-name">${b.name}</span>
              ${b.badge ? `<span class="config-formule-badge">${b.badge}</span>` : ''}
            </span>
            <span class="config-formule-price">${price}</span>
            <span class="config-formule-blurb">${b.blurb}</span>
            <span class="config-formule-list">
              ${b.features.map(f => `<span class="config-formule-feat">${f}</span>`).join('\n              ')}
            </span>
          </label>`;
  }).join('\n          ');

  const allOpts = cf.options.concat([{ ...cf.maintenance, recurring: true }]);
  const opts = allOpts.map(o => `<label class="config-choice config-choice--opt${o.recurring ? ' config-choice--recurring' : ''}">
            <input type="checkbox" name="config-opt-${o.id}" data-name="${attr(o.name)}"${o.recurring ? ` data-recurring="${o.price}"` : ` data-price="${o.price}"`}>
            <span class="config-choice-name">${o.name}</span>
            <span class="config-choice-price">${o.recurring ? '+ ' : '+ '}${fmtEUR(o.price)}${o.unit || ' €'}</span>
          </label>`).join('\n          ');

  const exampleLink = pn.exampleDevisUrl
    ? `<a href="${pn.exampleDevisUrl}" class="config-example">${pn.exampleLabel} →</a>`
    : '';

  return `<section id="tarifs" class="bg-alt">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">${cf.eyebrow}</p>
        <h2>${cf.title}</h2>
        <p>${cf.intro}</p>
      </div>
      <div class="config reveal" data-config
        data-lead="${attr(cf.prefillLead)}"
        data-base-prefix="${attr(pn.basePrefix)}">
        <div class="config-formules">
          <p class="config-group-label">${cf.baseLabel}</p>
          <div class="config-formules-grid">
          ${bases}
          </div>
        </div>

        <div class="config-controls">
          <div class="config-group">
            <p class="config-group-label">${cf.optionsLabel}</p>
            <div class="config-opts">
          ${opts}
            </div>
          </div>
          <p class="config-hint">${pn.hint}</p>
        </div>

        <aside class="config-panel" aria-live="polite">
          <p class="config-panel-label">${pn.label}</p>
          <p class="config-total"><span data-config-total>${fmtEUR(def.price)}</span><span class="config-total-cur">€</span></p>
          <p class="config-panel-note">${pn.note} <span data-config-weeks>${def.timeline}</span>.</p>
          <div class="config-recap" data-config-recap></div>
          <a href="/#contact" class="btn btn-invert config-cta" data-config-cta>${pn.cta}</a>
          ${exampleLink}
          <p class="config-reassurance">${pn.reassurance}</p>
        </aside>

        <p class="config-disclaimer">${pn.disclaimer}</p>
      </div>
    </div>
  </section>`;
}

function contactSection() {
  const c = content.contact;
  const fl = c.form.fields;
  return `<section id="contact" class="bg-alt">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">${c.eyebrow}</p>
        <h2 id="contact-heading">${c.title}</h2>
        <p>${c.subtitle}</p>
      </div>
      <div class="contact-grid reveal">
        <form class="contact-form" action="${c.form.action}" method="POST" aria-labelledby="contact-heading">
          <input type="hidden" name="_subject" value="Nouvelle demande de devis — site vitrine">
          <input type="hidden" name="_next" value="${SITE_URL}/merci">
          <input type="hidden" name="_captcha" value="true">
          <input type="hidden" name="_template" value="table">
          <input type="text" name="_honey" class="hp" tabindex="-1" autocomplete="off">
          <div class="field-row">
            <div class="field">
              <label for="${fl.name.id}">${fl.name.label}</label>
              <input type="text" id="${fl.name.id}" name="nom" autocomplete="name" required>
            </div>
            <div class="field">
              <label for="${fl.email.id}">${fl.email.label}</label>
              <input type="email" id="${fl.email.id}" name="email" autocomplete="email" required>
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <label for="${fl.phone.id}">${fl.phone.label}</label>
              <input type="tel" id="${fl.phone.id}" name="telephone" autocomplete="tel">
            </div>
            <div class="field">
              <label for="${fl.projectType.id}">${fl.projectType.label}</label>
              <select id="${fl.projectType.id}" name="type_projet" required>
                <option value="" disabled selected>${fl.projectType.placeholder}</option>
                ${fl.projectType.options.map(o => `<option value="${o}">${o}</option>`).join('\n                ')}
              </select>
            </div>
          </div>
          <div class="field">
            <label for="${fl.message.id}">${fl.message.label}</label>
            <textarea id="${fl.message.id}" name="message" placeholder="${attr(fl.message.placeholder)}" required></textarea>
          </div>
          <p class="form-consent">${c.form.consentText} <a href="${c.form.consentLink.href}">${c.form.consentLink.label}</a>.</p>
          <button type="submit" class="btn btn-primary">${c.form.submit}</button>
        </form>
        <div class="contact-info">
          <h3>${c.infoTitle}</h3>
          <div class="contact-info-row">
            <span class="label">Email</span>
            <a href="mailto:${content.meta.email}">${content.meta.email}</a>
          </div>
          <div class="contact-info-row">
            <span class="label">Téléphone</span>
            <a href="tel:${content.meta.phone}">${content.meta.phoneDisplay}</a>
          </div>
          <div class="contact-info-row">
            <span class="label">Disponibilité</span>
            <span>${c.availability}</span>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

// ---------- pages ----------

function buildIndex() {
  const professionalService = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#organization`,
    name: content.nav.logo,
    description: content.meta.description,
    url: SITE_URL,
    image: `${SITE_URL}/og/og-default.png`,
    logo: `${SITE_URL}/icon-512.png`,
    email: content.meta.email,
    telephone: content.meta.phone,
    areaServed: [
      { '@type': 'City', name: 'Angoulême' },
      { '@type': 'AdministrativeArea', name: 'Charente' },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Angoulême',
      addressRegion: 'Charente',
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 45.6486,
      longitude: 0.1557,
    },
    knowsLanguage: 'fr',
    founder: { '@type': 'Person', name: content.nav.logo },
  };

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.items.map(it => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };

  const bodyHTML = [
    heroSection(),
    audiencesSection(),
    manifesteSection(),
    caseStudySection(),
    prestationsSection(),
    proofSection(),
    configuratorSection(),
    processSection(),
    digitalSolutionsSection(),
    faqSection(),
    contactSection(),
  ].join('\n');
  return page({
    title: content.meta.title,
    description: content.meta.description,
    pagePath: '/',
    bodyHTML,
    ogType: 'website',
    jsonLd: [professionalService, faqPage],
  });
}

function buildSolutionPage(item) {
  const pagePath = `/${item.slug}`;
  const audienceItems = item.audience.map(a => `<li>${a}</li>`).join('\n            ');
  const steps = item.steps.map(s => `<div class="step">
          <span class="mark">${s.n}</span>
          <h3>${s.title}</h3>
          <p>${s.desc}</p>
        </div>`).join('\n        ');
  const benefits = item.benefits.map(b => `<div class="card solution-benefit">
          <h3>${b.title}</h3>
          <p>${b.desc}</p>
        </div>`).join('\n        ');
  const faqItems = item.faq.map(f => `<details class="faq-item" name="faq-${item.slug}">
          <summary>${f.q}<span class="plus"></span></summary>
          <p>${f.a}</p>
        </details>`).join('\n        ');
  const bodyHTML = `<div class="container">
    <div class="solution-page">
      <p class="eyebrow">${item.pageEyebrow}</p>
      <h1>${item.h1}</h1>
      <p class="solution-intro">${item.intro}</p>
      ${item.notice ? `<div class="notice-box">${item.notice}</div>` : ''}
      <div class="solution-block">
        <p class="eyebrow">${item.benefitsLabel}</p>
        <div class="solution-benefits-grid">
          ${benefits}
        </div>
      </div>
      <div class="solution-block">
        <p class="eyebrow">${item.audienceLabel}</p>
        <ul class="dash-list">
          ${audienceItems}
        </ul>
      </div>
      <div class="solution-block">
        <p class="eyebrow">${item.stepsLabel}</p>
        <div class="steps steps--three">
          ${steps}
        </div>
      </div>
      <div class="solution-block">
        <p class="eyebrow">${item.faqLabel}</p>
        <div class="faq-list solution-faq">
          ${faqItems}
        </div>
      </div>
      <div class="solution-tarif">
        <p class="label">${item.tarifLabel}</p>
        <p>${item.tarif}</p>
      </div>
      <a href="/#contact" class="btn btn-primary">${item.ctaLabel}</a>
    </div>
  </div>`;
  const fullTitle = `${item.metaTitle} — ${content.nav.logo}`;
  return page({
    title: fullTitle,
    description: item.metaDescription,
    pagePath,
    bodyHTML,
    jsonLd: serviceJsonLd({ name: item.metaTitle, description: item.metaDescription, pagePath }),
  });
}

function legalPage({ pagePath, title, description, sections }) {
  const bodyHTML = `<div class="container">
    <div class="legal-page">
      <h1>${title}</h1>
      <p class="updated">Dernière mise à jour : [DATE_A_COMPLETER]</p>
      ${sections}
    </div>
  </div>`;
  const fullTitle = `${title} — ${content.nav.logo}`;
  return page({
    title: fullTitle,
    description,
    pagePath,
    bodyHTML,
    jsonLd: webPageJsonLd({ title: fullTitle, description, pagePath }),
  });
}

function buildMentionsLegales() {
  const sections = `
      <h2>Éditeur du site</h2>
      <p>
        [Nom complet à compléter]<br>
        Statut : [Auto-entrepreneur / EI à compléter]<br>
        SIRET : [SIRET à compléter]<br>
        Adresse : [Adresse à compléter]<br>
        Email : <a href="mailto:${content.meta.email}">${content.meta.email}</a><br>
        Téléphone : <a href="tel:${content.meta.phone}">${content.meta.phoneDisplay}</a>
      </p>

      <h2>Directeur de la publication</h2>
      <p>[Nom complet à compléter]</p>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par Vercel Inc.<br>
        340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis<br>
        <a href="https://vercel.com" target="_blank" rel="noopener">vercel.com</a>
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>L'ensemble des contenus présents sur ce site (textes, images, identité visuelle) est la propriété exclusive de [Nom complet à compléter], sauf mention contraire. Toute reproduction sans autorisation est interdite.</p>

      <h2>Litiges</h2>
      <p>En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. À défaut, les tribunaux français seront seuls compétents.</p>
  `;
  return legalPage({
    pagePath: '/mentions-legales',
    title: 'Mentions légales',
    description: 'Mentions légales du site de création de sites internet à Angoulême — éditeur, hébergeur et propriété intellectuelle.',
    sections,
  });
}

function buildConfidentialite() {
  const sections = `
      <h2>1. Introduction</h2>
      <p>La présente politique de confidentialité explique comment [Nom complet à compléter] collecte, utilise et protège vos données personnelles lorsque vous visitez ce site.</p>

      <h2>2. Responsable du traitement</h2>
      <p>[Nom complet à compléter] — [Adresse à compléter] — <a href="mailto:${content.meta.email}">${content.meta.email}</a></p>

      <h2>3. Données collectées</h2>
      <p>Via le formulaire de contact : nom, email, téléphone, type de projet et message. Ces données sont transmises via le service Formsubmit et ne sont utilisées que pour répondre à votre demande.</p>

      <h2>4. Finalité du traitement</h2>
      <p>Les données collectées servent uniquement à répondre à vos demandes de devis ou de contact. Elles ne sont ni revendues ni transmises à des tiers à des fins commerciales.</p>

      <h2>5. Durée de conservation</h2>
      <p>Les données transmises via le formulaire sont conservées le temps nécessaire au traitement de votre demande, puis supprimées.</p>

      <h2>6. Vos droits</h2>
      <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour l'exercer, contactez-nous à <a href="mailto:${content.meta.email}">${content.meta.email}</a>. Vous disposez également d'un droit de réclamation auprès de la <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener">CNIL</a>.</p>

      <h2>7. Cookies</h2>
      <p>Ce site utilise Google Analytics à des fins de mesure d'audience, uniquement après votre consentement via la bannière cookies affichée lors de votre première visite. Votre choix (accepté ou refusé) est enregistré dans le stockage local de votre navigateur (localStorage) et peut être modifié à tout moment via le bouton « ${content.cookieBanner.manage} » dans le pied de page, ou en effaçant les données de navigation de ce site. Aucun cookie de mesure d'audience n'est déposé tant que vous n'avez pas accepté la bannière.</p>
      <p>Destinataire des données de mesure d'audience : Google Ireland Limited. Ces données peuvent faire l'objet d'un transfert hors Union européenne, encadré par les clauses contractuelles types de la Commission européenne.</p>
      <p>Le formulaire de contact est traité par Formsubmit (sous-traitant situé aux États-Unis) qui achemine votre message par email ; il n'est pas utilisé à des fins de mesure d'audience.</p>

      <h2>8. Contact</h2>
      <p>Pour toute question relative à cette politique de confidentialité : <a href="mailto:${content.meta.email}">${content.meta.email}</a>.</p>
  `;
  return legalPage({
    pagePath: '/confidentialite',
    title: 'Politique de confidentialité',
    description: 'Politique de confidentialité RGPD du site de création de sites internet à Angoulême — données collectées, cookies, droits.',
    sections,
  });
}

function buildMerci() {
  const bodyHTML = `<div class="container">
    <div class="error-page">
      <p class="eyebrow">Message envoyé</p>
      <h1>Merci pour votre demande</h1>
      <p>Votre message a bien été reçu. Je reviens vers vous sous 24 à 48h pour échanger sur votre projet.</p>
      <a href="/" class="btn btn-primary">Retour à l'accueil</a>
    </div>
  </div>`;
  const title = `Merci — ${content.nav.logo}`;
  const description = 'Votre demande a bien été envoyée.';
  const pagePath = '/merci';
  return page({
    title,
    description,
    pagePath,
    bodyHTML,
    robots: 'noindex, nofollow',
    includeMobileCta: false,
    jsonLd: webPageJsonLd({ title, description, pagePath }),
  });
}

function build404() {
  const bodyHTML = `<div class="container">
    <div class="error-page">
      <div class="code" aria-hidden="true">404</div>
      <h1>Page introuvable</h1>
      <p>La page que vous cherchez n'existe pas ou a été déplacée.</p>
      <a href="/" class="btn btn-primary">Retour à l'accueil</a>
    </div>
  </div>`;
  const title = `Page introuvable — ${content.nav.logo}`;
  const description = "Cette page n'existe pas.";
  const pagePath = '/404';
  return page({
    title,
    description,
    pagePath,
    bodyHTML,
    robots: 'noindex, nofollow',
    includeMobileCta: false,
    jsonLd: webPageJsonLd({ title, description, pagePath }),
  });
}

function buildExempleDevis() {
  const bodyHTML = `<div class="container">
    <div class="legal-page devis-page">
      <p class="eyebrow">Exemple</p>
      <h1>À quoi ressemble un devis</h1>
      <p class="devis-intro">Voici un document fictif pour vous donner une idée du niveau de détail. Les montants sont provisoires : votre devis est établi après un premier échange, une fois le périmètre précisé — <a href="/#contact">demandez le vôtre</a>.</p>

      <div class="devis-doc">
        <div class="devis-head">
          <div>
            <p class="devis-label">Prestataire</p>
            <p>${content.nav.logo}<br>
            [Statut juridique à compléter]<br>
            SIRET : [SIRET à compléter]<br>
            [Adresse à compléter]<br>
            ${content.meta.email} · ${content.meta.phoneDisplay}</p>
          </div>
          <div>
            <p class="devis-label">Client</p>
            <p>Client exemple<br>Angoulême (16)</p>
            <p class="devis-label devis-label--spaced">Devis</p>
            <p>N° 2026-000 · émis le [date]<br>Valable 30 jours</p>
          </div>
        </div>

        <table class="devis-table">
          <thead>
            <tr><th>Prestation</th><th>Montant</th></tr>
          </thead>
          <tbody>
            <tr><td>Site multi-pages sur-mesure (formule Professionnel) — 5 pages, blog, formulaire qualifié et référencement local de base</td><td>2&nbsp;990&nbsp;€</td></tr>
            <tr><td>Option espace d’administration</td><td>390&nbsp;€</td></tr>
            <tr><td>Rédaction des textes de l'ensemble des pages</td><td>390&nbsp;€</td></tr>
            <tr><td>Référencement renforcé — textes enrichis et suivi personnalisé dans le temps</td><td>390&nbsp;€</td></tr>
          </tbody>
          <tfoot>
            <tr><td>Total</td><td>4&nbsp;160&nbsp;€</td></tr>
          </tfoot>
        </table>
        <p class="devis-note">Conditions fiscales précisées sur le devis définitif. Option : maintenance, hébergement et petites mises à jour à 59&nbsp;€/mois, sans engagement.</p>

        <p class="devis-label">Modalités</p>
        <ul>
          <li>Acompte de 30 % à la commande, solde à la mise en ligne.</li>
          <li>Délai indicatif : 4 semaines à compter de la validation de la maquette.</li>
          <li>Trois séries de corrections incluses sur le design.</li>
          <li>Le site et son code vous appartiennent à la livraison.</li>
        </ul>
      </div>

      <p class="devis-cta-line"><a href="/#tarifs" class="btn btn-ghost">Estimer mon projet</a> <a href="/#contact" class="btn btn-primary">Demander mon devis</a></p>
    </div>
  </div>`;
  const title = `Exemple de devis — ${content.nav.logo}`;
  const description = 'Exemple de devis pour la création d’un site internet à Angoulême : prestations détaillées, montant, modalités.';
  const pagePath = '/exemple-devis';
  return page({
    title,
    description,
    pagePath,
    bodyHTML,
    robots: 'noindex, follow',
    includeMobileCta: false,
    jsonLd: webPageJsonLd({ title, description, pagePath }),
  });
}

function buildSitemap() {
  const pages = ['/', '/mentions-legales', '/confidentialite', ...content.digitalSolutions.items.map(it => `/${it.slug}`)];
  const urls = pages.map(p => `  <url>
    <loc>${SITE_URL}${p}</loc>
    <lastmod>${BUILD_DATE}</lastmod>
  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function buildRobots() {
  return `User-agent: *
Disallow: /admin/
Disallow: /merci
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

function buildCSP() {
  const scriptSrc = ["'self'", ...[...cspScriptHashes].map(h => `'sha256-${h}'`), 'https://www.googletagmanager.com'];
  const styleSrc = ["'self'", ...[...cspStyleHashes].map(h => `'sha256-${h}'`)];
  return [
    `default-src 'self'`,
    `script-src ${scriptSrc.join(' ')}`,
    `style-src ${styleSrc.join(' ')}`,
    `img-src 'self' data: https://www.googletagmanager.com https://*.google-analytics.com`,
    `font-src 'self'`,
    `connect-src 'self' https://formsubmit.co https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com`,
    `form-action 'self' https://formsubmit.co`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `manifest-src 'self'`,
    `upgrade-insecure-requests`,
  ].join('; ');
}

// vercel.json est généré par build.mjs (hashes CSP calculés à partir du contenu inline réel) :
// ne pas éditer à la main, toute modification manuelle sera écrasée au prochain build.
function buildVercelJson() {
  const config = {
    cleanUrls: true,
    trailingSlash: false,
    headers: [
      {
        source: '/(.*)',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'off' },
          { key: 'Content-Security-Policy', value: buildCSP() },
        ],
      },
      {
        source: '/(.*)\\.(css|js|mjs|svg|png|jpg|jpeg|webp|avif|woff2|woff|ico)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/(robots.txt|sitemap.xml|manifest.webmanifest)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600' },
        ],
      },
    ],
  };
  return JSON.stringify(config, null, 2) + '\n';
}

// ---------- write ----------
// vercel.json est calculé en dernier : il a besoin que toutes les pages ci-dessus
// aient été générées pour que les hashes CSP (script-src/style-src) soient complets.

const solutionOutputs = Object.fromEntries(
  content.digitalSolutions.items.map(item => [`${item.slug}.html`, buildSolutionPage(item)])
);

const outputs = {
  'index.html': buildIndex(),
  'mentions-legales.html': buildMentionsLegales(),
  'confidentialite.html': buildConfidentialite(),
  ...solutionOutputs,
  'exemple-devis.html': buildExempleDevis(),
  'merci.html': buildMerci(),
  '404.html': build404(),
  'sitemap.xml': buildSitemap(),
  'robots.txt': buildRobots(),
  'vercel.json': buildVercelJson(),
};

for (const [file, html] of Object.entries(outputs)) {
  fs.writeFileSync(path.join(__dirname, file), html, 'utf-8');
  console.log(`✓ ${file}`);
}

console.log(`\nSITE_URL = ${SITE_URL}${IS_PREVIEW ? '  (preview — pages en noindex, follow)' : ''}`);
console.log('Build terminé.');
