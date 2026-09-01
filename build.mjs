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

const NOSCRIPT_CSS = '.reveal,.reveal-stagger>*{opacity:1!important;transform:none!important}.ht-w{opacity:1!important;filter:none!important;transform:none!important}.pricing-tabs{display:none!important}.pricing-panel{display:block!important}';
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

function parsePriceEUR(str) {
  const digits = str.replace(/[^\d]/g, '');
  return digits ? Number(digits) : undefined;
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
  // le dropdown "Solutions" s'insère juste avant Prestations, sur desktop comme sur mobile
  const insertIndex = content.nav.links.findIndex(l => l.label === 'Prestations');
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
      <a href="#top" class="nav-logo">${content.nav.logo}</a>
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
      <a href="#top" class="nav-logo">${content.nav.logo}</a>
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
            <span class="head">Solutions</span>
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

    // tarifs — onglets Essentiel / Pro / Premium
    var pTabs = document.querySelector('.pricing-tabs');
    if (pTabs) {
      var ptabs = Array.prototype.slice.call(pTabs.querySelectorAll('.pricing-tab'));
      var ppanels = Array.prototype.slice.call(document.querySelectorAll('.pricing-panel'));
      var pSelect = function (i, focus) {
        ptabs.forEach(function (t, k) {
          var on = k === i;
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
          t.tabIndex = on ? 0 : -1;
          if (ppanels[k]) ppanels[k].classList.toggle('is-active', on);
        });
        if (focus && ptabs[i]) ptabs[i].focus();
      };
      ptabs.forEach(function (t, i) {
        t.addEventListener('click', function () { pSelect(i); });
        t.addEventListener('keydown', function (e) {
          var d = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1
                : (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -1 : 0;
          if (!d) return;
          e.preventDefault();
          pSelect((i + d + ptabs.length) % ptabs.length, true);
        });
      });
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
<script src="/silk-bg.js" defer></script>
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
        <div class="scroll-hint reveal">
          <span>${h.scrollHint}</span>
          <span class="scroll-hint-line"></span>
        </div>
      </div>
    </div>
  </section>`;
}

function audiencesSection() {
  const a = content.audiences;
  const cards = a.items.map((it, i) => `<div class="card audience-card">
        <span class="index">0${i + 1}</span>
        <h3>${it.label}</h3>
        <p class="detail">${it.detail}</p>
        <p class="need">${it.need}</p>
      </div>`).join('\n      ');
  return `<section id="pour-qui">
    <div class="container">
      <div class="section-head section-head--center reveal">
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
      <div class="case-study reveal">
        <canvas class="silk-canvas silk-canvas--case" data-dark="1" data-strength="1.1" aria-hidden="true"></canvas>
        <div class="case-study-inner">
          <div class="case-study-grid">
            <div>
              <p class="eyebrow">${c.eyebrow}</p>
              <h2>${c.title}</h2>
              <p class="subtitle">${c.subtitle}</p>
              <div class="case-study-block">
                <p class="label">${c.needLabel}</p>
                <p>${c.need}</p>
              </div>
              <div class="case-study-block">
                <p class="label">${c.responseLabel}</p>
                <p>${c.response}</p>
              </div>
              <a href="${c.link.href}" class="btn btn-ghost btn-ghost--invert" target="_blank" rel="noopener">${c.link.label}</a>
            </div>
            <div class="case-study-visual">
              <div class="screenshot-frame">
                <picture>
                  <source
                    type="image/avif"
                    srcset="/images/cabinet-laperonnie-600.avif 600w, /images/cabinet-laperonnie-900.avif 900w, /images/cabinet-laperonnie-1200.avif 1200w"
                    sizes="(min-width: 960px) 540px, 92vw">
                  <img
                    src="/images/cabinet-laperonnie-1200.jpg"
                    srcset="/images/cabinet-laperonnie-600.jpg 600w, /images/cabinet-laperonnie-900.jpg 900w, /images/cabinet-laperonnie-1200.jpg 1200w"
                    sizes="(min-width: 960px) 540px, 92vw"
                    alt="Site internet du Cabinet Laperonnie, avocat à Angoulême"
                    width="1200" height="750" loading="lazy" decoding="async">
                </picture>
              </div>
              <div class="testimonial-frame">“${c.testimonialPlaceholder}”</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

function pricingSection() {
  const p = content.pricing;
  const defaultIdx = Math.max(0, p.plans.findIndex(pl => pl.featured));

  const tabs = p.plans.map((plan, i) => {
    const on = i === defaultIdx;
    const label = plan.tabLabel || plan.name;
    const star = plan.featured ? '<span class="pricing-tab-star" aria-hidden="true">★</span>' : '';
    const aria = plan.featured ? ` aria-label="${label} — la formule la plus choisie"` : '';
    return `<button type="button" role="tab" id="ptab-${i}" class="pricing-tab${on ? ' is-active' : ''}"
          aria-selected="${on ? 'true' : 'false'}" aria-controls="ppanel-${i}"${on ? '' : ' tabindex="-1"'}${aria}>${star}${label}</button>`;
  }).join('\n        ');

  const panels = p.plans.map((plan, i) => {
    const on = i === defaultIdx;
    const price = `${plan.pricePrefix ? `<span class="price-prefix">${plan.pricePrefix}</span>` : ''}${plan.price}`;
    return `<div role="tabpanel" id="ppanel-${i}" class="pricing-panel${on ? ' is-active' : ''}" aria-labelledby="ptab-${i}">
          <div class="pricing-card">
            <div class="pricing-card-head">
              <span class="pricing-card-name">${plan.name}</span>
              ${plan.badge ? `<span class="pricing-badge">${plan.badge}</span>` : ''}
            </div>
            <div class="pricing-price">${price}</div>
            ${plan.note ? `<p class="pricing-note">${plan.note}</p>` : ''}
            <hr class="pricing-rule">
            <ul class="pricing-features">
              ${plan.features.map(f => `<li>${f}</li>`).join('\n              ')}
            </ul>
            <a href="/#contact" class="btn pricing-cta">${content.nav.cta}</a>
          </div>
        </div>`;
  }).join('\n        ');

  return `<section id="tarifs" class="bg-alt">
    <div class="container">
      <div class="section-head section-head--center reveal">
        <p class="eyebrow">${p.eyebrow}</p>
        <h2>${p.title}</h2>
      </div>
      <div class="pricing reveal">
        <div class="pricing-tabs" role="tablist" aria-label="Formules">
        ${tabs}
        </div>
        <div class="pricing-panels">
        ${panels}
        </div>
      </div>
      <p class="pricing-footnote reveal">${p.footnote}</p>
    </div>
  </section>`;
}

function processSection() {
  const p = content.process;
  const steps = p.steps.map(s => `<div class="step">
        <span class="n">${s.n}</span>
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
      </div>`).join('\n      ');
  return `<section id="comment-ca-se-passe">
    <div class="container">
      <div class="section-head section-head--center reveal">
        <p class="eyebrow">${p.eyebrow}</p>
        <h2>${p.title}</h2>
      </div>
      <div class="steps reveal-stagger">
        ${steps}
      </div>
    </div>
  </section>`;
}

function faqSection() {
  const f = content.faq;
  const items = f.items.map(it => `<details class="faq-item" name="faq">
        <summary>${it.q}<span class="plus"></span></summary>
        <p>${it.a}</p>
      </details>`).join('\n      ');
  return `<section id="faq" class="bg-alt">
    <div class="container">
      <div class="section-head section-head--center reveal">
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
      <div class="section-head section-head--center reveal">
        <p class="eyebrow">${s.eyebrow}</p>
        <h2>${s.title}</h2>
      </div>
      <div class="solution-teaser-grid reveal-stagger">
        ${cards}
      </div>
    </div>
  </section>`;
}

function contactSection() {
  const c = content.contact;
  const fl = c.form.fields;
  return `<section id="contact">
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
            <textarea id="${fl.message.id}" name="message" required></textarea>
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
    priceRange: '990€ - 4490€+',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Formules de création de site internet',
      itemListElement: content.pricing.plans.map(plan => ({
        '@type': 'Offer',
        name: plan.name,
        description: plan.tagline,
        priceCurrency: 'EUR',
        price: parsePriceEUR(plan.price),
      })),
    },
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
    prestationsSection(),
    caseStudySection(),
    pricingSection(),
    processSection(),
    faqSection(),
    digitalSolutionsSection(),
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
          <span class="n">${s.n}</span>
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
