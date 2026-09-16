# HANDOFF — Deux As

Ce document résume le fonctionnement technique du projet pour faciliter sa reprise. Il ne contient
aucune donnée personnelle, donnée client, information de prospection, clé, secret ou identifiant de
compte.

## Architecture

- Site vitrine 100 % statique, sans framework côté navigateur.
- `content/site-content.mjs` est la source unique des textes, tarifs et paramètres éditoriaux.
- `styles/main.css` contient le design system et les styles du site.
- `build.mjs` génère les pages HTML et `vercel.json` ; les fichiers générés ne doivent pas être
  modifiés manuellement.
- `serve.mjs` sert le projet localement sur le port 3000 par défaut.
- `scripts/check-configurator.mjs` teste les calculs, les options et les débordements horizontaux du
  configurateur.

## Commandes utiles

```bash
npm install
node build.mjs
node serve.mjs
node scripts/check-configurator.mjs
node screenshot.mjs http://localhost:3000
node screenshot.mjs http://localhost:3000 mobile 390 900
```

Les captures doivent toujours être réalisées depuis le serveur local, puis contrôlées au minimum en
desktop et en mobile après une modification visuelle.

## Publication

- La branche de production est `main`.
- L’hébergement est assuré par Vercel.
- Le build est réalisé localement et les fichiers générés sont versionnés.
- Avant chaque push : lancer le build, les tests du configurateur, vérifier le rendu desktop/mobile,
  puis mettre à jour `STATUS.md`.
- Ne jamais publier les dossiers de prospection, fichiers temporaires, captures de travail ou secrets.

## Offre actuellement affichée

- Hébergement géré : dès 89 € par an, facturé séparément avec renouvellement annuel.
- Maintenance facultative : 79 € par mois, sans engagement de durée.
- Maintenance incluse : suivi du bon fonctionnement, assistance et jusqu’à 30 minutes de
  modifications légères par mois, non cumulables.
- Les évolutions importantes et les migrations vers un autre hébergeur sont chiffrées séparément.
- `ETUDE-TARIFAIRE.md` documente le raisonnement et le périmètre des offres.

## Points à vérifier avant toute livraison définitive

- Remplacer tous les champs légaux encore indiqués comme étant à compléter dans
  `content/site-content.mjs`.
- Refaire un build après toute modification du contenu ou du CSS.
- Contrôler que les pages générées et `vercel.json` sont inclus dans le même commit que leurs sources.
- Vérifier le formulaire de contact, la bannière de consentement, la navigation, les liens et le
  configurateur sur ordinateur et mobile.

## Confidentialité du dépôt

- Ne jamais ajouter de coordonnées personnelles ou de données relatives à un prospect ou à un client
  dans ce fichier.
- Ne jamais versionner de fichiers d’export, listes de prospects, brouillons de messages ou documents
  contenant des coordonnées.
- Les identifiants de services, jetons d’accès et secrets doivent rester hors du dépôt.
