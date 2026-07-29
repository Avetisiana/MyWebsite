// Build statique — génère les pages HTML à partir de content/site-content.mjs + styles/main.css.
// Aucune dépendance : Node pur. Lancer avec `node build.mjs`.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { content } from './content/site-content.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const css = fs.readFileSync(path.join(__dirname, 'styles/main.css'), 'utf-8');

const FONTS_LINK = `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">`;

// ---------- helpers ----------

function heroTitleHTML() {
  const { title, titleAccent } = content.hero;
  return title.replace(titleAccent, `<em>${titleAccent}</em>`);
}

function ga() {
  return `<script>
  (function () {
    var GA_ID = '[GA_MEASUREMENT_ID]';
    window.__loadGA = function () {
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
  })();
  </script>`;
}

function head({ title, description, pagePath, ogType = 'website', jsonLd = null, robots = 'index, follow' }) {
  const canonical = `${content.meta.domain}${pagePath}`;
  return `<meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonical}">
  <meta name="robots" content="${robots}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:type" content="${ogType}">
  <meta property="og:locale" content="fr_FR">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  ${FONTS_LINK}
  ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
  ${ga()}
  <style>${css}</style>`;
}

function nav() {
  const links = content.nav.links.map(l => `<a href="${l.href}">${l.label}</a>`).join('\n        ');
  return `<header class="nav" id="nav">
    <div class="container">
      <a href="#top" class="nav-logo">${content.nav.logo}</a>
      <nav class="nav-links" aria-label="Navigation principale">
        ${links}
      </nav>
      <a href="${content.hero.ctaPrimary.href}" class="btn btn-primary nav-cta">${content.nav.cta}</a>
      <button class="nav-toggle" id="nav-toggle" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="nav-mobile-panel">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
  <div class="nav-mobile-panel" id="nav-mobile-panel">
    <div class="nav-mobile-top container">
      <a href="#top" class="nav-logo">${content.nav.logo}</a>
      <button class="nav-mobile-close" id="nav-mobile-close" aria-label="Fermer le menu"></button>
    </div>
    <div class="nav-mobile-links container">
      ${links}
    </div>
    <div class="container">
      <a href="${content.hero.ctaPrimary.href}" class="btn btn-primary" id="nav-mobile-cta">${content.nav.cta}</a>
    </div>
  </div>`;
}

function footer() {
  const anchorLinks = content.nav.links.map(l => `<a href="${l.href}">${l.label}</a>`).join('\n          ');
  const legalLinks = content.footer.legalLinks.map(l => `<a href="${l.href}">${l.label}</a>`).join('\n          ');
  return `<footer class="footer">
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
            <span class="head">Légal</span>
            ${legalLinks}
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
  return `<div class="cookie-banner" id="cookie-banner">
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
  return `<script>
  (function () {
    // nav scroll state
    var nav = document.getElementById('nav');
    function onScroll() {
      if (window.scrollY > 24) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // mobile menu
    var toggle = document.getElementById('nav-toggle');
    var panel = document.getElementById('nav-mobile-panel');
    var close = document.getElementById('nav-mobile-close');
    function openPanel() {
      panel.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function closePanel() {
      panel.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    if (toggle) toggle.addEventListener('click', openPanel);
    if (close) close.addEventListener('click', closePanel);
    if (panel) panel.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closePanel); });

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

    // cookie consent
    var banner = document.getElementById('cookie-banner');
    var acceptBtn = document.getElementById('cookie-accept');
    var refuseBtn = document.getElementById('cookie-refuse');
    var consent = localStorage.getItem('cookie-consent');
    if (banner && !consent) {
      setTimeout(function () { banner.classList.add('is-visible'); }, 800);
    }
    if (acceptBtn) acceptBtn.addEventListener('click', function () {
      localStorage.setItem('cookie-consent', 'accepted');
      banner.classList.remove('is-visible');
      if (window.__loadGA) window.__loadGA();
    });
    if (refuseBtn) refuseBtn.addEventListener('click', function () {
      localStorage.setItem('cookie-consent', 'refused');
      banner.classList.remove('is-visible');
    });
  })();
  </script>`;
}

