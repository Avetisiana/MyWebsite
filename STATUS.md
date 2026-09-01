# STATUS.md — [MOI]

## Dernière session
Date : 2026-09-01 (suite 4)
Fait : Cache-busting de `silk-bg.js` + fix bannière cookies / CTA collant sur mobile
+ logo « Arthur Avetisian » → accueil + swap « Ce que je propose » ↔ « Un déroulé simple, en 4 étapes ».

### Swap Prestations ↔ Process
- `buildIndex` : ordre des sections `process` et `prestations` échangé. Nouvel ordre :
  hero → pour-qui → **comment-ca-se-passe** → realisation → tarifs → **prestations** → solutions
  → faq → contact.
- Fonds ajustés pour garder l'alternance ivoire / `bg-alt` (F3EEE4) intacte :
  `processSection()` gagne `class="bg-alt"`, `prestationsSection()` la perd. Résultat :
  ivoire / ivoire / alt / ivoire / alt / ivoire / alt / ivoire / ivoire (inchangé).
- Les `id` d'ancre (`#prestations`, `#comment-ca-se-passe`) ne bougent pas → liens nav OK.
- Vérifié : capture pleine page desktop + mobile, alternance de fond propre.

### Logo → accueil (au lieu de « haut de page »)
- `build.mjs` : les deux `.nav-logo` (header + panneau mobile) passent de `href="#top"` à
  `href="/"`. `#top` ne renvoyait qu'en haut de la page courante (inutile sur les pages légales
  / solutions).
- Confort : sur l'accueil, un handler sur `.nav-logo` fait `preventDefault` + `window.scrollTo(0,0)`
  (respecte `scroll-behavior` CSS, donc reduced-motion) → remontée douce sans rechargement.
  Ailleurs : navigation normale vers `/`.
- `<body id="top">` devenu inutilisé mais conservé (ancre légitime, retrait = churn inutile).
- Vérifié Puppeteer : accueil → scrollY 0 sans changement d'URL ; page légale → `/` ; panneau
  mobile → ferme + va sur `/`. 0 violation CSP, `vercel.json` régénéré (hash script à jour).

### Bannière cookies vs CTA collant (mobile)
- **Signalé par Arthur** : sur certains mobiles, les boutons Refuser/Accepter de la bannière
  passaient sous la barre « Demander un devis » collante (deux barres `position: fixed` en bas +
  barre du navigateur + encoche → zone de tap inatteignable). NB : la bannière ne s'affiche
  actuellement pas du tout (`GA_CONFIGURED = false`), le bug ne se déclenchera qu'une fois GA
  configuré — corrigé en amont.
