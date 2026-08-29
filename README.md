# Arthur Avetisian — site vitrine

Site 100 % statique (aucun framework, aucune dépendance côté navigateur). Le CSS est inliné dans
chaque page HTML générée ; il n'y a jamais de Tailwind CDN ni de bibliothèque externe.

## Stack & principe

Le contenu est séparé du template : on ne modifie jamais les `.html` à la racine à la main, ils
sont **entièrement régénérés** à chaque `node build.mjs`.

```
content/site-content.mjs   → tous les textes du site (un seul fichier)
styles/main.css            → design system (couleurs, typo, composants) + @font-face
build.mjs                  → génère les pages HTML + vercel.json à partir des deux fichiers ci-dessus
scripts/gen-assets.mjs     → génère les images responsives, l'image OG et les favicons (fichiers binaires)
serve.mjs                  → serveur local de dev (cleanUrls, en-têtes de sécurité, 404 réel)
screenshot.mjs             → capture d'écran Puppeteer (desktop/mobile) pour vérification visuelle
```

Sortie générée par `build.mjs` (committée, jamais éditée à la main) :
`index.html`, `mentions-legales.html`, `confidentialite.html`, `merci.html`, `404.html`,
`sitemap.xml`, `robots.txt`, **`vercel.json`**.

`vercel.json` est entièrement généré (en-têtes de sécurité, cache, Content-Security-Policy à base
de hashes SHA-256 calculés sur le contenu inline réel). Ne jamais l'éditer à la main : toute
modification manuelle sera écrasée au prochain `node build.mjs`.

## Commandes

```bash
npm install              # une fois, installe puppeteer/sharp/to-ico (devDependencies)
node scripts/gen-assets.mjs   # images responsives + image OG + favicons (à relancer si l'image
                               #   source images/cabinet-laperonnie-1200.jpg ou favicon.svg change)
node build.mjs            # génère les pages HTML + vercel.json
node serve.mjs [port]     # sert le site en local (défaut : port 3000)
node screenshot.mjs http://localhost:3000 [label] [largeur] [hauteur] [full]
```

## Déploiement (Vercel)

- Statique, build fait en local et committé : Vercel n'a rien à builder, il sert les fichiers tels quels.
- `.vercelignore` exclut tout le non-public (`build.mjs`, `content/`, `styles/`, `scripts/`, `*.md`,
  `package.json`, `node_modules/`, etc.) — sans ça, ces fichiers étaient servis publiquement
  (ex. `/build.mjs`, `/CLAUDE.md` répondaient 200 avant correction).
- `cleanUrls: true` dans `vercel.json` : les pages sont accessibles sans `.html`
  (`/mentions-legales`, `/confidentialite`, `/merci`).
- Le domaine de preview actuel (`https://monsiteaa.vercel.app`) est en **`noindex, follow`** tant que
  `content.meta.domain` reste le placeholder `DOMAINE-A-DEFINIR.fr`. Dès que le vrai domaine est
  renseigné dans `content/site-content.mjs` puis qu'un `node build.mjs` est relancé, canonical,
  og:url, JSON-LD, sitemap et l'indexation basculent **automatiquement** sur `index, follow`.

## Placeholders à compléter avant la mise en production

Tous dans `content/site-content.mjs` sauf mention contraire — chercher `[…]` ou `DOMAINE-A-DEFINIR` :

- `content.meta.domain` — domaine final (actuellement le placeholder, le site tourne sur l'URL de
  preview Vercel en attendant)
- `content.meta.gaId` — identifiant Google Analytics (`[GA_MEASUREMENT_ID]`). Tant qu'il contient
  `[`, aucune requête n'est faite vers Google et la bannière cookies ne s'affiche même pas.
- Mentions légales (`build.mjs`, fonction `buildMentionsLegales`) : nom complet, statut juridique,
  SIRET, adresse, date de mise à jour (`[DATE_A_COMPLETER]`, partagé avec la page Confidentialité)
- Confidentialité (`build.mjs`, fonction `buildConfidentialite`) : nom complet, adresse
- Témoignage client du Cabinet Laperonnie (`content.caseStudy.testimonialPlaceholder`)
- Formsubmit (voir ci-dessous) : remplacer l'email en clair par l'alias fourni après activation

### Formsubmit

Le formulaire pointe vers `https://formsubmit.co/arthur.avetisian@hotmail.com`. Formsubmit exige
une activation à la toute première soumission (email de confirmation à cliquer). **Après
activation**, remplacer cette URL par l'alias aléatoire fourni par Formsubmit
(`content.contact.form.action`) pour ne plus exposer l'adresse email en clair dans le HTML.

## Sécurité (résumé)

- CSP stricte sans `'unsafe-inline'` : les 3 blocs inline partagés (style principal, script GA,
  script de comportement) sont autorisés par hash SHA-256, calculés au build. Le JSON-LD (contenu
  différent par page) obtient lui aussi un hash par page — sinon les navigateurs bloquent son
  exécution avec une CSP stricte.
- En-têtes de sécurité (HSTS, X-Frame-Options, Permissions-Policy, etc.) appliqués à toutes les
  routes via `vercel.json`, et mirroités par `serve.mjs` en local (même source : `serve.mjs` lit
  `vercel.json` au démarrage).
- Polices auto-hébergées (`/fonts/`, licence OFL incluse) : plus de hotlink vers Google Fonts, qui
  transmettait l'IP du visiteur à Google sans consentement.
- `npm audit` remonte des vulnérabilités dans `to-ico` (dépendance ancienne). C'est un outil de
  build exécuté uniquement en local pour générer `favicon.ico` — il ne fait jamais partie du site
  déployé et ne tourne jamais côté visiteur.
