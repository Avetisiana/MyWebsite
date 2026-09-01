# STATUS.md — [MOI]

## Dernière session
Date : 2026-09-01
Fait : Animations du hero + fond « soie » animé (demande d'Arthur, réf. Framer "blur-zoom"),
nombreux allers-retours d'ajustement, puis retrait d'une ligne du bloc contact. **Poussé sur
GitHub** à la fin de la session.

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
  technique + 3 offres digitales + animations hero/soie tous poussés)
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