- **Correctif** (`styles/main.css` uniquement) :
  - `.cookie-banner.is-visible ~ .mobile-cta { transform: translateY(120%); pointer-events: none }`
    — le CTA collant se rétracte tant que la bannière est là, remonte tout seul au choix fait
    (sélecteur de voisinage : `.mobile-cta` suit `.cookie-banner` dans le DOM). `.mobile-cta` a
    reçu `transition: transform .4s`.
  - Bannière ancrée en bas (`bottom: calc(env(safe-area-inset-bottom,0px) + var(--space-3))`, avec
    repli plat `bottom: var(--space-3)` pour les navigateurs sans `env()`), plus besoin de dégager
    les 80px du CTA. Padding compact sur mobile (`--space-2`), `--space-3` restauré ≥768px.
  - `max-height: calc(100vh - 2*var(--space-3))` + `overflow-y: auto` : filet de sécurité petits écrans.
  - `body { overflow-x: hidden; overflow-x: clip }` — `clip` ne crée pas de conteneur de défilement,
    donc ne casse pas `position: fixed` sur Samsung Internet / WebViews ; `hidden` reste le repli.
  - `body` / `.mobile-cta` : `padding-bottom` intègre `env(safe-area-inset-bottom)` (repli plat d'abord).
- Vérifié (Puppeteer 390/360/412 + court + desktop, avant/après Accepter) : boutons bannière
  atteignables partout, CTA rétracté puis restauré, desktop inchangé, 0 violation CSP sur 4 pages,
  `vercel.json` régénéré (hash `<style>` à jour).

### `silk-bg.js` — cache-busting
- **Problème constaté** : Arthur voyait 3 fonds différents entre `:3000`, `:3001` et le site en
  ligne. Diagnostic : le **code est byte-identique** partout (MD5 `index.html` + `silk-bg.js`
  identiques sur les 3, ETag Vercel confirmé). La différence = **cache navigateur** — `silk-bg.js`
  servi en `Cache-Control: immutable` 1 an sur Vercel et référencé en `/silk-bg.js` nu → un
  visiteur garde l'ancienne version jusqu'à un an après un déploiement (un F5 ne la re-télécharge
  pas). Onglet `:3001` = serveur lancé 1 h plus tôt, jamais rechargé.
- **Correctif** (`build.mjs`) : `SILK_JS_V` = SHA-256 du contenu de `silk-bg.js`, 10 hex. Le
  `<script>` devient `/silk-bg.js?v=${SILK_JS_V}`. L'URL ne change **que** si le fichier change →
  re-téléchargement forcé au bon moment, cache long conservé sinon.
- **Sans impact** : même requête / poids / `defer` ; `serve.mjs` (ligne 92) et Vercel strippent la
  query avant de résoudre le fichier (vérifié : `?v=abc` → 200) ; `script-src 'self'` matche par
  chemin → `vercel.json` **inchangé**, aucun hash CSP à recalculer ; rendu identique (screenshot) ;
  neutre SEO (asset non indexé). Hash actuel : `6d857980dc`.

---

## Session 2026-09-01 (suite 3 — fond soie desktop, titre étude de cas, ordre sections — poussé)
Fait : Ajustements fond « soie » (desktop), titre section étude de cas, ordre des sections.
Beaucoup d'allers-retours sur le fondu. **Poussé** au fil de l'eau.

### Fond « soie » — état actuel
- **Diagnostic clé** : le Chrome d'Arthur a l'**accélération matérielle désactivée** ->
  `getContext('webgl')` renvoie `null` -> il voyait le **fallback CSS**, pas le shader. Firefox/Safari
  font un rendu logiciel, pas Chrome. (Conseil donné : `chrome://settings/system`.)
- Fallback CSS (`.silk-css .hero::before`, JS ajoute `.silk-css` sur `<html>` si `!gl`) : teinte
  verte **uniforme** (`rgba(30,59,50,0.185)` + 1 nappe claire qui dérive, **pas de flou** -> aucun
  fondu latéral/coins) + masque **fondu bas uniquement** (`#000 48% -> transparent 95%`, grand
  dégradé des CTA à la section 2).
- Shader : uniforme `u_desktop`. Desktop-hero -> **dim central retiré** (texture pleine derrière le
  texte), fondu bas = `smoothstep(0, 0.52, uv.y)` (plein au-dessus de ~48 % du haut, grand dégradé
  jusqu'à la section 2), `strength *0.85`. Pas de fondu gauche/droite/haut. **Mobile-hero inchangé**
  (dim central + `smoothstep(0, 0.52)` + strength plein).
- Rappels : hero = canvas opaque (shader peint l'ivoire) ; footer/étude de cas = transparent
  prémultiplié ; tout tourne sur mobile aussi.

### Étude de cas — titre de section
`content.caseStudy` : `sectionEyebrow: 'Réalisations'` + `sectionTitle: 'Une réalisation récente'`
(placeholder, à affiner). `caseStudySection()` : `.section-head` centré ajouté avant la carte ;
le `<h2>` de la carte (nom du client) passe en `<h3>` (`.case-study h3` en CSS).

### Ordre des sections
FAQ et « Au-delà du site internet » (digitalSolutions) **échangées** : …process -> **solutions
(bg-alt)** -> **faq (ivoire, `bg-alt` retiré)** -> contact.

---

## Session 2026-09-01 (suite 2 — fond soie mobile + tarifs, poussé)
Fait : Fond « soie » sur mobile, refonte de la section Tarifs, correctif de survol des Prestations.

### Fond « soie » — même effet sur mobile que desktop
Le canvas WebGL **transparent** ne se composait pas sur certains GPU mobiles / iOS Safari (Arthur ne
voyait rien). Solutions successives (fallback CSS `.hero::before` rejeté) puis **version finale** :
- **hero : canvas OPAQUE** (`data-opaque="1"`) — le shader peint l'ivoire *et* la soie. Le compositing
  opaque est fiable partout. Fondu du bas géré **dans le shader** (`fadeBot`, plus de `mask-image`) →
  bas du hero = ivoire pur = raccord invisible avec « Pour qui ».
- **footer / étude de cas : canvas transparent** mais sortie **prémultipliée** (`vec4(rgb*a, a)` +
  `premultipliedAlpha: true`) — le vrai correctif iOS Safari. `mask-image` conservé pour leurs bords.
- Les **3 surfaces** tournent maintenant sur mobile (avant : hero seul). Correction d'aspect dans le
  shader (`u_res/min(u_res.x,u_res.y)`) → densité de plis constante même en portrait.
- Dégradés **gauche/droite retirés** (`fadeX` supprimé) → la texture va bord à bord horizontalement.
- `clearColor` ivoire (pas de flash noir). Mobile : DPR ≤ 1,25, rendu 0,5×. Garde-fous inchangés
  (pause hors écran / onglet caché, reduced-motion, WebGL absent, perte de contexte).
- `serve.mjs` : les `.js` servis en `no-cache` **en local** (dev) — plus besoin de vider le cache
  navigateur à chaque itération, surtout sur mobile. (serve.mjs n'est pas déployé.)
- CSS : bloc `@media (max-width: 640px)` du fallback CSS supprimé ; `.silk-canvas--hero` a juste
  `background: var(--color-bg)` (base avant 1re frame).

### Section Tarifs — refonte (maquette d'Arthur)
- **Barre d'onglets** en pilule : Essentiel / Pro / Premium (Pro actif par défaut, `role="tablist"`,
  navigation clavier flèches, `aria-selected` / `tabindex` gérés). Conteneur gris (`rgba(26,25,23,0.06)`)
  qui contraste, onglet actif blanc + ombre.
- **Une seule carte** affichée à la fois, en **vert foncé** arrondi : label, badge « LE PLUS CHOISI »
  (Pro seulement), prix serif crème, filet, liste `—`, bouton crème/vert.
- **★ verte** devant « Pro » dans l'onglet + `aria-label="Pro — la formule la plus choisie"`.
- Sans JS : les 3 cartes s'empilent, onglets masqués (`NOSCRIPT_CSS`).
- `content.pricing.plans[].tabLabel` ajouté (Essentiel / Pro / Premium). `pricingSection()` réécrit,
  JS d'onglets dans `scripts()`. Anciennes classes `.pricing-grid` / `.pricing-card--featured` /
  `.pricing-tagline` remplacées.

### Prestations — survol « lent et pas réactif »
Cause : `reveal-stagger` laissait un `transition-delay` résiduel jusqu'à 0,54 s sur les cases (donc
au survol, la couleur mettait ~0,7 s à réagir). Corrigé : grille passée de `reveal-stagger` à
`reveal` (fondu en bloc, plus de délai par case) + transition du fond `0,3 s → 0,16 s`. Vérifié :
`background-color / 0.16s / delay 0s`.

---

## Session 2026-09-01 (animations hero — poussé : e896ec7, 7fe434d)
Fait : Animations du hero + fond « soie » animé (demande d'Arthur, réf. Framer "blur-zoom"),
nombreux allers-retours d'ajustement, puis retrait d'une ligne du bloc contact.

### Titre h1 — entrée + carrousel de mots
- Entrée "blur-zoom" mot à mot : `opacity` + `filter: blur` + `transform: scale`, stagger 55 ms/mot,
  easing spring. (`filter: blur` assumé sur ce seul `<h1>`, one-shot, hors règle "transform/opacity
  only" — validé par le choix de l'effet.)
- `heroTitleHTML()` découpe le titre fixe en `<span class="ht-w">` ; le mot variable est **un seul**
  `<span class="ht-rot-w" data-rot-words="…">` dont le JS échange le `textContent` (alignement sur
  la ligne de base garanti, contrairement à un stacking `inline-grid`).
- Partie fixe raccourcie à « …donnent envie de vous » ; `titleAccent = 'faire confiance'` (point de
  coupe). `content.hero.titleAccentWords = ['remarquer','choisir','contacter','connaître','faire
  confiance']` — se déroule **dans cet ordre** (pas de retour au 1er mot), tient 1,65 s/mot, puis
  **se fige sur « faire confiance »**. Le mot **grossit** (`scale 1.16`) en se floutant avant de
  disparaître ; le conteneur transitionne sa **largeur** (`width 0.4s`) vers la largeur mesurée du
  mot entrant → la phrase s'adapte à la taille du mot (verrou relâché une fois figé → responsive).
- Texte HTML initial = mot final (phrase canonique OK sans JS / reduced-motion) ; le JS repart sur
  `[0]` avant la 1re peinture. `<h1 aria-label="…phrase canonique…">`, rotator `aria-hidden`.
  `prefers-reduced-motion` → état final directement, aucune animation. `<noscript>` → visible d'emblée.
- « faire confiance » distingué visuellement : `white-space: nowrap`, **trait qui se dessine dessous**
  (`.ht-rot.ht-final::after`, `scaleX` spring) + dégradé 3 arrêts plus profond
  (`--color-accent-dark → accent → accent-hover`).
- Playfair italic 700 ajouté aux `FONT_PRELOADS` (mot au-dessus de la ligne de flottaison, mesuré
  par JS pour le verrou de largeur → doit être chargé tôt).

### Fond « soie » animé — `silk-bg.js`
- Historique : v1 blobs CSS `radial-gradient` → rejetés par Arthur. v2 finale = **shader WebGL**
  maison (`/silk-bg.js`, aucune dépendance, servi tel quel — CSP `script-src 'self'`). Warp itératif
  de sinusoïdes → plis verts qui coulent sur l'ivoire (recolor de l'effet Framer, hero clair
  conservé — choix d'Arthur).
- Généralisé : gère tous les `<canvas class="silk-canvas">` (attrs `data-dark` / `data-strength`),
  max 4. Décliné sur les **3 surfaces vertes** : hero (`data-strength 1.81`, sur ivoire), **footer**
  (`data-dark 1`, `data-strength 1.2`) et **bloc étude de cas** (`data-dark 1`, `data-strength 1.1`)
  — glints clairs sur vert foncé. `peak` d'opacité : 0,46 (clair) / 0,16 (foncé). Chargé sur toutes
  les pages (footer partout).
- Rendu 0,55× la résolution (effet flou), `powerPreference: 'low-power'`, `preserveDrawingBuffer:
  true` (coût négligeable, desktop seulement, + rend le canvas capturable en screenshot headless).
- Raccords gérés par **`mask-image` CSS** par variante (`--hero` fondu long vers le bas invisible avec
  « Pour qui » ; `--footer` apparaît depuis le haut ; `--case` radial doux). Pas de fondu haut sur le
  hero → la soie passe pleinement **derrière le nav** (transparent au scroll 0).
- Garde-fous : coupé si `prefers-reduced-motion`, onglet caché, élément hors écran
  (`IntersectionObserver` + `rootMargin 120px`), WebGL absent, perte de contexte.
  **Mobile (≤ 640 px)** : bridé (choix d'Arthur, option D) — hero uniquement (pas footer / étude de
  cas), rendu 0,35× la résolution, DPR plafonné à 1. 3 contextes WebGL max sur la home desktop.
- `serve.mjs` : `.js` ajouté à la liste blanche MIME (sinon `/silk-bg.js` → 404 en local ; Vercel
  le sert nativement en prod, `.vercelignore` ne l'exclut pas).

### Divers
- Section Contact : ligne « Zone d'intervention — Angoulême et Charente » retirée du bloc « Mes
  coordonnées » (champs `zone`/`zoneLabel` supprimés de `site-content.mjs`). Le `areaServed` reste
  dans le JSON-LD pour le SEO local.
- `vercel.json` régénéré (hashes CSP à jour). 0 violation CSP vérifiée sur `/`, `/mentions-legales`,
  `/videos-ia`, `/merci`.

## Session précédente
Date : 2026-08-29 (suite 2)
Fait : Ajout d'un dropdown "Solutions" dans le header (desktop : survol/clic + clavier ; mobile :
`<details>` dans le menu burger, même langage visuel que la FAQ) listant les 3 nouvelles offres,
positionné juste avant Contact. Chaque page dédiée (`/videos-ia`, `/contenu-reseaux-sociaux`,
`/audit-site-web`) enrichie de deux sections supplémentaires : "Pourquoi cette approche" (3
bénéfices) et "Questions fréquentes" (FAQ courte, même pattern que la FAQ homepage) — contenu
volontairement générique/factuel (pas de chiffres ni promesses inventées), explicitement pensé
par Arthur pour être retravaillé plus tard.

Bug d'accessibilité anticipé et corrigé en même temps que le dropdown mobile : le piège de focus
du menu mobile comptait tous les `a[href]`/`button` du panneau pour calculer le premier/dernier
élément lors du Tab, y compris les liens à l'intérieur du `<details>` "Solutions" *fermé* (présents
dans le DOM mais pas réellement focusables tant qu'il n'est pas ouvert). Corrigé en filtrant sur
`offsetParent !== null` avant de calculer les bornes du piège de focus — vérifié par Puppeteer.

Session précédente (même journée) : correction "8e prestation" (grille 2 colonnes ne laissait pas
de case vide), puis élargissement de l'offre au-delà du site internet, à la demande d'Arthur.

**Audit stratégique fait avant tout code** (positionnement, risques de dilution, repères de marché
vidéo immobilière) puis 3 tours de clarification avec Arthur pour converger sur :
- **3 nouvelles offres**, toutes sur devis (pas de prix affiché) : Vidéos IA de présentation
  (trailer généré par IA à partir de photos — immobilier en usage phare, extensible artisans/
  commerçants), Contenu réseaux sociaux courts (IA-assisté), Audit de site existant.
- **Intégration double** : section teaser sur la home (juste avant Contact) **+** une page dédiée
  par offre (`/videos-ia`, `/contenu-reseaux-sociaux`, `/audit-site-web`), toutes deux demandées
  par Arthur plutôt qu'une seule des deux options proposées.
- Contenu (titres, intro, "pour qui", étapes, tarif) rédigé et validé avec Arthur *avant* d'écrire
  le moindre code — même logique que pour la direction artistique du départ.

Réalisé côté code :
- `content/site-content.mjs` : nouveau bloc `digitalSolutions` (3 items, copie complète) ; 3
  nouvelles options ajoutées au menu déroulant "Type de projet" du formulaire de contact.
- `build.mjs` : `digitalSolutionsSection()` (teaser homepage, juste avant Contact),
  `buildSolutionPage()` (générateur générique de page par offre, JSON-LD `Service` dédié via
  `serviceJsonLd()`), colonne "Solutions" ajoutée au footer, 3 pages ajoutées au sitemap.
- `styles/main.css` : `.solution-teaser-grid`/`.solution-card` (cartes homepage),
  `.solution-page`/`.solution-intro`/`.solution-block` (mise en page des pages dédiées),
  `.notice-box` (encart transparence IA), `.dash-list` (liste "pour qui"), `.steps--three`
  (variante 3 colonnes — la même grille `.steps` que "Comment ça se passe" est réutilisée pour
  "Comment ça marche", mais avec 3 étapes au lieu de 4 : sans ce modificateur, même problème de
  case vide que celui corrigé sur les prestations).

**Bug réel trouvé et corrigé au passage** : les liens d'ancre partagés (nav, CTA hero, CTA mobile
sticky — `#contact`, `#prestations`, etc.) étaient relatifs à la page courante. Sur les pages
légales (et maintenant sur les 3 nouvelles pages), cliquer sur "Demander un devis" ou "Prestations"
ne faisait donc rien (pas d'élément `#contact` sur ces pages). Corrigé en préfixant ces hrefs par
`/` (`/#contact`) dans `content/site-content.mjs` — fonctionne aussi bien depuis la home (pas de
rechargement, comportement inchangé) que depuis n'importe quelle autre page. Vérifié par clic
Puppeteer réel depuis `/mentions-legales`.

**Autre correctif (confort de dev, pas un bug de prod)** : `serve.mjs` ne relisait `vercel.json`
(donc la CSP) qu'au démarrage. Un `node build.mjs` pendant que le serveur tourne (ex. après avoir
modifié `styles/main.css`) changeait le hash CSP du `<style>` sans que le process serveur, encore
sur l'ancienne CSP, ne le sache — le navigateur bloquait alors le style inline (page qui s'affiche
sans mise en forme). `serve.mjs` relit maintenant `vercel.json` à chaque requête (coût négligible,
fichier local) : un rebuild pendant que le serveur tourne prend effet immédiatement, plus besoin de
relancer `node serve.mjs` à la main.

Vérifié : build sans erreur, 0 violation CSP sur les 8 pages (5 précédentes + 3 nouvelles), les 3
nouvelles pages répondent 200, sitemap à jour, dropdown du formulaire à jour, captures desktop +
mobile de la section teaser, du footer et d'une page dédiée (`/videos-ia`) — design cohérent avec
le reste du site, grille "Comment ça marche" bien à 3 colonnes sans case vide.

## État actuel du projet
- Pages terminées : index.html (avec section "Au-delà du site internet"), mentions-legales,
  confidentialite, **videos-ia, contenu-reseaux-sociaux, audit-site-web** (nouvelles), merci, 404,
  sitemap.xml, robots.txt, vercel.json (généré)
- En cours : aucune
- Non commencé : témoignage client (placeholder encore visible), micro-copie « Réalisations »
  au pluriel (signalée comme discutable dans le brief précédent, toujours pas tranchée)

## Outils configurés
- [x] GitHub → https://github.com/Avetisiana/MyWebsite.git (branche `main`, à jour — durcissement
  technique + 3 offres digitales + animations hero + soie mobile + refonte tarifs, tous poussés)
