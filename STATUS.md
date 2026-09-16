# STATUS.md — [MOI]

## Session 2026-09-16 — mise en ligne : indexation Google + audit sécurité (poussée)

**Mise à jour après retour d'Arthur :**
- Google Search Console validée (TXT `google-site-verification` présent dans la zone OVH).
- Formulaire Formsubmit activé.
- Redirection `www.deux-as.fr` → `deux-as.fr` passée en 308 dans Vercel (vérifié en direct).
- Poussé avec le lot « transparence hébergement / maintenance » de la session parallèle.
- **Google Analytics activé** (`G-7GG622YVYK`, propriété « deux-as.fr » du compte Deux-As) :
  bannière Refuser/Accepter, GA chargé seulement après accord et seulement sur `deux-as.fr`
  (jamais en local ni sur les previews), bouton « Gérer les cookies » dans le footer, section 7
  de la confidentialité et CSP passées automatiquement en version « Analytics ». Poussé seul,
  sans le 2ᵉ lot de formulations hébergement/maintenance de la session parallèle (resté non commité).
  Réglages GA conseillés à Arthur : conservation 14 mois, Signaux Google désactivés.
- Reste ouvert :
  - infos légales (`content.legal`) ;
  - dans Search Console : envoyer le sitemap et demander l'indexation ;
  - alias Formsubmit (facultatif) ;
  - passage du dépôt en privé + Vercel Pro (usage commercial) — un seul abonnement Pro couvre tous
    les projets de l'équipe.

- **Audit du site en ligne (OK)** : le HTML servi par `deux-as.fr` est identique au dépôt.
  - http → https en 308, TLS 1.2/1.3 uniquement (1.0/1.1 refusés), certificat Let's Encrypt valide.
  - HSTS, CSP stricte sans `unsafe-inline`, X-Frame-Options, nosniff, Permissions-Policy en place.
  - Une trentaine de chemins sensibles testés (`.git`, `build.mjs`, `package.json`, `content/`,
    `prospection/`…) : tous en 404.
  - DNS : DNSSEC actif, SPF + DKIM (2 sélecteurs OVH) + DMARC `p=none` présents.
  - Aucune dépendance npm en production (vulnérabilités uniquement dans les outils de build locaux).
  - Le classeur Drive dont l'ID figure dans ce fichier est privé (propriétaire seul).
  - SEO de chaque page OK : title, description, canonical, robots, OG, un seul H1, JSON-LD valide.
- **Bug critique corrigé — formulaire de contact** : le `fetch` visait l'endpoint classique de
  Formsubmit, qui répond 200 (CORS ouvert) avec sa page reCAPTCHA → redirection vers `/merci` alors
  que rien n'était envoyé. Désormais : endpoint `/ajax/`, redirection seulement si
  `success === "true"`, sinon repli sur l'envoi natif (reCAPTCHA). Anti double envoi, bouton
  `:disabled`, réinitialisation au retour arrière. Testé avec 4 réponses Formsubmit simulées.
- **Cookies / RGPD** :
  - la page confidentialité annonçait Google Analytics alors qu'il n'est pas configuré ; la
    section 7 dépend maintenant de `GA_CONFIGURED` (sans GA : « aucun cookie ») ;
  - la page a été complétée (bases légales, prestataires Formsubmit/OVHcloud/Vercel, conservation
    3 ans — **durée à valider par Arthur**, droits complets) ;
  - bouton « Gérer les cookies » et bannière rendus seulement si GA est configuré ;
  - consentement horodaté, valable 6 mois (`window.__consent`) ; un refus supprime les cookies `_ga*` ;
  - branche « GA configuré » testée avec un ID factice.
