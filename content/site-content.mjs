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
      { label: 'Réalisations', href: '/#realisation' },
      { label: 'Tarifs', href: '/#tarifs' },
      { label: 'Contact', href: '/#contact' },
    ],
    solutionsLabel: 'Solutions',
    cta: 'Demander un devis',
  },

  hero: {
    eyebrow: 'Création de sites internet — Angoulême & Charente',
    title: 'Des sites internet qui donnent envie de vous faire confiance',
    titleAccent: 'faire confiance',
    // Le carrousel défile dans cet ordre puis se fige sur le dernier ("faire confiance").
    // La partie fixe s'arrête à "…de vous" ; "faire" ne revient qu'avec le mot final.
    titleAccentWords: ['remarquer', 'choisir', 'contacter', 'connaître', 'faire confiance'],
    subtitle: "Je conçois des sites sur-mesure pour les professionnels d'Angoulême et de Charente — avocats, artisans, indépendants — pensés pour transformer vos visiteurs en clients.",
    ctaPrimary: { label: 'Demander un devis', href: '/#contact' },
    ctaSecondary: { label: 'Voir une réalisation', href: '/#realisation' },
    scrollHint: 'Découvrir',
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
    title: 'Ce que je propose',
    items: [
      {
        title: 'Site vitrine sur-mesure',
        desc: 'Un design pensé pour votre activité et votre image, jamais un thème générique.',
      },
      {
        title: "Espace d'administration",
        desc: 'Modifiez vous-même vos textes, vos images et vos actualités, sans aucune compétence technique.',
      },
      {
        title: 'Blog & actualités',
        desc: 'Publiez vos actualités, cas clients ou conseils pour rester visible et actif.',
      },
      {
        title: 'Formulaire de contact qualifié',
        desc: 'Récupérez des demandes déjà qualifiées, prêtes à être traitées.',
      },
      {
        title: 'Optimisation mobile',
        desc: 'Un site pensé mobile-first, agréable à consulter sur tous les écrans.',
      },
      {
        title: 'Mise en ligne & nom de domaine',
        desc: "Je m'occupe de l'hébergement et du nom de domaine : clé en main.",
      },
      {
        title: 'Référencement local de base',
        desc: 'Votre activité visible sur Angoulême et en Charente dès la mise en ligne.',
      },
      {
        title: 'Maintenance & mises à jour',
        desc: 'Un suivi mensuel en option pour garder votre site à jour et fonctionnel, sans y penser.',
      },
    ],
  },

  caseStudy: {
    eyebrow: 'Étude de cas',
    title: 'Cabinet Laperonnie',
    subtitle: 'Avocat à Angoulême',
    needLabel: 'Le besoin',
    need: "Le Cabinet Laperonnie souhaitait une présence en ligne à la hauteur de son expertise, avec une mise en avant particulière de son activité en droit des cryptomonnaies — un domaine de niche qui demande à la fois pédagogie et crédibilité renforcée.",
    responseLabel: 'La réponse',
    response: "Un site multi-pages à l'identité soignée, un espace d'administration permettant au cabinet de gérer lui-même ses contenus, une attention particulière portée à la conformité déontologique propre à la profession d'avocat, et un référencement local pensé pour Angoulême et la Charente.",
    link: { label: 'Voir le site en ligne', href: 'https://laperonnie-avocat.fr/' },
    testimonialPlaceholder: 'Témoignage client à intégrer',
  },

  pricing: {
    eyebrow: 'Tarifs',
    title: 'Des formules claires',
    plans: [
      {
        name: 'Essentiel',
        price: '990 €',
        note: null,
        tagline: 'Idéal pour une présence simple et efficace.',
        features: [
          'Site une page (landing)',
          'Formulaire de contact',
          '100 % adapté mobile',
          'Mise en ligne incluse',
          '1h de prise en main',
        ],
        featured: false,
      },
      {
        name: 'Professionnel',
        price: '2 490 €',
        note: null,
        tagline: 'La formule la plus complète pour une activité qui se développe.',
        features: [
          'Site multi-pages (jusqu’à 5-6 pages)',
          'Espace d’administration pour gérer son contenu',
          'Blog / actualités',
          'Formulaire qualifié',
          'Référencement local de base',
          '2h de formation',
        ],
        featured: true,
        badge: 'Le plus choisi',
      },
      {
        name: 'Premium',
        pricePrefix: 'à partir de',
        price: '4 490 €',
        note: 'Sur devis',
        tagline: 'Suivi et accompagnement pour un projet complet sur-mesure.',
        features: [
          'Site complet sur-mesure',
          'Fonctionnalités avancées',
          'Suivi et accompagnement',
        ],
        featured: false,
      },
    ],
    footnote: 'Maintenance et mises à jour disponibles en option à 49 €/mois.',
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
        desc: 'Des allers-retours jusqu’à ce que vous soyez pleinement satisfait.',
      },
      {
        n: '04',
        title: 'Mise en ligne & formation',
        desc: 'Votre site est publié et vous savez le gérer en autonomie.',
      },
    ],
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
        a: 'Oui, à partir de la formule Professionnel, vous disposez d’un espace d’administration simple pour modifier vos textes, images et actualités sans aucune compétence technique.',
      },
      {
        q: 'Le nom de domaine et l’hébergement sont-ils inclus ?',
        a: 'Oui, la mise en ligne, le nom de domaine et l’hébergement sont inclus dans chaque formule.',
      },
      {
        q: 'Que se passe-t-il après la livraison ?',
        a: 'Vous êtes formé à la gestion de votre site et je reste disponible. Une option de maintenance mensuelle existe si vous préférez déléguer les mises à jour.',
      },
      {
        q: 'Que se passe-t-il si je ne suis pas satisfait du résultat ?',
        a: 'Chaque formule inclut des allers-retours de validation avant la mise en ligne : nous ajustons ensemble jusqu’à ce que le résultat vous corresponde.',
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
          { n: '02', title: 'Génération', desc: 'Je génère des formats courts adaptés aux réseaux (réels, stories).' },
          { n: '03', title: 'Livraison', desc: 'Prête à publier, au rythme qui vous convient — ponctuel ou mensuel.' },
        ],
        benefitsLabel: 'Pourquoi cette approche',
        benefits: [
          { title: 'Régulier', desc: 'Un flux de contenu sans avoir à y penser chaque semaine.' },
          { title: 'Adapté aux formats courts', desc: 'Pensé pour les réels et stories, pas du contenu recyclé au format inadapté.' },
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
    subtitle: 'Décrivez-moi votre besoin, je reviens vers vous sous 24 à 48h.',
    form: {
      action: 'https://formsubmit.co/arthur.avetisian@hotmail.com',
      fields: {
        name: { label: 'Nom', id: 'contact-name', type: 'text', required: true },
        email: { label: 'Email', id: 'contact-email', type: 'email', required: true },
        phone: { label: 'Téléphone', id: 'contact-phone', type: 'tel', required: false },
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
        message: { label: 'Message', id: 'contact-message', required: true },
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