- [ ] Vercel → pas encore connecté à ce repo
- [ ] Domaine → non configuré (`SITE_URL` retombe sur `https://monsiteaa.vercel.app`, noindex)
- [ ] Google Search Console → non configuré
- [ ] Google Analytics → non configuré (`content.meta.gaId`)
- [x] Formulaire de contact → Formsubmit + fetch progressif, dropdown à jour avec les 3 nouvelles offres
- [ ] CMS → non configuré

## Ce qui reste à faire
- Connecter le repo à un projet Vercel
- Renseigner `content.meta.domain` (vrai domaine) puis rebuild → bascule auto index/noindex
- Renseigner `content.meta.gaId` une fois Google Analytics créé
- Compléter les pages légales : nom complet, statut juridique, SIRET, adresse, date de MAJ
- Après la première soumission réelle du formulaire : remplacer l'email en clair dans
  `content.contact.form.action` par l'alias Formsubmit
- Ajouter le témoignage client du Cabinet Laperonnie
- Décider si le libellé nav « Réalisations » doit rester au pluriel
- Trancher si d'autres offres digitales viendront s'ajouter plus tard (Google Business Profile,
  identité visuelle légère — évoquées puis mises de côté pour ne pas disperser l'offre pour l'instant)
- Une fois la 1re mission "vidéo IA" / "audit" / "réseaux sociaux" réalisée : envisager d'objectiver
  une fourchette de prix indicative si le sur-devis pur freine la conversion
- Relire le contenu "Pourquoi cette approche" et "Questions fréquentes" des 3 pages solutions
  (`content.digitalSolutions.items[].benefits` / `.faq` dans `content/site-content.mjs`) — rédigé
  volontairement générique, à affiner une fois les premières missions réalisées

## Points d'attention
- `to-ico` (devDependency, génère favicon.ico) remonte des vulnérabilités `npm audit` — outil de
  build local uniquement, jamais servi en prod, sans impact sur le site déployé.
- Le générateur d'assets (`scripts/gen-assets.mjs`) doit être relancé si `images/cabinet-laperonnie-1200.jpg`
  ou `favicon.svg` changent, avant `node build.mjs`.
- `vercel.json` est entièrement généré (commentaire en tête du code source de `build.mjs`, pas dans
  le JSON lui-même) : ne jamais l'éditer à la main.
- L'offre "vidéos IA" est explicitement présentée comme générée par IA sur sa page dédiée (encart
  dédié) — choix assumé avec Arthur pour la transparence vis-à-vis des clients de ses clients
  (biens immobiliers notamment).