function page({ title, description, pagePath, bodyHTML, ogType, jsonLd, robots, includeMobileCta = true }) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
${head({ title, description, pagePath, ogType, jsonLd, robots })}
</head>
<body id="top">
${nav()}
${bodyHTML}
${footer()}
${cookieBanner()}
${includeMobileCta ? mobileCta() : ''}
${scripts()}
</body>
</html>`;
}

// ---------- sections (homepage) ----------

function heroSection() {
  const h = content.hero;
  return `<section class="hero">
    <div class="container">
      <div class="hero-inner">
        <p class="eyebrow hero-eyebrow reveal">${h.eyebrow}</p>
        <h1 class="reveal">${heroTitleHTML()}</h1>
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
      <div class="prestations-grid reveal-stagger">
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
              <div class="screenshot-frame">${c.screenshotPlaceholder}</div>
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
  const cards = p.plans.map(plan => `<div class="card pricing-card${plan.featured ? ' pricing-card--featured' : ''}">
        ${plan.featured ? `<span class="pricing-badge">${plan.badge}</span>` : ''}
        <h3>${plan.name}</h3>
        <div class="pricing-price">${plan.pricePrefix ? `<span class="price-prefix">${plan.pricePrefix}</span>` : ''}${plan.price}</div>
        ${plan.note ? `<div class="pricing-note">${plan.note}</div>` : ''}
        <p class="pricing-tagline">${plan.tagline}</p>
        <ul class="pricing-features">
          ${plan.features.map(f => `<li>${f}</li>`).join('\n          ')}
        </ul>
        <a href="#contact" class="btn ${plan.featured ? 'btn-primary' : 'btn-ghost'}">Demander un devis</a>
      </div>`).join('\n      ');
  return `<section id="tarifs" class="bg-alt">
    <div class="container">
      <div class="section-head section-head--center reveal">
        <p class="eyebrow">${p.eyebrow}</p>
        <h2>${p.title}</h2>
      </div>
      <div class="pricing-grid reveal-stagger">
        ${cards}
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
  const items = f.items.map(it => `<details class="faq-item">
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

function contactSection() {
  const c = content.contact;
  const fl = c.form.fields;
  return `<section id="contact">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">${c.eyebrow}</p>
        <h2>${c.title}</h2>
        <p>${c.subtitle}</p>
      </div>
      <div class="contact-grid reveal">
        <form class="contact-form" action="${c.form.action}" method="POST">
          <input type="hidden" name="_subject" value="Nouvelle demande de devis — site vitrine">
          <input type="hidden" name="_next" value="merci.html">
          <input type="hidden" name="_captcha" value="false">
          <input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off">
          <div class="field-row">
            <div class="field">
              <label for="${fl.name.id}">${fl.name.label}</label>
              <input type="text" id="${fl.name.id}" name="nom" required>
            </div>
            <div class="field">
              <label for="${fl.email.id}">${fl.email.label}</label>
              <input type="email" id="${fl.email.id}" name="email" required>
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <label for="${fl.phone.id}">${fl.phone.label}</label>
              <input type="tel" id="${fl.phone.id}" name="telephone">
            </div>
            <div class="field">
              <label for="${fl.projectType.id}">${fl.projectType.label}</label>
              <select id="${fl.projectType.id}" name="type_projet" required>
                ${fl.projectType.options.map(o => `<option value="${o}">${o}</option>`).join('\n                ')}
              </select>
            </div>
          </div>
          <div class="field">
            <label for="${fl.message.id}">${fl.message.label}</label>
            <textarea id="${fl.message.id}" name="message" required></textarea>
          </div>
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
            <span class="label">${c.zoneLabel}</span>
            <span>${c.zone}</span>
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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: content.nav.logo,
    description: content.meta.description,
    url: content.meta.domain,
    email: content.meta.email,
    telephone: content.meta.phone,
    areaServed: ['Angoulême', 'Charente'],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Angoulême',
      addressRegion: 'Charente',
      addressCountry: 'FR',
    },
    priceRange: '990€ - 4490€+',
  };
  const bodyHTML = [
    heroSection(),
    audiencesSection(),
    prestationsSection(),
    caseStudySection(),
    pricingSection(),
    processSection(),
    faqSection(),
    contactSection(),
  ].join('\n');
  return page({
    title: content.meta.title,
    description: content.meta.description,
    pagePath: '/',
    bodyHTML,
    ogType: 'website',
    jsonLd,
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
  return page({ title: `${title} — ${content.nav.logo}`, description, pagePath, bodyHTML, robots: 'index, follow' });
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
    pagePath: '/mentions-legales.html',
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
      <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour l'exercer, contactez-nous à <a href="mailto:${content.meta.email}">${content.meta.email}</a>.</p>

      <h2>7. Cookies</h2>
      <p>Ce site utilise Google Analytics à des fins de mesure d'audience, uniquement après votre consentement via la bannière cookies affichée lors de votre première visite. Votre choix (accepté ou refusé) est enregistré dans le stockage local de votre navigateur (localStorage) et peut être modifié à tout moment en effaçant les données de navigation de ce site. Aucun cookie de mesure d'audience n'est déposé tant que vous n'avez pas accepté la bannière.</p>

      <h2>8. Contact</h2>
      <p>Pour toute question relative à cette politique de confidentialité : <a href="mailto:${content.meta.email}">${content.meta.email}</a>.</p>
  `;
  return legalPage({
    pagePath: '/confidentialite.html',
    title: 'Politique de confidentialité',
    description: 'Politique de confidentialité RGPD du site de création de sites internet à Angoulême — données collectées, cookies, droits.',
    sections,
  });
}