- **Mentions légales** :
  - infos centralisées dans `content.legal` (mentions, confidentialité, en-tête de
    `/exemple-devis`), avec un avertissement au build tant qu'un champ contient `[` ;
  - adresse Vercel mise à jour (440 N Barranca Ave #4133, Covina) et téléphone de l'hébergeur ajouté
    (+1 559 288 7060, numéro repris des mentions d'autres sites — pas publié par Vercel lui-même).
- **Durcissement** :
  - CSP : les domaines Google ne sont autorisés que si GA est configuré ;
  - `vercel.json` : `monsiteaa.vercel.app` redirige en 308 vers `https://deux-as.fr` (contenu dupliqué) ;
  - `.vercelignore` exclut aussi `prospection/`, `outputs/`, `.artifact-work/` et `ui_design/`.
- **Autres corrections** :
  - `contenu-reseaux-sociaux` : ville ajoutée à la meta description ;
  - bug signalé par la session parallèle corrigé : `.legal-page a:not(.btn)`, le bouton
    « Demander mon devis » de `/exemple-devis` est de nouveau visible.
- Vérifié après rebuild :
  - 9 pages : 0 erreur console/CSP, 0 requête externe, 0 cookie ;
  - `check-configurator` : 0 échec ;
  - captures 1440 px et 390 px (mentions légales, confidentialité, CTA de l'exemple de devis).
  - PageSpeed Insights non mesuré (quota de l'API anonyme épuisé).
- **En attente d'Arthur (bloquant pour la livraison)** :
  1. Infos légales dans `content.legal` : nom, statut, SIRET, adresse, date (actuellement
     `[… à compléter]` **visibles en ligne**).
  2. Accord pour commit + push (= déploiement).
  3. Google Search Console : propriété **Domaine** `deux-as.fr`, TXT de validation dans la zone
     OVH, puis envoi de `https://deux-as.fr/sitemap.xml` et demande d'indexation.
  4. Après déploiement : envoi réel du formulaire + clic sur l'e-mail d'activation Formsubmit,
     puis remplacer l'e-mail de `content.contact.form.action` par l'alias fourni.
  5. Vercel → Domains → `www.deux-as.fr` : redirection actuellement en **307**, à passer en **308**.
  6. Dépôt GitHub `Avetisiana/MyWebsite` **public** (STATUS.md, étude tarifaire, CLAUDE.md
     lisibles) → recommandé de le passer en privé.
  7. Google Analytics souhaité ? Si oui, renseigner `content.meta.gaId` (`G-…`).
- **Points d'attention** :
  - l'offre Vercel « Hobby » interdit l'usage commercial ;
  - enregistrement DNS `ftp` inutile chez OVH ;
  - DMARC à durcir (`p=quarantine`) après lecture des rapports ;
  - Google Business Profile recommandé pour la recherche locale.

## Session 2026-09-16 — transparence hébergement / maintenance (poussée avec la session mise en ligne)

- Message central : le site est livré clé en main, **sans contrat de maintenance obligatoire** ;
  seul l'hébergement continue (`89 €/an`, montant unique dans `HOSTING_FEE` en tête de
  `content/site-content.mjs`, interpolé partout où il apparaît). Décision d'Arthur : il garde
  l'hébergement de son côté (compte Vercel), le nom de domaine reste au nom du client.
- Rapport de marché fait avant tout changement (prix constatés 100-300 €/mois chez les agences,
  causes réelles du non-équipement des TPE, coût réel Vercel Pro mutualisable) — a servi à motiver
  le choix du montant et la séparation hébergement / maintenance.
- Contenu mis à jour : `proof.stats` (nouvelle carte « Sans contrat »), `proof.details`,
  `prestations` (pilier 4), `configurator.aftercareIntro`, `configurator.maintenance` renommée
  *Maintenance (modifications & support)* — ne mentionne plus l'hébergement, `configurator.panel`
  (note + disclaimer), 2 entrées FAQ réécrites + 1 nouvelle (« Suis-je obligé de prendre un
  contrat de maintenance ? »). `build.mjs` : note + modalité de `/exemple-devis` alignées.
- Calculateur du configurateur non touché (mêmes `id`/`price`/`unit` sur `maintenance`) —
  `node scripts/check-configurator.mjs` repasse à 0 échec après coup.
- Vérifié desktop + mobile : section « Mes engagements », bloc « Après la livraison », FAQ ouverte,
  page `/exemple-devis`. Un premier libellé (« Sans abonnement ») cassait sur 3 lignes en grille
  mobile 2 colonnes — remplacé par « Sans contrat » (même longueur que les autres cartes).
- **Bug préexistant repéré en vérifiant, sans rapport avec ce changement** : sur `/exemple-devis`,
  le bouton « Demander mon devis » (`.btn.btn-primary` dans `.devis-cta-line`) est invisible —
  texte et fond de la même couleur verte. Cause : `.legal-page a { color: var(--color-accent) }`
  (spécificité `0,1,1`) l'emporte sur `.btn-primary { color: var(--color-bg) }` (`0,1,0`) parce que
  le bouton est un lien à l'intérieur de `.legal-page`. Pas corrigé — signalé à Arthur, en pause le
  temps qu'une session en parallèle (démarrage/sécurité/GA) touche aussi `styles/main.css`.
- **Coordination** : une autre session (monsite-83) travaillait en parallèle sur `build.mjs` /
  `content/site-content.mjs` (bloc `legal`, formulaire, cookies/GA, CSP, `vercel.json`). Une de mes
  modifications (le pilier 4 de `prestations`) a été perdue pendant une restauration temporaire de
  leur côté puis réappliquée après vérification croisée de chaque changement. Rien commité/poussé.

## Session 2026-09-16 — renommage « Deux As » (non poussée)

- Nom commercial changé partout : `content.meta.siteName`, `content.meta.title`,
  `content.nav.logo` → **« Deux As »** (`Arthur Avetisian` ne restait déjà que dans le nom/logo,
  aucun texte de la page ne se nommait lui-même — le reste du site n'a donc pas eu à changer).
  Tout ce qui dérive de `nav.logo` a suivi automatiquement : `<title>`, `og:site_name`,
  `og:image:alt`, `<h3>` du footer, copyright, titres des pages (Merci, 404, mentions légales,
  confidentialité, pages Solutions, exemple de devis).
- **JSON-LD corrigé plutôt que simplement renommé** : `founder` référençait `nav.logo` (donc
  aurait fini par dire qu'une personne s'appelle « Deux As »). Ajout de `content.meta.founderName
  = 'Arthur Avetisian'`, utilisé uniquement pour ce champ — `Deux As` reste le nom de l'entité
  (`ProfessionalService`), Arthur en reste le fondateur (`Person`) dans les données structurées.
- **Assets visuels régénérés** (`node scripts/gen-assets.mjs`) après mise à jour des sources :
  monogramme `favicon.svg` et `apple-touch-icon` : `AA` → `DA` ; image OG (`og/og-default.png`) :
  `<h1>Arthur Avetisian</h1>` → `<h1>Deux As</h1>`. `manifest.webmanifest` (`name`/`short_name`)
  mis à jour de la même façon (nom affiché si le site est ajouté à l'écran d'accueil mobile).
- Fichiers de projet (non visibles sur le site) alignés par cohérence : `package.json`
  (`name`/`description`), `README.md`, commentaire d'en-tête de `styles/main.css`.
- Vérifié : recherche exhaustive de `Arthur Avetisian` dans tout le dépôt (hors `prospection/`,
  `outputs/`, `.artifact-work/`, `brand_assets/`, `ui_design/`) — après rebuild, **la seule
  occurrence restante dans le HTML généré est le `founder` du JSON-LD**, ce qui est voulu.
  Captures desktop (1440 px) et mobile (390 px, y compris le panneau menu ouvert) du header et
  du footer, plus l'image OG et le monogramme (icon-512, apple-touch-icon) : aucun débordement,
  bon centrage. 0 erreur console/CSP sur 8 pages.
- Domaine, e-mail et légal restent séparés de ce renommage : `mentions-legales.html` garde ses
  `[Nom complet à compléter]` / `[SIRET à compléter]` — la raison sociale légale exacte de
  « Deux As » (SIRET, statut juridique) reste à fournir par Arthur.

## Session 2026-09-16 — domaine définitif deux-as.fr (poussée)

- Domaine `deux-as.fr` acheté par Arthur chez OVH, relié au projet Vercel (`mon_site_aa`) :
  `deux-as.fr` ajouté + `www.deux-as.fr`, zone DNS OVH mise à jour (A `76.76.21.21` sur `@`,
  CNAME `www` → cible Vercel), anciens enregistrements de parking OVH supprimés, MX/SPF de la
  messagerie OVH conservés intacts.
- Sens de redirection choisi et vérifié en direct : **`deux-as.fr` (sans www) est le domaine
  canonique**, `www.deux-as.fr` redirige dessus (307). Décision motivée : aucun sous-domaine
  prévu (donc pas d'enjeu de partage de cookies), domaine tout neuf (rien à perdre côté SEO),
  et plus court à l'oral / sur une carte de visite pour une activité locale.
- `content.meta.domain` confirmé sur `https://deux-as.fr` (déjà en place), `meta.email` sur
  `contact@deux-as.fr`. `node build.mjs` relancé : `SITE_URL = https://deux-as.fr` sans le
  marqueur preview → le site est sorti du mode `noindex`. Vérifié : `<meta name="robots"
  content="index, follow">`, `<link rel="canonical" href="https://deux-as.fr/">`,
  `sitemap.xml` et `robots.txt` pointent bien vers le domaine définitif.
- **Repéré et corrigé au passage** : un dossier `prospection/` (base de contacts B2B et
  brouillons d'e-mails de démarchage, données personnelles de tiers) ainsi que `outputs/` et
  `.artifact-work/` traînaient en non suivi à la racine du dépôt — ajoutés à `.gitignore` pour
  qu'ils ne partent jamais sur GitHub par erreur. Rien de ce dossier n'a été poussé.
- Poussé uniquement les fichiers du site (contenu, HTML régénérés, `styles/main.css`,
  `scripts/check-configurator.mjs`, `README.md`, `robots.txt`/`sitemap.xml`/`vercel.json`,
  `.gitignore`) — la campagne de prospection (`STATUS.md` sessions du 15-16/09) reste un sujet
  à part, non lié au code du site.

## Session 2026-09-16 — envoi de la vague 2 (non poussée)

- Les 25 prospects restants ont été revérifiés ; P015 est bien active et a été requalifiée.
- 25 e-mails individualisés ont été préparés dans Zimbra, avec le modèle HTML validé, puis contrôlés par destinataire, objet et aperçu.
- Le retour de non-distribution du message P026 a été analysé : Orange/Wanadoo refuse actuellement `contact@deux-as.fr` avec un code `550 5.1.0`, en indiquant un signalement Abusix ou Spamhaus.
- Après confirmation d'Arthur, 17 messages ont été envoyés le 16/09/2026. Seize ne présentent aucun retour d'échec connu ; P019 a été rejeté parce que la boîte Hotmail du destinataire est pleine.
- Huit brouillons restent suspendus pour délivrabilité Orange/Wanadoo : P015, P016, P017, P021, P023, P024, P025 et P027.
- Les textes complets et l'état de préparation sont conservés dans `prospection/prospects-data.json`; la source éditable de la vague est `prospection/wave-2-drafts.json`.
- Le classeur local et le fichier Google Drive ont été synchronisés : 20 messages sans retour d'échec connu, 8 brouillons prêts et 2 échecs de livraison.
- Le fichier Drive a été remplacé sur place, sans doublon et avec le même ID, par `prospection-charente.xlsx`.
- Diagnostic délivrabilité : SPF public correct (`v=spf1 include:mx.ovh.com ~all`), aucun enregistrement DMARC public détecté, état DKIM à contrôler dans OVHcloud. Le rejet Orange cite le relais OVH `mo634.mail-out.ovh.net` (`79.137.60.134`) et un signalement Abusix ou Spamhaus.

## Session 2026-09-15 — prospection commerciale Charente (non poussée)

- Base de 30 prospects B2B qualifiés et sourcés, dont 21 en priorité A.
- Classeur de suivi final : `outputs/prospection-deux-as/prospection-charente.xlsx`.
- Base structurée et passation : `prospection/prospects-data.json` et `prospection/HANDOFF.md`.
- Cinq e-mails personnalisés, mis en forme et envoyés depuis Zimbra le 15/09/2026 à P009, P010, P013, P018 et P026 ; P026 a ensuite été rejeté par le serveur Orange/Wanadoo.
- Chaque action d'envoi a été confirmée dans Zimbra ; quatre messages n'ont pas généré de retour d'échec et P026 est enregistré comme non distribué.
- Le classeur et la base structurée indiquent désormais le statut `Envoyé`, la date d'envoi et la prochaine action.
- Le fichier Drive existant `prospection-charente.xlsm` (ID `16--lmrfcCcnhA0-PluOOpAvMRNOF-Bz4`) a été mis à jour sur place, sans doublon ; son tableau de bord affiche 0 brouillon prêt et 5 messages envoyés.
- Tout nouvel envoi doit être validé explicitement par Arthur au moment de l'envoi.
- Pour reprendre la campagne dans un autre chat, lire d'abord `prospection/HANDOFF.md`, puis réconcilier
  les statuts avec le classeur et le dossier Envoyés de Zimbra.

## Session 2026-09-15 — domaine et e-mail professionnels (non poussé)

- Domaine de production renseigné : `https://deux-as.fr`.
- Adresse de contact remplacée partout par `contact@deux-as.fr`, y compris pour l'action Formsubmit.
- Les pages générées utilisent désormais le nouveau domaine pour les canonical, Open Graph,
  JSON-LD, l'image sociale, la redirection après formulaire, le sitemap et `robots.txt`.
- L'URL `https://monsiteaa.vercel.app` reste uniquement le fallback technique de preview dans la
  source et n'apparaît plus dans les fichiers publics générés.
- Vérifications réussies : build complet, configurateur, absence d'anciennes valeurs, JSON-LD,
  canonical/robots et rendu du contact/footer en 1440 px et 390 px.
- Informations légales de l'entreprise toujours en attente : nom complet, statut juridique, SIRET,
  adresse et date de mise à jour des pages légales.

## Session 2026-09-15 — fondus et panneau tarifs (non poussé)

- Les sections ivoire et beige s’enchaînent désormais avec un fondu vertical CSS sans animation :
  environ 96 px sur ordinateur et 48 px sur mobile.
- Le beige reste plein au cœur des sections pour conserver leur identité et la lisibilité des cartes.
- L’ancien filet haut/bas du manifeste a été retiré afin de ne plus recréer une coupure franche.
- La section Contact ne fond qu’en entrée et garde une rupture nette avant le footer vert foncé.
- Deux passes visuelles effectuées sur le manifeste, puis contrôle des prestations et du contact en
  1440 px et 390 px.
- Les marges internes des sections beiges passent à environ 128 px sur ordinateur et 88 px sur
  mobile afin que les textes restent nettement éloignés des transitions.
- Le panneau vert du configurateur est légèrement élargi sur grand écran et son décalage sticky
  tient compte de la navbar fixe. Une réserve de grille évite qu’il soit repoussé sous la navigation
  à l’approche de la fin de la section.
- Le texte « Estimations provisoires » reste dans la colonne gauche et ne peut plus passer sous le
  panneau ; la phrase de réassurance est équilibrée pour éviter une dernière ligne « h. » isolée.

## Session 2026-09-15 — options tarifaires et maintenance (poussé)

### Réalisé

- Configurateur enrichi et réorganisé en trois familles lisibles : « Contenu & autonomie »,
  « Visibilité & conversion » et « Après la livraison ».
- 12 options ponctuelles affichées avec un périmètre court : administration, deux niveaux de
  rédaction, pages supplémentaires, langue, visibilité locale, rendez-vous, galerie, formulaire
  avancé, CRM/automatisation, paiement et mesure des conversions.
- Option de retouche/optimisation photo entièrement retirée à la demande d’Arthur.
- Langue supplémentaire calculée dynamiquement à 30 % de la formule avec un minimum de 490 €.
- Réécriture et rédaction complète rendues mutuellement exclusives dans le configurateur.
- Maintenance & hébergement portée à 79 €/mois, avec jusqu’à 30 minutes de modifications légères
  par mois, non cumulables ; les abonnements et frais de services tiers sont clarifiés.
- Exemple de devis mis à jour : formule Professionnel + administration + rédaction complète +
  visibilité locale = 4 960 €, puis 79 €/mois pour la maintenance si retenue.
- FAQ et `ETUDE-TARIFAIRE.md` harmonisées avec la nouvelle grille.
- Ajout de `scripts/check-configurator.mjs` pour tester les calculs, l’exclusion des rédactions,
  l’absence d’option photo, la récurrence, le récapitulatif et le préremplissage du contact.

### Vérifié

- `node build.mjs` : 9 pages HTML, sitemap, robots et configuration Vercel générés sans erreur.
- Test Puppeteer du configurateur : tous les scénarios passent, y compris le prix variable de la
  langue, le total Premium à 7 830 € avec options et la maintenance séparée à 79 €/mois.
- 0 erreur console/page sur les 9 pages, 0 débordement horizontal à 390 px (revérifié avant push).
- Deux passes visuelles sur ordinateur (1440 px) et mobile (390 px). Correction d’un héritage de
  padding qui créait trop d’espace entre les groupes ; cartes, prix et panneau final sont lisibles.

### État actuel

- Site local prêt sur `http://localhost:3000`.
- Poussé sur GitHub (`main`). `brand_assets/explorations/` (12 Mo de PNG d’exploration) laissé hors git.
- Les frais exacts des intégrations tierces restent à préciser dans chaque devis client.

## Session 2026-09-03 — refonte contenu (Arthur) + étape 4 typo (non poussé)

Arthur a repris la main sur le contenu et la structure pendant un reset de session.
Vérifié de bout en bout : **build OK, 0 erreur console/CSP sur les 9 pages**,
desktop + mobile OK, aucune règle CSS orpheline (l'ancien bloc `.proof-gauge*`,
`.pricing-*`, `.testimonial-frame`, `.case-study-facts` ont bien été retirés).

## Session 2026-09-03 — grille tarifaire de lancement + lots 6/7

### Fait et vérifié avant push

- Étude de cas Laperonnie enrichie avec captures desktop/mobile optimisées, besoin,
  choix de conception, durée réelle (4 à 5 semaines), contrainte déontologique,
  livrables et CTA vers le site public.
- Manifeste déplacé entre « Pour qui » et « Réalisation », avec une présentation
  éditoriale plus légère et lisible sur mobile.
- Grille de lancement appliquée : Essentiel 1 290 €, Professionnel 2 990 €,
  Premium à partir de 5 490 €.
- Maintenance et hébergement passés à 59 €/mois ; le périmètre reste celui des
  petites modifications dans un usage raisonnable.
- Exemple de devis harmonisé avec la formule Professionnel à 2 990 € et le total
  indicatif à 4 160 €.
- Délais du configurateur alignés sur 2 semaines, 3 semaines, puis 4 semaines ou plus.
- Build, vérifications JavaScript, contrôle du diff et tests responsive validés.

### État actuel

- Site local prêt sur `http://localhost:3000`.
- Aucun domaine définitif, SIRET ou témoignage client renseigné.
- Les prix restent des prix de lancement et pourront être recalculés après le suivi
  des jours réellement travaillés sur plusieurs projets.

### Ce qu'Arthur a fait
- **Section « manifeste »** habillée : `.manifeste-rail` (pastille « À retenir » +
  eyebrow à gauche, filet vertical, phrase Playfair + ligne verte à droite).
- **Étude de cas** : vraie maquette d'appareils — cadre navigateur (capture desktop)
  + téléphone en surimpression, nouvelles images `cabinet-laperonnie-desktop/mobile`
  (.jpg + .avif). Contenu restructuré (besoin / choix de conception / contrainte
  métier / livrables) + CTA « Découvrir le site du cabinet ↗ ».
- **Section preuve → « Mes engagements »** : plus aucun score Lighthouse inventé.
  4 repères en texte (24–48 h, Budget clair, Mobile d'abord, Votre site) + liste
  « Défini avant le lancement » sur le panneau vert. `.proof-stat-num` redimensionné
  pour des libellés (pas des chiffres) + `overflow-wrap: anywhere`.
- **Prestations** : 8 items → **4 piliers**. **Process** : étapes 03/04 réécrites.
- **Tarifs** : « Budgets indicatifs », montants annoncés comme provisoires,
  « Espace d'administration » passe en option, maintenance = maintenance + hébergement.
- Nav (« Réalisation » au singulier, « Autres services »), sous-titre du hero,
  ligne de réassurance, ordre des sections revu.

### Étape 4 (moi) — typo plus tranchée + moment éditorial : **terminée**
- `h1` `clamp(2.6rem, 5.2vw+1rem, 4.7rem)` / `h2` `clamp(2.15rem, 3.6vw+1rem, 3.65rem)`,
  tracking resserré (-0.038 / -0.036em). Vérifié : aucun débordement, `text-wrap: balance`
  gère les veuves.
- Chiffres traités en éléments graphiques : `.config-formule-price` 1.7→2.05rem,
  `.config-total` max 2.9→3.6rem.
- Moment éditorial = la section manifeste (fonction + contenu posés par moi,
  habillage par Arthur).

### Reste
- **Non poussé** : étapes 1-3 (commits `3509e2a`, `8488530`, `1e36236`) + ce commit.
- Résolu depuis : l'adresse professionnelle `contact@deux-as.fr` remplace l'adresse Hotmail.
- `AGENTS.md` et `ETUDE-TARIFAIRE.md` non suivis par git (docs de travail d'Arthur).

---

## Session 2026-09-02 (suite 6) — poussé
Revue design (yeux de webdesigner) → passe de cohérence + fusion Tarifs/Configurateur,
validées par Arthur et poussées sur `main`.

### Piste écartée
Exploration de 3 directions visuelles (Éditoriale / Atmosphérique / Graphique) faite
dans un canvas Claude Design — **Arthur n'est pas fan**. Méthode convenue : itérer en
direct sur localhost (changement ciblé → rebuild → capture → garde ou `git revert`),
un pas à la fois. Idées A + B gardées en tête pour la suite.

### Passe transversale « moins fade » — pas à pas (commits locaux, non poussés)
- **Étape 1 — profondeur des blocs verts** (commit `3509e2a`). `.case-study`,
  `.proof-gauge`, `.config-panel`, `.footer` : + 2 nappes `radial-gradient`
  (claire haut-gauche, creux sombre bas-droite) + `box-shadow: inset` filet.
  Pur CSS non animé. Repli : la couleur de fond d'origine reste posée.
- **Étape 2 — soie toujours vivante + vrai fallback animé** (commit local).
  - `silk-bg.js` (shader) : `t` 0.10→0.11, alpha base 0.14/0.11→0.15/0.12,
    ajout d'une « respiration » de luminance lente (`0.93+0.07*sin(u_time*0.11)`).
    Léger, pour la majorité qui a WebGL.
  - Fallback CSS (Chrome sans GPU d'Arthur) refait : `.silk-css .hero::before`
    + nouveau `::after` = 2 nappes qui dérivent en sens opposés (`silkDriftA/B`,
    32 s / 46 s) au lieu d'un aplat uniforme. **Étendu au footer et à l'étude de
    cas** (`.silk-css .footer::before` / `.case-study::before`) qui n'avaient
    aucune vie sans WebGL.
  - `transform`/`opacity` uniquement (compositeur). Coupé par le reset en
    `prefers-reduced-motion` → nappes figées, calmes. 0 erreur console/CSP.
- **Étape 3 — resserrer les sections vides** (commit local).
  - `section` padding : desktop 8rem→6rem (`--space-8`→`--space-7`),
    mobile 6rem→4rem (`--space-7`→`--space-6`).
  - `.section-head` margin-bottom : 4rem→3rem (`--space-6`→`--space-5`).
  - Rail « méthode » : `margin-top` 6rem→3rem (le grand vide entre le titre
    et le rail est parti).
  - Hero : padding bas 8rem→6rem, haut `+3rem`→`+2rem` ; `.scroll-hint`
    margin-top 6rem→3rem.
  - FAQ : `.faq-list` max-width 760→620 px, gap resserré, padding des
    `summary` 24→~22 px (reste ≥ 44 px de cible tactile).
  - Résultat : home ~2700 px plus courte. 0 erreur console/CSP sur 9 pages,
    rien cassé desktop/mobile.
  À faire ensuite : couleur chaude en touches (à valider — 2ᵉ couleur).

---

### Détail — revue design + passe de cohérence + fusion Tarifs/Configurateur

### Fusion des deux sections tarifs (choix d'Arthur : « configurateur = base »)
Le site avait **deux sections sur les tarifs** collées (Tarifs `#tarifs` = 3 cartes
Essentiel/Pro/Premium ; Configurateur `#estimation` = mêmes 3 prix + options + total live).
Redite des prix, page longue, double logique de choix. **Fusionnées en une seule.**
- `pricingSection()` **supprimée** (fonction + appel + JS des onglets + `.pricing-*` CSS
  + `content.pricing` + `parsePriceEUR()` + refs NOSCRIPT_CSS). JSON-LD `hasOfferCatalog`
  repointé sur `content.configurator.bases`.
- `configuratorSection()` **réécrit** : `id="tarifs"` (le lien nav « Tarifs » y atterrit),
  eyebrow « Tarifs », titre « Composez votre projet, le budget suit ».
  - Bloc « Votre formule » : 3 **cartes riches** `.config-formule` (radio) — nom, prix,
    accroche, **liste de ce qui est inclus** (— items), badge « Le plus choisi » sur Pro
    (pré-cochée). Blanc / bord + fond vert clair quand sélectionnée. Sur `bg-alt`.
  - Bloc « Ajoutez des options » : inchangé (`.config-choice--opt`, 6 options + maintenance).
  - Panneau vert « Estimation » : total live, délai, récap ligne par ligne, CTA
    « Recevoir ce devis détaillé » (pré-remplit toujours `#contact`), lien exemple, réassurance.
    Ligne « X comprend : … » **retirée** (redondante avec les cartes).
  - Grille desktop (`grid-template-areas`) : formules pleine largeur (3 col) → options + panneau
    (sticky) → disclaimer. Tablette 640-919 : 3 col compactées. < 640 : tout empilé.
- `content.configurator.bases[]` enrichi : `blurb`, `badge`, `pricePrefix`, `priceNote`,
  `features` (reprises des anciennes `pricing.plans[].features`). Noms = Essentiel /
  Professionnel / Premium (au lieu de Une page / Multi-pages / Sur-mesure).
- `exemple-devis` : lien `/#estimation` → `/#tarifs`.

### Alternance de fonds — recalage (9 sections, alternance stricte)
merged tarifs → `bg-alt` ; `#solutions` → ivoire (retiré) ; `#faq` → `bg-alt` (ajouté) ;
`#contact` → ivoire (retiré). Résultat : pour-qui I · process A · réalisation I · resultats A ·
prestations I · **tarifs A** · solutions I · faq A · contact I · footer (foncé).
`.contact-info` reste en carte blanche (posée la session d'avant) — OK sur ivoire.

### Vérifié
`node build.mjs` OK, `vercel.json` régénéré, **0 erreur console/CSP sur 9 pages**.
Configurateur testé (Essentiel 990 + 2 options 390+390 = 1 770 ✓, récap live ✓).
Captures 1440 / 820 / 390 de la section fusionnée + sections déplacées.
NB : la capture pleine-page mobile Puppeteer montre un artefact de « duplication »
(bug de stitching connu avec le canvas soie animé) — le rendu réel est bon (captures par section).

---

Date : 2026-09-02 (suite 6, 1re partie) — revue design + passe de cohérence

### Revue « yeux de webdesigner » (demandée par Arthur)
Audit complet desktop + mobile des 12 sections. Verdict : DA forte, quelques
incohérences de système + bugs d'affichage sur les moments « vitrine ». Arthur a
choisi le périmètre **bugs + cohérence** (points 4 à 8), titres **tout à gauche**,
bloc témoignage **redessiné sans citation**.

### Corrigé cette session (`build.mjs`, `styles/main.css`, `content/site-content.mjs`)
- **Bug — chiffres illisibles sur fond vert.** `.proof-gauge-score` (« 98 ») et
  `.config-total` (« 2 490 € ») étaient des `<p>` sans `color` → la règle de base
  `p { color: var(--color-text-soft) }` gagnait sur le crème hérité (contraste ~1.5:1).
  Ajout de `color: var(--on-dark)` sur les deux. Le prix des cartes Tarifs (déjà un
  `<div>` avec `color`) n'était pas touché.
- **Bug — placeholder témoignage.** `.testimonial-frame` « Témoignage client à
  intégrer » remplacé par un encart `.case-study-facts` « Ce qui a été livré »
  (4 lignes, marqueur `—`, même langage que `.pricing-features`). Contenu :
  `content.caseStudy.deliverables` (éditable). Équilibre la colonne droite (point 8).
- **Bug — bordures boutons fantômes** quasi invisibles : `.btn-ghost`
  `rgba(26,25,23,0.10)` → `0.28` ; `.btn-ghost--invert` `0.3` → `0.45`.
- **Cohérence #4 — titres de section tous à gauche.** `section-head--center`
  retiré des 7 sections (+ règle CSS supprimée). Centré réservé au hero.
  `.section-head` : `max-width` 640→660, `text-wrap: balance` sur h2, marge
  auto pour le `<p>` d'intro sous le titre.
- **Cohérence #5 — numérotation ramenée à 1 langage.** `.prestation-item .mark`
  généralisé en `.mark` (pastille cercle contour). Adopté par : pour-qui
  (`.index` supprimé), prestations, étapes des pages Solutions (`.step .n` + filet
  `border-top` supprimés). Le rail « méthode » de l'accueil garde sa variante
  animée (même cercle au repos → se remplit en vert au scroll).
- **Cohérence #6 — alternance de fonds.** `--color-bg-alt` `#F3EEE4` → `#F1E9DA`
  (plus lisible). `#contact` passe en `bg-alt` → alternance stricte
  ivoire/beige de pour-qui à contact. `.contact-info` (carte « Mes coordonnées »)
  passe de `bg-alt` à `--color-surface` + bordure + `shadow-sm` (sinon invisible
  sur la section beige ; s'aligne aussi avec les inputs blancs).
- **Cohérence #7 — hiérarchie de texte sur vert.** 3 tokens : `--on-dark` (plein),
  `--on-dark-soft` (0.82), `--on-dark-mute` (0.64). Les labels/notes/légendes
  ≤ 0.6 des panneaux (proof, config, pricing, case-study) remontés sur ces tokens.
- **Cohérence #8 — vide sous les panneaux verts.** Jauge « preuve chiffrée » :
  la colonne étirée cale le contenu en haut (`justify-content: flex-start`) et
  ancre le CTA en bas (`margin-top: auto`, ≥900px). Case study : réglé via le
  nouvel encart livrables.
- Vérifié : `node build.mjs` OK, `vercel.json` régénéré, **0 erreur console/CSP**
  sur `/`, `/videos-ia`, `/mentions-legales`, `/exemple-devis`. Captures desktop
  (1440) + mobile (390) des sections modifiées.

### Reste à trancher (Arthur)
- **Résolu depuis** : le bloc contact et le footer utilisent `contact@deux-as.fr`.
- Points polish non traités (hors périmètre choisi) : eyebrow hero qui casse en
  mobile, CTA des 3 cartes tarifs à hauteurs différentes, FAQ pleine largeur,
  libellé « Demander un devis » répété 6×, « Gérer les cookies » seul lien souligné.

---

## (archive) suite 5
Deux nouvelles sections sur l'accueil (maquettes 5c et 6a) + page `/exemple-devis`.
**À valider avant push.**

### Configurateur — rendu compact (v2, retour d'Arthur)
- Section beaucoup plus courte : formules **en ligne** (3 cartes : Une page / Multi-pages /
  Sur-mesure, nom + prix, sélection = bord + fond vert clair via `:has()`), options en **grille
  2 colonnes** (nom + prix + case custom, sans description), maintenance sur toute la largeur.
- Plus de mini-formulaire dans le panneau : **« Recevoir ce devis détaillé » pré-remplit le
  formulaire de contact** (`#contact-message` = récap complet + `#contact-project-type` mappé) puis
  y amène. Sans JS : simple ancre `/#contact`. Le configurateur n'est plus un `<form>`.
- Panneau : total animé, délai, **récap ligne par ligne** (formule + options), **1 ligne « X
  comprend : … »** qui change selon la formule, CTA + lien « Voir un exemple de devis » + réassurance.
- Option **« Site bilingue (FR / EN) » 490 €** ajoutée.
- Hauteur section : ~1100 px desktop / ~1820 px mobile (avant : ~1800 / ~2900).

### Page `/exemple-devis` (nouveau)
- `buildExempleDevis()` — devis type : prestataire (`[SIRET/adresse à compléter]`), client exemple,
  tableau des prestations (Multi-pages 2 490 € + Rédaction 390 € + SEO 390 € = **3 270 €**),
  « TVA non applicable art. 293 B », modalités (acompte 30 %, délai, AR, propriété du code).
  `noindex, follow`, sans CTA mobile. Réutilise `.legal-page` + styles `.devis-*`.
- Lié depuis le panneau du configurateur (`content.configurator.panel.exampleDevisUrl`).

### Preuve chiffrée — scores
Passés à 98 / 100 / 96 / 100 (jauge 98) pour éviter le « 100 partout ». **Toujours des
placeholders — Arthur doit mesurer PageSpeed Insights sur le site déployé et donner les vrais.**

### Vérifié Puppeteer
Desktop + mobile, `:has()`, sans JS (config visible, CTA = ancre, barres pleines), reduced-motion,
CSP 7 pages (dont `/exemple-devis`), pages Solutions intactes. `vercel.json` régénéré.

### Section « Preuve chiffrée » (5c) — `#resultats`, après l'étude de cas, `bg-alt`
- `content.proof` : 4 chiffres (990 € / 2–4 sem. / 48 h / 100 % mobile), 4 barres Lighthouse
  (Perf 99 / Access. 100 / Bonnes pratiques 100 / Réf. 100), jauge « score global » 99, lien
  PageSpeed Insights. **Les scores sont des placeholders crédibles — Arthur doit les mesurer
  réellement (PageSpeed Insights sur le site déployé) et ajuster.**
- Anim déclenchée à l'entrée dans le champ de vision : compteurs qui montent, barres qui se
  remplissent (`transform: scaleX`), jauge SVG (`stroke-dashoffset`). Reduced-motion → tout
  d'un coup. Sans JS → affiché plein (NOSCRIPT_CSS).
- Layout : split blanc / vert foncé (jauge à droite). Mobile : empilé.

### Section « Configurateur de devis » (6a) — `#estimation`, après Tarifs, ivoire
- `content.configurator` : 3 formules (radio, = pricing.plans, Pro coché par défaut) + 5 options
  (checkbox) + Maintenance 49 €/mois (séparée du total ponctuel).
  **Montants des options choisis par moi — à valider par Arthur :** Rédaction textes 390 €,
  Optimisation photos 190 €, Prise de RDV en ligne 290 €, Réf. local renforcé 390 €,
  3 pages supp. 450 €.
- Panneau vert : total live (compteur animé), délai estimé (base + ⌈options/2⌉), **liste
  « Inclus dans cette formule » qui change selon la formule cochée**, récap des options,
  champ email (requis) + téléphone (facultatif), consentement RGPD, disclaimer « pas un devis
  ferme ».
- Vrais `<input type=radio/checkbox>` (accessibles, `:has()` pour l'état coché, marche sans JS
  → POST direct à Formsubmit avec `recapitulatif` construit par JS). Même endpoint que le
  formulaire de contact (`content.contact.form.action`). Envoi progressif (fetch → /merci).
- Ordre des sections réorganisé + `bg-alt` redistribué pour garder l'alternance :
  hero · pour-qui · process · realisation · **resultats(alt)** · prestations · tarifs(alt) ·
  **estimation** · solutions(alt) · faq · contact.
- Vérifié Puppeteer (desktop + mobile, :has(), sans JS, reduced-motion, CSP 5 pages,
  pages Solutions intactes). `vercel.json` régénéré.
- **Idées en plus proposées à Arthur** (voir message) : ajouter « Estimation » au menu ;
  option « Site bilingue FR/EN » ; pré-remplir le formulaire de contact au lieu d'un 2ᵉ formulaire.

---

## Dernière session
Date : 2026-09-01 (suite 4)
Fait : Cache-busting de `silk-bg.js` + fix bannière cookies / CTA collant sur mobile
+ logo « Arthur Avetisian » → accueil + 2 swaps de sections (Process / Prestations / Tarifs)
+ refonte « Un déroulé simple, en 4 étapes » en rail animé (maquette 6c).

### Section Process → rail « méthode » (maquette 6c)
- `processSection()` : ancien `.steps`/`.step` remplacé par `<ol class="process-rail" data-rail>` +
  `<li class="process-step">` (pastille numérotée + titre + description). `.steps`/`.step` **conservés**
  tels quels (toujours utilisés par les pages Solutions via `.steps--three`).
- **Contenu inchangé** : eyebrow « Comment ça se passe », titre « Un déroulé simple, en 4 étapes »,
  les 4 étapes existantes. Pas repris de la maquette : le titre « Vous savez à tout moment… », les
  libellés de délai (Jour 1 / Semaine 1…) et la 5e étape — à ajouter si Arthur le souhaite.
- **Interaction** : à l'entrée de la section dans le champ de vision (IntersectionObserver, seuil
  0.35), la ligne se remplit (`transform: scaleX/scaleY`) et les 4 pastilles s'allument en cascade
  (vert `--color-accent`, `scale(1.05)`, easing spring). Une seule `is-lit` posée sur le `<ol>`,
  jamais retirée. Choix : allumage à l'arrivée (pas au fil du scroll) — cohérent avec tous les
  `reveal` du site, fiable au tactile, simple en `prefers-reduced-motion`.
- **Vitesse** : ralentie 2× (−50 %) puis encore ×1,43 (−30 %) à la demande d'Arthur.
  État actuel : durées pastilles/titres 1,3 s, remplissage 1,55 s ; délais de cascade
  0,15 / 0,85 / 1,55 / 2,25 s. Cascade totale ≈ 3,55 s.
- **Mobile** (`< 860px`) : rail **vertical** (pastille à gauche, texte à droite, ligne verticale
  entre pastilles), `max-width: 360px` centré. **Desktop** (`≥ 860px`) : rail **horizontal** 4 colonnes.
  Segments de liaison = `::before` (piste grise) + `::after` (remplissage vert animé) par étape.
- `prefers-reduced-motion` : `transition-delay` forcé à 0 → tout s'allume d'un coup, sans cascade.
- Sans JS : `NOSCRIPT_CSS` complété → pastilles + ligne affichées à l'état « allumé » d'emblée.
- Vérifié Puppeteer (1440 / 768 / 390, avant-scroll / mi-cascade / réglé / reduced-motion / sans JS) :
  `is-lit` posé au bon moment, cascade OK, desktop + mobile OK, pages Solutions intactes (3 étapes),
  0 violation CSP sur 7 pages, `vercel.json` régénéré (hashs `<style>` + `<script>` à jour).

### Swaps de sections (2 passes)
- Passe 1 : `process` ↔ `prestations`. Passe 2 : `prestations` ↔ `tarifs`.
- **Ordre final** : hero → pour-qui → **comment-ca-se-passe** → realisation → **prestations**
  → **tarifs** → solutions → faq → contact.
- Fonds : `class="bg-alt"` déplacé à chaque fois pour garder l'alternance ivoire / `bg-alt`
  (F3EEE4). État final : `bg-alt` sur `comment-ca-se-passe`, `prestations`, `solutions` →
  ivoire / ivoire / alt / ivoire / alt / ivoire / alt / ivoire / ivoire (motif inchangé).
- Aucune règle CSS ne dépend de `.bg-alt` comme ancêtre → déplacement sans effet de bord.
  Les `id` d'ancre ne bougent pas → liens nav OK. `vercel.json` inchangé (aucun inline modifié).
- Vérifié : captures pleine page desktop + mobile (prestations sur beige, tarifs sur ivoire),
  onglets tarifs fonctionnels, 0 violation CSP.

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
- [x] Domaine de production → `https://deux-as.fr` (`index, follow`)
- [ ] Google Search Console → non configuré
- [ ] Google Analytics → non configuré (`content.meta.gaId`)
- [x] Formulaire de contact → Formsubmit + fetch progressif, dropdown à jour avec les 3 nouvelles offres
- [ ] CMS → non configuré

## Ce qui reste à faire
- Connecter le repo à un projet Vercel
- Vérifier le premier déploiement public sur `https://deux-as.fr` après publication des changements
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
