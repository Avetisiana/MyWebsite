# STATUS.md — [MOI]

## Dernière session
Date : 2026-07-29
Fait : Premier push GitHub effectué (branche `main`). Depuis, audit de conformité contre le cahier des charges technique : JSON-LD Schema.org manquait sur 4 pages sur 5 (seul index.html l'avait) → ajouté un schema `WebPage` sur mentions-legales.html, confidentialite.html, merci.html et 404.html. CSS pas strictement mobile-first (2 règles en `max-width` desktop-first) → refactorisé en mobile-first pur (base mobile + `min-width`), sans régression visuelle vérifiée par re-screenshot. Coordonnées réelles intégrées : téléphone 06 46 45 69 25 (href tel:+33646456925) et email arthur.avetisian@hotmail.com, remplacés partout (footer, contact, mentions légales, Formsubmit). Capture d'écran réelle du site https://laperonnie-avocat.fr/ prise via Puppeteer, convertie en AVIF (33KB) + JPEG fallback 1200px (76KB) via `sharp`, intégrée dans la section étude de cas avec `<picture><source type="image/avif">`. Deuxième push effectué avec toutes ces corrections.

## État actuel du projet
- Pages terminées : index.html (one-page complet, conforme SEO/mobile-first/RGPD), mentions-legales.html (gabarit), confidentialite.html (gabarit), merci.html, 404.html, sitemap.xml, robots.txt
- En cours : aucune
- Non commencé : témoignage client pour la section étude de cas (emplacement prêt, texte placeholder encore visible)

## Outils configurés
- [x] GitHub → https://github.com/Avetisiana/MyWebsite.git (pushé, branche `main`)
- [ ] Vercel → [url de déploiement]
- [ ] Domaine → non configuré (placeholder `https://DOMAINE-A-DEFINIR.fr` dans meta/canonical/JSON-LD/sitemap)
- [ ] Google Search Console → non configuré
- [ ] Google Analytics → non configuré (placeholder `[GA_MEASUREMENT_ID]`, script consent-gated déjà en place)
- [x] Formulaire de contact → configuré (Formsubmit vers arthur.avetisian@hotmail.com)
- [ ] CMS → non configuré

## Ce qui reste à faire
- Remplacer les derniers placeholders : `[GA_MEASUREMENT_ID]`, domaine final (`DOMAINE-A-DEFINIR.fr` → vrai domaine une fois acheté)
- Compléter mentions-legales.html une fois le SIRET obtenu (`[Nom complet à compléter]`, `[SIRET à compléter]`, `[Adresse à compléter]`, `[DATE_A_COMPLETER]`)
- Compléter confidentialite.html de la même façon
- Ajouter le témoignage client du Cabinet Laperonnie (le cadre `.testimonial-frame` a encore le texte placeholder)
- Décider si le favicon SVG placeholder (monogramme "AA") convient ou doit être remplacé par un vrai logo

## Points d'attention
- Git n'avait pas d'identité configurée sur cette machine → configuré en global (`user.name`/`user.email`) avec l'accord explicite d'Arthur ; s'applique à tous ses dépôts locaux, pas seulement celui-ci.
- Le port 3000 était déjà occupé par un autre serveur Node (probablement le vrai site du Cabinet Laperonnie) — non touché. `serve.mjs` accepte un port optionnel (`node serve.mjs 3001`), 3000 reste la valeur par défaut si libre.
- `sharp` ajouté en devDependency pour la conversion AVIF (installe proprement sur cette machine, binaires précompilés). Réutilisable pour toute future image du site.
- `screenshot.mjs` accepte largeur/hauteur/label et un mode `full` qui scrolle automatiquement la page avant capture (nécessaire pour que les animations reveal-on-scroll soient visibles sur les captures pleine page).
- La capture du Cabinet Laperonnie est un screenshot réel de leur site en ligne (propre réalisation d'Arthur, utilisée en toute légitimité comme preuve de portfolio) ; à rafraîchir si leur site change significativement.