function buildMerci() {
  const bodyHTML = `<div class="container">
    <div class="error-page">
      <p class="eyebrow">Message envoyé</p>
      <h1 style="margin-top: 0.5em;">Merci pour votre demande</h1>
      <p>Votre message a bien été reçu. Je reviens vers vous sous 24 à 48h pour échanger sur votre projet.</p>
      <a href="/" class="btn btn-primary">Retour à l'accueil</a>
    </div>
  </div>`;
  return page({
    title: `Merci — ${content.nav.logo}`,
    description: 'Votre demande a bien été envoyée.',
    pagePath: '/merci.html',
    bodyHTML,
    robots: 'noindex, nofollow',
    includeMobileCta: false,
  });
}

function build404() {
  const bodyHTML = `<div class="container">
    <div class="error-page">
      <div class="code">404</div>
      <h1 style="margin-top: 0.3em;">Page introuvable</h1>
      <p>La page que vous cherchez n'existe pas ou a été déplacée.</p>
      <a href="/" class="btn btn-primary">Retour à l'accueil</a>
    </div>
  </div>`;
  return page({
    title: `Page introuvable — ${content.nav.logo}`,
    description: "Cette page n'existe pas.",
    pagePath: '/404.html',
    bodyHTML,
    robots: 'noindex, nofollow',
    includeMobileCta: false,
  });
}

function buildSitemap() {
  const pages = ['/', '/mentions-legales.html', '/confidentialite.html'];
  const urls = pages.map(p => `  <url>
    <loc>${content.meta.domain}${p}</loc>
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
Disallow: /merci.html
Allow: /

Sitemap: ${content.meta.domain}/sitemap.xml
`;
}

// ---------- write ----------

const outputs = {
  'index.html': buildIndex(),
  'mentions-legales.html': buildMentionsLegales(),
  'confidentialite.html': buildConfidentialite(),
  'merci.html': buildMerci(),
  '404.html': build404(),
  'sitemap.xml': buildSitemap(),
  'robots.txt': buildRobots(),
};

for (const [file, html] of Object.entries(outputs)) {
  fs.writeFileSync(path.join(__dirname, file), html, 'utf-8');
  console.log(`✓ ${file}`);
}

console.log('\nBuild terminé.');
