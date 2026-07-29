// Contenu du site — séparé du template (build.mjs).
// Modifier ce fichier pour changer les textes ; la mise en page vit dans build.mjs / styles/main.css.

export const content = {
  meta: {
    siteName: 'Arthur Avetisian',
    title: 'Arthur Avetisian — Création de sites internet à Angoulême',
    description: "Création de sites internet sur-mesure à Angoulême pour avocats, artisans et indépendants. Devis gratuit, sites qui inspirent confiance.",
    domain: 'https://DOMAINE-A-DEFINIR.fr',
    email: '[MON_EMAIL]',
    phone: '[TELEPHONE_A_COMPLETER]',
    phoneDisplay: '[Téléphone à compléter]',
    year: new Date().getFullYear(),
  },

  nav: {
    logo: 'Arthur Avetisian',
    links: [
      { label: 'Prestations', href: '#prestations' },
      { label: 'Réalisations', href: '#realisation' },
      { label: 'Tarifs', href: '#tarifs' },
      { label: 'Contact', href: '#contact' },
    ],
    cta: 'Demander un devis',
  },

  hero: {
    eyebrow: 'Création de sites internet — Angoulême & Charente',
    title: 'Des sites internet qui donnent envie de vous faire confiance',
    titleAccent: 'confiance',
    subtitle: "Je conçois des sites sur-mesure pour les professionnels d'Angoulême et de Charente — avocats, artisans, indépendants — pensés pour transformer vos visiteurs en clients.",
    ctaPrimary: { label: 'Demander un devis', href: '#contact' },
    ctaSecondary: { label: 'Voir une réalisation', href: '#realisation' },
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
    screenshotPlaceholder: 'Capture d’écran du site à intégrer',
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

  contact: {
    eyebrow: 'Contact',
    title: 'Discutons de votre projet',
    subtitle: 'Décrivez-moi votre besoin, je reviens vers vous sous 24 à 48h.',
    form: {
      action: 'https://formsubmit.co/[MON_EMAIL]',
      fields: {
        name: { label: 'Nom', id: 'contact-name', type: 'text', required: true },
        email: { label: 'Email', id: 'contact-email', type: 'email', required: true },
        phone: { label: 'Téléphone', id: 'contact-phone', type: 'tel', required: false },
        projectType: {
          label: 'Type de projet',
          id: 'contact-project-type',
          required: true,
          options: [
            'Site vitrine une page',
            'Site multi-pages',
            'Refonte de site existant',
            'Autre',
          ],
        },
        message: { label: 'Message', id: 'contact-message', required: true },
      },
      submit: 'Envoyer ma demande',
    },
    infoTitle: 'Mes coordonnées',
    zone: 'Angoulême et Charente',
    zoneLabel: 'Zone d’intervention',
    availability: 'Disponible pour un échange téléphonique ou un rendez-vous en visio, du lundi au vendredi.',
  },

  cookieBanner: {
    text: 'Ce site utilise des cookies de mesure d’audience (Google Analytics) pour améliorer votre expérience. Vous pouvez accepter ou refuser.',
    accept: 'Accepter',
    refuse: 'Refuser',
    link: { label: 'En savoir plus', href: 'confidentialite.html' },
  },

  mobileCta: {
    label: 'Demander un devis',
    href: '#contact',
  },

  footer: {
    tagline: 'Création de sites internet sur-mesure à Angoulême.',
    legalLinks: [
      { label: 'Mentions légales', href: 'mentions-legales.html' },
      { label: 'Confidentialité', href: 'confidentialite.html' },
    ],
  },
};
