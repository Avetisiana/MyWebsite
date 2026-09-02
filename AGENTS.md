# AGENTS.md — [MOI] — [ArthurAvetisian.fr]

## Début de session (automatique)
- Lire `STATUS.md` pour connaître l'état du projet à la fin de la dernière session
- Lire les 5 derniers commits : `git log --oneline -5`
- Résumer brièvement l'état du projet en une phrase avant de commencer

## Toujours faire en premier
- Invoquer le skill `frontend-design` avant d'écrire du code frontend, chaque session.
- Si tu as des questions avant de commencer, me les poser plutôt qu'assumer.
- Tu peux lancer des sous-agents (Agent tool) pour des tâches parallèles si utile.

## Stack technique
- Site 100% statique HTML — tout le CSS est inline dans chaque fichier HTML
- Pas de framework JS, **jamais de Tailwind CDN** (inutilisé et coûte ~400KB/page)
- Serveur local : `node serve.mjs` (port 3000)
- Commande screenshot : `node screenshot.mjs http://localhost:3000`

## Lecture de fichiers — efficacité
- Utiliser grep/glob pour localiser avant de lire (jamais lire un fichier entier si la cible est connue)
- Lire par plage de lignes : `offset` + `limit` sur les gros fichiers (index.html, build.mjs)
- Si une valeur est déjà connue (ligne d'une fonction, position d'un style), la cibler directement

## Serveur local
- Toujours servir sur localhost — jamais screenshoter un URL file:///
- Démarrer `node serve.mjs` en arrière-plan avant toute capture
- Si le serveur tourne déjà, ne pas en lancer un second

## Screenshots
- Screenshot depuis localhost uniquement : `node screenshot.mjs http://localhost:3000`
- Les screenshots s'enregistrent dans `./temporary screenshots/screenshot-N.png` (auto-incrémenté)
- Label optionnel : `node screenshot.mjs http://localhost:3000 mobile`
- Après screenshot, lire le PNG avec l'outil Read — Codex voit l'image directement
- Comparer en étant précis : "le titre fait 32px mais devrait faire 24px"
- Vérifier : espacement, taille de police, couleurs (hex exact), alignement, border-radius, ombres
- Changement mineur (couleur, espacement, texte) → 1 screenshot suffit
- Changement de layout ou nouveau composant → 2 passes de comparaison

## Brand Assets
- Toujours vérifier le dossier `brand_assets/` avant de designer
- Si logo présent → l'utiliser, pas de placeholder
- Si palette de couleurs définie → utiliser ces valeurs exactes, ne pas inventer

## Règles de design (anti-générique)
- **Couleurs** : ne jamais utiliser la palette Tailwind par défaut (indigo-500, blue-600...).
  Choisir une couleur de marque sur mesure et dériver depuis elle.
- **Ombres** : jamais de shadow-md plat. Ombres multicouches, teintées, faible opacité.
- **Typographie** : associer un display/serif avec un sans. Tracking serré (-0.03em) sur grands
  titres, interligne généreux (1.7) sur le corps. Police du titre ≠ police du texte.
- **Gradients** : superposer plusieurs gradients radiaux. Ajouter texture via filtre SVG noise.
- **Animations** : uniquement transform et opacity. Jamais transition-all. Easing spring.
- **États interactifs** : hover + focus-visible + active sur chaque élément cliquable. Sans exception.
- **Images** : overlay gradient (from-black/60) + couche couleur avec mix-blend-multiply.
- **Espacement** : tokens cohérents, pas de valeurs aléatoires.
- **Profondeur** : système de calques (base → élevé → flottant).

## Images de référence (si le client en fournit)
- Reproduire exactement : layout, espacement, typographie, couleurs.
- Ne pas améliorer, ne pas ajouter.
- Screenshots → comparaison → corrections → re-screenshot. Minimum 2 passes.

## SEO — Obligatoire sur chaque page HTML
- `<meta name="description">` avec ville + métier (max 160 caractères)
- `<link rel="canonical" href="https://[domaine-final.fr]/[page]">`
- `<meta name="robots" content="index, follow">`
- `<meta property="og:title">`, `og:description`, `og:url`, `og:type`
- JSON-LD Schema.org adapté au métier (LocalBusiness, LegalService, etc.)
- Google Analytics (CNIL) : script consent-gated dans `<head>` (GA se charge uniquement après Accepter) + bannière cookie consent (Refuser/Accepter) + choix en localStorage — jamais de tag GA direct sans consentement
- sitemap.xml à la racine listant toutes les pages
- robots.txt autorisant tout sauf /admin/ et /merci.html

## Éléments obligatoires dans chaque site
- Mentions légales (nom/SIRET/adresse/hébergeur Vercel)
- Page Confidentialité RGPD (si formulaire ou analytics) — section 7 doit décrire honnêtement les cookies
- Numéro de téléphone cliquable : `<a href="tel:+33...">`
- Page merci.html (après soumission formulaire)
- Page 404.html personnalisée (servie automatiquement par Vercel sur toute URL introuvable)
- Footer avec Mentions légales + Confidentialité + Copyright [ANNÉE]
- Favicon (même simple)
- Bannière cookie consent RGPD (obligatoire si Google Analytics ou tout autre tracking)

## Push GitHub — mise à jour STATUS.md (automatique)
Avant chaque push sur GitHub, mettre à jour `STATUS.md` avec :
- Ce qui a été fait dans cette session
- État actuel du projet (pages terminées, en cours, en attente)
- Ce qui reste à faire
- Blocages ou points d'attention éventuels
Le push inclut toujours STATUS.md mis à jour.

## Performance — à appliquer sur chaque projet
- Si `PERFORMANCE.md` est présent dans le projet : le lire en début de session
- Images : générer AVIF + entourer chaque `<img>` dans un `<picture><source type="image/avif">`
- Formulaires : chaque `<label>` a `for="id"` lié à `id="id"` sur l'input
- Bibliothèques JS >100KB : lazy-loader via IntersectionObserver, jamais dans `<head>`
- Mobile : screenshoter à 390px avant chaque push — vérifier titres serif sans débordement

## Règles absolues
- Ne jamais ajouter de sections ou fonctionnalités non demandées
- Ne jamais "améliorer" un design de référence — le reproduire
- Ne jamais s'arrêter après un seul screenshot
- **Ne jamais push sur GitHub sauf si Arthur le demande explicitement**
- Toujours vérifier desktop ET mobile après chaque modification
- Si bloqué ou dans le doute : me demander avant d'agir