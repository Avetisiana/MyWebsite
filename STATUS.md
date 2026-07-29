# STATUS.md — [MOI]

## Dernière session
Date : 2026-07-29
Fait : Direction artistique validée avec Arthur (vert sapin feutré + Playfair Display/Montserrat, hero éditorial pur, wordmark "Arthur Avetisian"). Construction complète du site vitrine one-page + pages annexes : content/site-content.mjs (contenu séparé), styles/main.css (design system), build.mjs (générateur statique sans dépendance). Toutes les sections du brief sont en place : nav, hero, pour qui, prestations, étude de cas Cabinet Laperonnie (avec lien réel https://laperonnie-avocat.fr/), tarifs (3 forfaits), déroulé en 4 étapes, FAQ (6 questions), contact (Formsubmit), footer. Bannière cookie RGPD + GA consent-gated + CTA sticky mobile + menu mobile en place. Vérifié en 2 passes desktop (1440px) et mobile (390px) via screenshots, bugs trouvés et corrigés : wrap du prix Premium, z-index du menu mobile sous la bannière cookie/CTA, absence de scroll-margin-top sur les ancres de nav.

## État actuel du projet
- Pages terminées : index.html (one-page complet), mentions-legales.html (gabarit), confidentialite.html (gabarit), merci.html, 404.html, sitemap.xml, robots.txt
- En cours : aucune (site fonctionnel, en attente des infos réelles d'Arthur pour finaliser)
- Non commencé : capture d'écran + témoignage client pour la section étude de cas (emplacements prêts)

## Outils configurés
- [ ] GitHub → [https://github.com/Avetisiana/MyWebsite.git] (pas encore pushé — attente accord explicite d'Arthur)
- [ ] Vercel → [url de déploiement]
- [ ] Domaine → non configuré (placeholder `https://DOMAINE-A-DEFINIR.fr` dans meta/canonical/JSON-LD/sitemap)
- [ ] Google Search Console → non configuré
- [ ] Google Analytics → non configuré (placeholder `[GA_MEASUREMENT_ID]`, script consent-gated déjà en place)
- [x] Formulaire de contact → configuré techniquement (Formsubmit), placeholder `[MON_EMAIL]` à remplacer
- [ ] CMS → non configuré

## Ce qui reste à faire
- Remplacer les placeholders : `[MON_EMAIL]`, `[TELEPHONE_A_COMPLETER]` / `[Téléphone à compléter]`, `[GA_MEASUREMENT_ID]`, domaine final
- Compléter mentions-legales.html une fois le SIRET obtenu (`[Nom complet à compléter]`, `[SIRET à compléter]`, `[Adresse à compléter]`, `[DATE_A_COMPLETER]`)
- Compléter confidentialite.html de la même façon
- Ajouter la capture d'écran du Cabinet Laperonnie (remplacer le cadre `.screenshot-frame`) + témoignage client
- Une fois une image réelle ajoutée : l'entourer d'un `<picture><source type="image/avif">` (règle PERFORMANCE)
- Décider si le favicon SVG placeholder (monogramme "AA") convient ou doit être remplacé par un vrai logo

## Points d'attention
- Le port 3000 était déjà occupé par un autre serveur Node (probablement le vrai site du Cabinet Laperonnie, lancé la veille) — je n'y ai pas touché. `serve.mjs` accepte maintenant un port optionnel en argument (`node serve.mjs 3001`), 3000 reste la valeur par défaut si libre.
- `puppeteer` n'était pas installé (pas de package.json au départ) — installé via `npm install puppeteer`, `package.json`/`package-lock.json`/`node_modules/` créés. `node_modules/` et `temporary screenshots/` ajoutés au nouveau `.gitignore`.
- `screenshot.mjs` étendu : accepte désormais largeur/hauteur en arguments (pour le mobile 390px) et un mode `full` qui scrolle automatiquement la page avant capture (nécessaire car les animations reveal-on-scroll restent à opacity:0 tant qu'elles n'ont pas été vues).
- Aucun push effectué — dépôt local uniquement, comme demandé.
