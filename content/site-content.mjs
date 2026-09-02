// Contenu du site — séparé du template (build.mjs).
// Modifier ce fichier pour changer les textes ; la mise en page vit dans build.mjs / styles/main.css.

export const content = {
  meta: {
    siteName: 'Arthur Avetisian',
    title: 'Arthur Avetisian — Création de sites internet à Angoulême',
    description: "Création de sites internet sur-mesure à Angoulême pour avocats, artisans et indépendants. Devis gratuit, sites qui inspirent confiance.",
    domain: 'https://DOMAINE-A-DEFINIR.fr',
    previewUrl: 'https://monsiteaa.vercel.app',
    email: 'arthur.avetisian@hotmail.com',
    phone: '+33646456925',
    phoneDisplay: '06 46 45 69 25',
    gaId: '[GA_MEASUREMENT_ID]',
    year: new Date().getFullYear(),
  },

  nav: {
    logo: 'Arthur Avetisian',
    links: [
      { label: 'Prestations', href: '/#prestations' },
      { label: 'Réalisation', href: '/#realisation' },
      { label: 'Tarifs', href: '/#tarifs' },
      { label: 'Contact', href: '/#contact' },
    ],
    solutionsLabel: 'Autres services',
    cta: 'Demander un devis',
  },

  hero: {
    eyebrow: 'Création de sites internet — Angoulême & Charente',
    title: 'Des sites internet qui donnent envie de vous faire confiance',
    titleAccent: 'faire confiance',
    // Le carrousel défile dans cet ordre puis se fige sur le dernier ("faire confiance").
    // La partie fixe s'arrête à "…de vous" ; "faire" ne revient qu'avec le mot final.
    titleAccentWords: ['remarquer', 'choisir', 'contacter', 'connaître', 'faire confiance'],
    subtitle: "Je conçois à Angoulême des sites professionnels, rapides et simples à gérer, avec une attention particulière portée aux professions libérales — ainsi qu'aux artisans, indépendants et TPE.",
    ctaPrimary: { label: 'Demander un devis', href: '/#contact' },
    ctaSecondary: { label: 'Voir une réalisation', href: '/#realisation' },
    reassurance: 'Premier échange gratuit, sans engagement. Réponse sous 24 à 48 h.',
    scrollHint: 'Découvrir',
  },

  // Phrase-manifeste, en grand, juste après le hero. À réécrire dans les mots d'Arthur.
  manifeste: {
    eyebrow: 'Votre présence en ligne',
    lead: 'Un futur client voit souvent votre site avant de vous rencontrer.',
    emphasis: 'Ce premier regard décide de la suite.',
  },

  audiences: {
    eyebrow: 'Pour qui',
    title: 'Un site pensé pour votre métier',
    items: [
      {
        label: 'Professions libérales',
        detail: 'Avocats, notaires, experts-comptables, thérapeutes',
        need: "Une présence en ligne qui inspire la crédibilité dès la première visite, dans le respect des codes de votre profession.",
      },
      {
        label: 'Artisans & commerçants',
        detail: 'Métiers de l’artisanat, du commerce de proximité',
        need: "Un site qui donne envie de pousser la porte de votre atelier ou de votre boutique, et qui vous fait gagner du temps au quotidien.",
      },
      {
        label: 'Indépendants & TPE',
        detail: 'Consultants, prestataires, petites structures',
        need: "Une vitrine claire et professionnelle pour asseoir votre activité, sans le budget ni la lourdeur d'une grande agence.",
      },
    ],
  },

  prestations: {
    eyebrow: 'Prestations',
    title: 'Les quatre piliers de votre site',
    items: [
      {
        title: 'Conception & identité',
        desc: 'Une structure et un design conçus pour votre activité, vos clients et les codes de votre profession.',
      },
      {
        title: 'Mobile, rapidité & contact',
        desc: 'Une expérience fluide sur tous les écrans et un parcours clair pour faciliter les prises de contact.',
      },
      {
        title: 'Un site adapté à vos besoins',
        desc: 'Votre site reste simple et efficace. Un espace d’administration peut être ajouté en option si vous souhaitez gérer vous-même vos contenus.',
      },
      {
        title: 'Mise en ligne & accompagnement',
        desc: 'Je prépare la publication du site. La maintenance optionnelle inclut ensuite l’hébergement et les petites mises à jour.',
      },
    ],
  },

  caseStudy: {
    sectionEyebrow: 'Réalisation',
    sectionTitle: 'Une réalisation récente',
    eyebrow: 'Étude de cas',
    title: 'Cabinet Laperonnie',
    subtitle: 'Avocat à Angoulême',
    durationLabel: 'Durée du projet',
    duration: '4 à 5 semaines',
    needLabel: 'Le besoin',
    need: "Présenter clairement les expertises du cabinet, notamment son activité en droit des cryptomonnaies, tout en installant une image sérieuse et immédiatement crédible.",
    choicesLabel: 'Les choix de conception',
    choices: [
      'Une direction visuelle sobre et haut de gamme, adaptée aux codes de la profession',
      'Une hiérarchie claire pour rendre les domaines d’intervention faciles à comprendre',
      'Des accès visibles vers la prise de rendez-vous et le contact, également sur mobile',
    ],
    constraintLabel: 'Contrainte métier',
    constraint: "Présenter les expertises avec pédagogie tout en respectant le cadre déontologique propre à la communication d’un avocat.",
    link: { label: 'Découvrir le site du cabinet', href: 'https://laperonnie-avocat.fr/' },
    deliverablesLabel: 'Ce qui a été livré',
    deliverables: [
      'Site multi-pages sur-mesure',
      "Espace d'administration autonome",
      'Conformité déontologique (profession d’avocat)',
      'Référencement local — Angoulême & Charente',
    ],
  },

  process: {
    eyebrow: 'Comment ça se passe',
    title: 'Un déroulé simple, en 4 étapes',
    steps: [
      {
        n: '01',
        title: 'Échange & devis',
        desc: 'On définit ensemble votre besoin, vos objectifs et votre budget.',
      },
      {
        n: '02',
        title: 'Création',
        desc: 'Je conçois votre site sur-mesure, à votre image.',
      },
      {
        n: '03',
        title: 'Validation',
        desc: 'Deux à trois séries de corrections sont prévues selon la formule ; la formule Premium permet davantage d’ajustements dans le périmètre validé.',
      },
      {
        n: '04',
        title: 'Mise en ligne & accompagnement',
        desc: 'Votre site est préparé, vérifié puis publié dans les conditions définies ensemble.',
      },
    ],
  },

  // Engagements factuels — aucune statistique de performance non vérifiée n'est publiée.
  proof: {
    eyebrow: 'Mes engagements',
    title: 'Un cadre clair avant de commencer',
    intro: 'Vous savez ce qui est prévu, ce qui reste optionnel et comment votre projet va avancer.',
    stats: [
      { value: '24–48 h', label: 'pour recevoir une première réponse', plain: true },
      { value: 'Budget clair', label: 'une estimation visible puis un devis adapté au périmètre', plain: true },
      { value: 'Mobile d’abord', label: 'une expérience conçue pour tous les écrans', plain: true },
      { value: 'Votre site', label: 'des accès et une propriété précisés dans le devis', plain: true },
    ],
    detailsLabel: 'Défini avant le lancement',
    details: [
      'Le périmètre et le calendrier du projet',
      'Le nombre de séries de corrections incluses',
      'Les coûts ponctuels et récurrents',
      'L’hébergement uniquement avec la maintenance',
    ],
    note: 'Chaque point est confirmé dans le devis avant le début de la création.',
    cta: { label: 'Demander un devis', href: '/#contact' },
  },

  // Section « Tarifs » (fusion de l'ancienne grille de tarifs + du configurateur).
  // On choisit une formule (avec ce qu'elle contient), on ajoute des options, le total
  // se calcule en direct. Le CTA d'estimation pré-remplit le formulaire de
  // contact (#contact) — pas de 2ᵉ formulaire. Montants à valider / ajuster par Arthur.
  configurator: {
    eyebrow: 'Budgets indicatifs',
    title: 'Composez votre projet, estimez votre budget',
    intro: 'Choisissez une base et les options utiles pour obtenir un premier ordre de grandeur. Les montants présentés sont provisoires et seront confirmés après échange sur votre besoin.',
    baseLabel: 'Votre formule',
    bases: [
      {
        id: 'essentiel', name: 'Essentiel', price: 1290, timeline: '2 semaines',
        pricePrefix: 'à partir de',
        contactType: 'Site vitrine une page',
        blurb: 'Pour une présence simple et efficace.',
        features: [
          'Site une page (landing)',
          'Formulaire de contact',
          '100 % adapté mobile',
          'Mise en ligne incluse',
          '2 séries de corrections',
        ],
      },
      {
        id: 'pro', name: 'Professionnel', price: 2990, timeline: '3 semaines', recommended: true,
        pricePrefix: 'à partir de',
        badge: 'Recommandée',
        contactType: 'Site multi-pages',
        blurb: 'La formule la plus complète pour une activité qui se développe.',
        features: [
          'Site multi-pages (jusqu’à 5-6 pages)',
          'Blog / actualités',
          'Formulaire qualifié',
          'Référencement local de base',
          '3 séries de corrections',
        ],
      },
      {
        id: 'premium', name: 'Premium', price: 5490, timeline: '4 semaines ou plus',
        pricePrefix: 'à partir de',
        contactType: 'Site multi-pages',
        blurb: 'Suivi et accompagnement pour un projet complet sur-mesure.',
        features: [
          'Site complet sur-mesure',
          'Fonctionnalités avancées',
          'Suivi et accompagnement',
          'Ajustements jusqu’à validation dans le périmètre convenu',
        ],
      },
    ],
    optionsLabel: 'Ajoutez des options',
    options: [
      { id: 'administration', name: 'Espace d’administration', price: 390 },
      { id: 'redaction', name: 'Rédaction des textes', price: 390 },
      { id: 'photos', name: 'Optimisation des photos', price: 190 },
      { id: 'rdv', name: 'Prise de rendez-vous en ligne', price: 290 },
      { id: 'seo', name: 'Référencement renforcé & suivi', price: 390 },
      { id: 'pages', name: '3 pages supplémentaires', price: 450 },
      { id: 'bilingue', name: 'Site bilingue (FR / EN)', price: 490 },
    ],
    maintenance: { id: 'maintenance', name: 'Maintenance & hébergement', price: 59, unit: ' €/mois' },
    panel: {
      label: 'Estimation indicative',
      note: 'Hors option maintenance & hébergement. Délai indicatif :',
      basePrefix: 'Formule',
      cta: 'Demander une estimation personnalisée',
      exampleLabel: 'Voir un exemple de devis',
      exampleDevisUrl: '/exemple-devis',
      disclaimer: 'Estimations provisoires — le montant final, les coûts récurrents et les conditions d’hébergement sont arrêtés dans le devis après un premier échange.',
      reassurance: 'Sans engagement, réponse sous 24 à 48 h.',
      hint: 'Cochez : le total et le récapitulatif se mettent à jour.',
    },
    // Pré-remplissage du formulaire de contact
    prefillLead: 'Bonjour, je souhaite un devis pour :',
  },

  faq: {
    eyebrow: 'FAQ',
    title: 'Vos questions, mes réponses',
    items: [
      {
        q: 'Combien de temps pour créer mon site ?',
        a: 'Comptez en moyenne 2 à 4 semaines selon la formule choisie, de l’échange initial jusqu’à la mise en ligne.',
      },
      {
        q: 'Est-ce que je pourrai le modifier moi-même ?',
        a: 'Un espace d’administration peut être ajouté en option à votre projet si vous souhaitez modifier vous-même vos textes, images et actualités.',
      },
      {
        q: 'La mise en ligne et l’hébergement sont-ils inclus ?',
        a: 'La préparation et la mise en ligne sont incluses dans chaque formule. L’hébergement est inclus uniquement avec l’option de maintenance ; sans cette option, je vous accompagne dans sa configuration et les conditions sont précisées dans le devis.',
      },
      {
        q: 'Que se passe-t-il après la livraison ?',
        a: 'Je reste disponible après la livraison. L’option de maintenance comprend l’hébergement ainsi que les petites modifications de textes, d’images ou de couleurs. Les évolutions structurelles et nouvelles fonctionnalités font l’objet d’un devis séparé.',
      },
      {
        q: 'Que se passe-t-il si je ne suis pas satisfait du résultat ?',
        a: 'La formule Essentiel inclut 2 séries de corrections et la formule Professionnel 3. La formule Premium permet des ajustements jusqu’à validation, tant qu’ils restent dans le périmètre défini ensemble au départ.',
      },
      {
        q: 'Travaillez-vous avec des clients hors d’Angoulême ?',
        a: 'Oui, je travaille avec des clients partout en Charente et au-delà, en visio comme en présentiel.',
      },
    ],
  },

  digitalSolutions: {
    eyebrow: 'Au-delà du site internet',
    title: "D'autres façons de vous accompagner",
    items: [
      {
        slug: 'videos-ia',
        metaTitle: 'Vidéos IA de présentation',
        metaDescription: "Vidéos générées par IA à partir de vos photos pour donner envie d'agir — immobilier, artisans, commerçants à Angoulême et en Charente.",
        cardTitle: 'Vidéos IA de présentation',
        cardDesc: 'Un trailer généré à partir de vos photos, pensé pour donner envie d’agir.',
        pageEyebrow: 'Vidéos IA',
        h1: 'Des vidéos qui donnent envie de passer à l’action',
        intro: "À partir des photos que vous avez déjà — un bien à vendre, un atelier, une boutique — je génère une vidéo courte et soignée, pensée comme un trailer : de quoi donner envie d'appeler, de venir voir, de se renseigner.",
        notice: 'Chaque vidéo est présentée comme générée par IA à partir de vos photos — jamais comme une captation réelle. C’est aussi ce qui protège votre crédibilité et celle de vos clients.',
        audienceLabel: 'Pour qui',
        audience: [
          'Agences immobilières — biens à vendre ou à louer',
          'Artisans — portfolio de réalisations',
          'Commerçants — ambiance de la boutique',
        ],
        stepsLabel: 'Comment ça marche',
        steps: [
          { n: '01', title: 'Vos photos', desc: 'Vous m’envoyez les photos du bien, de l’atelier ou de la boutique.' },
          { n: '02', title: 'Génération', desc: 'Je génère et monte une vidéo courte au ton de trailer.' },
          { n: '03', title: 'Livraison', desc: 'Vous recevez un fichier prêt à publier — réseaux, site, portails d’annonces.' },
        ],
        benefitsLabel: 'Pourquoi cette approche',
        benefits: [
          { title: 'Rapide', desc: 'Pas de tournage à organiser : votre vidéo est prête en quelques jours.' },
          { title: 'Économique', desc: 'Sans déplacement ni matériel de tournage, un coût largement inférieur à une captation classique.' },
          { title: 'Cohérent avec votre image', desc: 'Le ton et le rythme sont adaptés à votre secteur, pas un montage générique.' },
        ],
        faqLabel: 'Questions fréquentes',
        faq: [
          { q: 'Combien de temps pour recevoir ma vidéo ?', a: 'Comptez quelques jours après réception de vos photos, selon la complexité souhaitée.' },
          { q: 'Puis-je demander des retouches ?', a: 'Oui, un ou deux allers-retours sont inclus pour ajuster le rythme, la musique ou les plans mis en avant.' },
          { q: 'Quels formats sont livrés ?', a: "Un format adapté à vos besoins : portails d'annonces, réseaux sociaux (vertical) ou site internet, selon votre usage." },
        ],
        tarifLabel: 'Tarif',
        tarif: 'Sur devis, selon le nombre de photos et la durée souhaitée.',
        ctaLabel: 'Discuter de votre projet vidéo',
      },
      {
        slug: 'contenu-reseaux-sociaux',
        metaTitle: 'Contenu réseaux sociaux IA',
        metaDescription: "Formats courts générés par IA à partir de vos photos pour exister sur les réseaux sociaux, sans y passer vos soirées.",
        cardTitle: 'Contenu réseaux sociaux',
        cardDesc: 'Des formats courts, générés à partir de vos photos, pour exister en ligne sans y passer vos soirées.',
        pageEyebrow: 'Réseaux sociaux',
        h1: 'Du contenu court, régulièrement, sans y passer vos soirées',
        intro: 'À partir de vos photos (produits, réalisations, quotidien de votre activité), je génère des formats courts pensés pour Instagram et Facebook.',
        notice: null,
        audienceLabel: 'Pour qui',
        audience: [
          'Artisans qui veulent montrer leurs réalisations régulièrement',
          'Commerçants qui veulent faire vivre leur vitrine en ligne',
          'Indépendants qui veulent une présence régulière sans s’improviser créateur de contenu',
        ],
        stepsLabel: 'Comment ça marche',
        steps: [
          { n: '01', title: 'Vos photos', desc: 'Vous m’envoyez vos photos existantes, sans mise en scène particulière.' },
          { n: '02', title: 'Génération', desc: 'Je génère des formats courts adaptés aux réseaux (Reels, stories).' },
          { n: '03', title: 'Livraison', desc: 'Prêts à publier, au rythme qui vous convient — ponctuel ou mensuel.' },
        ],
        benefitsLabel: 'Pourquoi cette approche',
        benefits: [
          { title: 'Régulier', desc: 'Un flux de contenu sans avoir à y penser chaque semaine.' },
          { title: 'Adapté aux formats courts', desc: 'Pensé pour les Reels et stories, pas du contenu recyclé au format inadapté.' },
          { title: 'Sans matériel supplémentaire', desc: 'Vos photos existantes suffisent, pas besoin de nouvelle séance.' },
        ],
        faqLabel: 'Questions fréquentes',
        faq: [
          { q: 'Combien de contenus par livraison ?', a: 'Selon vos besoins et le rythme choisi — on en discute ensemble au moment du devis.' },
          { q: 'Dois-je fournir de nouvelles photos à chaque fois ?', a: 'Pas nécessairement : vos photos existantes peuvent alimenter plusieurs formats différents.' },
          { q: 'Puis-je arrêter à tout moment si c’est un abonnement mensuel ?', a: 'Oui, aucun engagement de durée n’est imposé.' },
        ],
        tarifLabel: 'Tarif',
        tarif: 'Sur devis, selon le rythme souhaité (mission ponctuelle ou accompagnement mensuel).',
        ctaLabel: 'Discuter de votre présence en ligne',
      },
      {
        slug: 'audit-site-web',
        metaTitle: 'Audit de site internet',
        metaDescription: 'Diagnostic clair de la performance, du référencement et de l’accessibilité de votre site existant à Angoulême et en Charente.',
        cardTitle: 'Audit de site existant',
        cardDesc: 'Un diagnostic clair de ce qui freine la performance de votre site actuel.',
        pageEyebrow: 'Audit',
        h1: 'Votre site existe déjà ? Voyons ce qui freine sa performance',
        intro: 'Vitesse de chargement, référencement local, accessibilité, conformité RGPD : un diagnostic clair de ce qui pourrait être amélioré sur votre site actuel, sans que vous ayez besoin de tout refaire.',
        notice: null,
        audienceLabel: 'Pour qui',
        audience: [
          'Un site fait par une agence qui semble à la traîne',
          'Un site créé avec un outil en ligne, jamais vraiment optimisé',
          'Un site plus vieux de quelques années qui mérite une mise à jour',
        ],
        stepsLabel: 'Comment ça marche',
        steps: [
          { n: '01', title: 'Analyse', desc: 'J’analyse la performance technique de votre site actuel.' },
          { n: '02', title: 'Rapport', desc: 'Vous recevez un rapport clair avec les priorités identifiées.' },
          { n: '03', title: 'Corrections', desc: 'En mission ponctuelle ou en accompagnement, selon vos besoins.' },
        ],
        benefitsLabel: 'Pourquoi cette approche',
        benefits: [
          { title: 'Clair', desc: 'Un rapport lisible, sans jargon technique inutile.' },
          { title: 'Priorisé', desc: 'Vous savez par où commencer, pas une liste de 50 points sans hiérarchie.' },
          { title: 'Sans obligation de refonte', desc: 'Le diagnostic n’engage à rien : vous choisissez ensuite ce que vous corrigez, et avec qui.' },
        ],
        faqLabel: 'Questions fréquentes',
        faq: [
          { q: 'L’audit est-il valable pour tout type de site ?', a: 'Oui, qu’il ait été fait par une agence, un outil en ligne ou vous-même.' },
          { q: 'Combien de temps prend un audit ?', a: 'Généralement quelques jours, selon la taille du site.' },
          { q: 'Suis-je obligé de vous confier les corrections ?', a: 'Non, le rapport est à vous : vous pouvez le faire corriger par qui vous voulez.' },
        ],
        tarifLabel: 'Tarif',
        tarif: 'Sur devis, selon l’ampleur du site.',
        ctaLabel: 'Demander un audit',
      },
    ],
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Discutons de votre projet',
    subtitle: 'Parlez-moi de votre activité, de votre objectif et de votre échéance. Je vous réponds sous 24 à 48 h avec les prochaines étapes.',
    form: {
      action: 'https://formsubmit.co/arthur.avetisian@hotmail.com',
      fields: {
        name: { label: 'Nom', id: 'contact-name', type: 'text', required: true },
        email: { label: 'Email', id: 'contact-email', type: 'email', required: true },
        phone: { label: 'Téléphone — facultatif', id: 'contact-phone', type: 'tel', required: false },
        projectType: {
          label: 'Type de projet',
          id: 'contact-project-type',
          required: true,
          placeholder: 'Choisir…',
          options: [
            'Site vitrine une page',
            'Site multi-pages',
            'Refonte de site existant',
            'Vidéo IA de présentation',
            'Contenu réseaux sociaux',
            'Audit de site existant',
            'Autre',
          ],
        },
        message: { label: 'Message', id: 'contact-message', placeholder: 'Votre activité, ce que vous souhaitez améliorer et votre échéance…', required: true },
      },
      submit: 'Envoyer ma demande',
      consentText: 'En envoyant ce formulaire, j’accepte que mes données soient utilisées pour traiter ma demande. Voir la',
      consentLink: { label: 'politique de confidentialité', href: '/confidentialite' },
    },
    infoTitle: 'Mes coordonnées',
    availability: 'Disponible pour un échange téléphonique ou un rendez-vous en visio, du lundi au vendredi.',
  },

  cookieBanner: {
    text: 'Ce site utilise des cookies à des fins de mesure d’audience (statistiques de visites). Vous pouvez accepter ou refuser.',
    accept: 'Accepter',
    refuse: 'Refuser',
    manage: 'Gérer les cookies',
    link: { label: 'En savoir plus', href: '/confidentialite' },
  },

  mobileCta: {
    label: 'Demander un devis',
    href: '/#contact',
  },

  footer: {
    tagline: 'Création de sites internet sur-mesure à Angoulême.',
    legalLinks: [
      { label: 'Mentions légales', href: '/mentions-legales' },
      { label: 'Confidentialité', href: '/confidentialite' },
    ],
  },
};
