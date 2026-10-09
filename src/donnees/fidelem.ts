// ============================================================================
// Contenus du site FIDELEM.
// Sources : présentation « Conseiller Financier Autonome · FIDELEM 2026 »,
// document « Écosystème EasyLife », brief de mise à jour du site.
// Les éléments marqués « À CONFIRMER » n'existent dans aucun document reçu.
// ============================================================================

// Coordonnees donnees par FIDELEM (document « Correction pour le site »).
export const CONTACT = {
  telephone: "01 55 57 32 10",
  telephoneLien: "+2290155573210",
  site: "www.fidelem.pro",
  pays: "Bénin",
  // Adresse de contact donnée par FIDELEM.
  email: "prendrecontact@fidelem.pro",
  adresse: "Menontin, Von Fifa, Cotonou",
  // À CONFIRMER : horaires (aucun document ne les donne).
  horaires: "Du lundi au vendredi, 8 h – 18 h",
};

export const NAVIGATION = [
  { libelle: "Accueil", chemin: "/" },
  { libelle: "Services", chemin: "/services" },
  { libelle: "EasyLife", chemin: "/easylife" },
  { libelle: "Conseiller Financier", chemin: "/conseiller-financier" },
  { libelle: "À propos", chemin: "/a-propos" },
  { libelle: "Contact", chemin: "/contact" },
];

export type Financement = {
  slug: "immobilier" | "transport" | "affaires";
  nom: string;
  court: string;
  accroche: string;
  resume: string;
  image: string;
  projets: string[];
  pourQui: string[];
  pieces: string[];
  etapes: { titre: string; texte: string }[];
  simulateur: { min: number; max: number; pas: number; defaut: number; dureeMin: number; dureeMax: number; dureeDefaut: number };
  faq: { q: string; r: string }[];
};

const etapesCommunes = [
  { titre: "Votre demande", texte: "Vous décrivez votre projet en ligne et choisissez un créneau de rendez-vous." },
  { titre: "Le rendez-vous", texte: "Un conseiller FIDELEM de votre zone vous contacte et étudie votre situation avec vous." },
  { titre: "Le dossier", texte: "Il vous aide à réunir les pièces et monte un dossier solide, présenté aux partenaires financiers." },
  { titre: "La réponse", texte: "Vous suivez l'avancement depuis votre espace, jusqu'à la décision et au déblocage des fonds." },
];

// À CONFIRMER : projets couverts, profils et pièces à fournir (aucun document ne détaille les financements).
export const FINANCEMENTS: Financement[] = [
  {
    slug: "immobilier",
    nom: "Financement immobilier",
    court: "Immobilier",
    accroche: "Devenir propriétaire, construire, rénover.",
    resume: "Pour acheter un terrain, faire construire, acquérir un logement ou rénover, avec un conseiller qui monte le dossier à vos côtés.",
    image: "/images/bureau.jpg",
    projets: ["Achat de terrain", "Construction d'une maison", "Achat d'un logement", "Rénovation et extension", "Achat de parcelle en lotissement"],
    pourQui: ["Salariés du public et du privé", "Commerçants et indépendants", "Membres de la diaspora", "Couples et familles"],
    pieces: ["Pièce d'identité en cours de validité", "Justificatifs de revenus des 3 derniers mois", "Relevés bancaires ou de mobile money", "Documents du bien : convention de vente, permis, devis", "Justificatif de domicile"],
    etapes: etapesCommunes,
    simulateur: { min: 1_000_000, max: 100_000_000, pas: 500_000, defaut: 15_000_000, dureeMin: 12, dureeMax: 240, dureeDefaut: 120 },
    faq: [
      { q: "Peut-on financer l'achat d'un terrain seul ?", r: "Oui. Le conseiller vérifie avec vous les documents du terrain avant de présenter le dossier." },
      { q: "Faut-il un apport personnel ?", r: "Cela dépend du projet et du partenaire financier. Votre conseiller vous dit dès le premier rendez-vous ce qui est attendu." },
    ],
  },
  {
    slug: "transport",
    nom: "Financement transport",
    court: "Transport",
    accroche: "Le véhicule qui vous fait avancer.",
    resume: "Pour acheter un véhicule personnel ou un outil de travail : taxi, moto, tricycle, véhicule de livraison ou camion.",
    image: "/images/analyse.jpg",
    projets: ["Véhicule personnel", "Taxi-moto et tricycle", "Taxi et VTC", "Véhicule de livraison", "Camion et transport de marchandises"],
    pourQui: ["Salariés", "Conducteurs et transporteurs", "Commerçants", "Petites entreprises de logistique"],
    pieces: ["Pièce d'identité en cours de validité", "Justificatifs de revenus ou d'activité", "Facture pro forma du véhicule", "Permis de conduire", "Justificatif de domicile"],
    etapes: etapesCommunes,
    simulateur: { min: 300_000, max: 40_000_000, pas: 100_000, defaut: 3_500_000, dureeMin: 6, dureeMax: 60, dureeDefaut: 36 },
    faq: [
      { q: "Le véhicule peut-il être d'occasion ?", r: "Votre conseiller vous indique les conditions acceptées par les partenaires selon l'âge et l'état du véhicule." },
      { q: "Je n'ai pas de fiche de paie, est-ce possible ?", r: "Oui, les revenus d'activité peuvent être pris en compte. Le conseiller vous aide à les justifier." },
    ],
  },
  {
    slug: "affaires",
    nom: "Financement d'affaires",
    court: "Affaires",
    accroche: "Lancer, équiper, développer votre activité.",
    resume: "Pour créer ou développer une activité : fonds de roulement, stock, équipement, local ou extension.",
    image: "/images/documents.jpg",
    projets: ["Fonds de roulement et stock", "Achat d'équipement", "Aménagement d'un local", "Création d'activité", "Extension et nouveaux marchés"],
    pourQui: ["Commerçants et artisans", "Très petites et petites entreprises", "Coopératives et groupements", "Porteurs de projet"],
    pieces: ["Pièce d'identité du dirigeant", "Registre de commerce ou IFU", "États financiers ou cahier de comptes", "Plan d'affaires ou devis", "Relevés bancaires ou de mobile money"],
    etapes: etapesCommunes,
    simulateur: { min: 500_000, max: 150_000_000, pas: 500_000, defaut: 10_000_000, dureeMin: 6, dureeMax: 84, dureeDefaut: 36 },
    faq: [
      { q: "Mon entreprise est jeune, puis-je faire une demande ?", r: "Oui. Le conseiller vous aide à présenter votre projet et vos perspectives de façon crédible." },
      { q: "Le conseiller m'aide-t-il pour le plan d'affaires ?", r: "Oui, c'est l'une des compétences des conseillers de niveau Croissance, formés au SYSCOHADA révisé." },
    ],
  },
];

// Taux indicatifs repris du site existant. À CONFIRMER avec FIDELEM.
export const TAUX = [
  { libelle: "Taux standard", valeur: 5 },
  { libelle: "Taux majoré", valeur: 7 },
];

export const EASYLIFE = {
  slogan: "Simplifier la vie, construire l'avenir.",
  presentation: "Des services intégrés pour mieux vivre au quotidien.",
  living: {
    nom: "EasyLife Living",
    accroche: "Le confort de vie tout-en-un",
    texte: "Logement, charges, transport, santé et épargne réunis pour les travailleurs.",
    offre: [
      { titre: "Logement meublé", icone: "maison" },
      { titre: "Eau, électricité et gaz", icone: "energie" },
      { titre: "Transport domicile-travail", icone: "bus" },
      { titre: "Assurance maladie", icone: "sante" },
      { titre: "Forfait de communication", icone: "telephone" },
      { titre: "Panier alimentaire", icone: "panier" },
      { titre: "Programme d'épargne", icone: "epargne" },
      { titre: "Assistance et accompagnement", icone: "assistance" },
    ],
  },
  // Les deux volets de financement d'EasyLife (document « Correction pour le
  // site » : EasyLife, moyen de financement pour obtenir des biens, et
  // financement de la consommation). Offres reprises du document EasyLife.
  volets: [
    {
      nom: "Obtention de biens",
      titre: "Financer les biens dont vous avez besoin.",
      texte: "EasyLife vous aide à acquérir un bien sans tout payer d'un coup : vous épargnez et remboursez progressivement, accompagné par un conseiller FIDELEM et nos partenaires bancaires.",
      points: ["Équipement de la maison", "Matériel de travail", "Moyen de transport", "Logement", "Épargne programmée", "Partenaires banques et institutions financières"],
    },
    {
      nom: "Consommation",
      titre: "Financer les dépenses du quotidien.",
      texte: "Logement, énergie, transport, alimentation, santé : EasyLife réunit vos dépenses essentielles en une offre unique, réglée chaque mois, pour maîtriser votre budget et préparer vos projets.",
      points: ["Logement meublé", "Eau, électricité et gaz", "Transport domicile-travail", "Panier alimentaire", "Assurance maladie", "Forfait de communication"],
    },
  ],
  poles: [
    { nom: "Services", titre: "Les services du quotidien", texte: "Pour faire gagner du temps aux particuliers et aux professionnels.", offres: ["Livraison de courses", "Conciergerie", "Entretien ménager", "Blanchisserie", "Assistance administrative", "Courses et commissions", "Services à domicile"] },
    { nom: "Finance", titre: "Épargner et réaliser ses projets", texte: "Pour construire progressivement son patrimoine.", offres: ["Solutions d'épargne", "Acquisition de biens", "Éducation financière", "Produits financiers adaptés", "Partenariats bancaires"] },
    { nom: "Mobility", titre: "Une mobilité plus simple", texte: "Pour réduire les contraintes des déplacements quotidiens.", offres: ["Transport domicile-travail", "Navettes professionnelles", "Covoiturage", "Mobilité partagée", "Location de véhicules"] },
    { nom: "Business", titre: "Des solutions pour les entreprises", texte: "Pour le bien-être et la performance des collaborateurs.", offres: ["Bien-être des employés", "Avantages sociaux", "Fidélisation du personnel", "Accompagnement RH", "Motivation et rétention"] },
  ],
  vision: "Devenir la référence africaine des solutions intégrées de bien-être, de confort de vie et d'inclusion économique.",
  mission: "Simplifier le quotidien des populations grâce à des services innovants, accessibles et intégrés répondant aux principaux besoins de la vie moderne.",
  valeurs: [
    { nom: "Innovation", texte: "Des solutions nouvelles adaptées aux réalités africaines." },
    { nom: "Excellence", texte: "Des services de qualité et une expérience soignée." },
    { nom: "Accessibilité", texte: "Les services essentiels à la portée du plus grand nombre." },
    { nom: "Transparence", texte: "De l'intégrité dans toutes nos relations." },
    { nom: "Impact social", texte: "Une amélioration durable des conditions de vie." },
  ],
  feuilleDeRoute: [
    { horizon: "Court terme", texte: "Lancer et développer EasyLife Living, première offre de l'écosystème." },
    { horizon: "Moyen terme", texte: "Déployer les autres pôles et renforcer le réseau de partenaires." },
    { horizon: "Long terme", texte: "Devenir la première plateforme africaine de services intégrés dédiée au bien-être et au cadre de vie." },
  ],
};

export type Formation = {
  id: "inclusion" | "croissance" | "patrimoine";
  niveau: number;
  nom: string;
  clientele: string;
  prix: number;
  duree: string;
  rythme: string;
  competences: string[];
  revenu: number;
  debouches: string[];
};

export const FORMATIONS: Formation[] = [
  { id: "inclusion", niveau: 1, nom: "Inclusion", clientele: "Clients au revenu mensuel inférieur à 100 000 FCFA", prix: 50_000, duree: "3 mois", rythme: "3 séances de 2 h 30 par semaine", competences: ["Vulgariser les concepts financiers", "Maîtriser les outils de microfinance, de comptabilité et d'éducation financière", "Développer sa sensibilité à l'inclusion financière"], revenu: 100_000, debouches: ["Conseiller en microfinance (IMF)", "Agent de développement local", "Formateur en éducation financière"] },
  { id: "croissance", niveau: 2, nom: "Croissance", clientele: "Clients au revenu mensuel inférieur à 1 500 000 FCFA", prix: 100_000, duree: "5 mois", rythme: "3 séances de 2 h 30 par semaine", competences: ["Analyse financière d'entreprise", "Maîtrise du SYSCOHADA révisé", "Montage de dossiers de financement complexes", "Assistance aux négociations bancaires"], revenu: 200_000, debouches: ["Conseiller en gestion financière", "Consultant en financement d'entreprises", "Chargé de clientèle PME en banque"] },
  { id: "patrimoine", niveau: 3, nom: "Patrimoine", clientele: "Clients au revenu mensuel supérieur à 1 500 000 FCFA", prix: 150_000, duree: "7 mois", rythme: "3 séances de 2 h 30 par semaine", competences: ["Gestion de patrimoine", "Instruments financiers complexes", "Conseil en transmission et en stratégie"], revenu: 300_000, debouches: ["Gestionnaire de patrimoine (CGP)", "Conseiller en gestion de fortune", "Analyste financier senior", "Expert en transmission d'entreprise"] },
];

export const PARCOURS_CONSEILLER = [
  { titre: "Échange", texte: "Analyse de vos besoins et de vos objectifs." },
  { titre: "Validation du programme", texte: "Un test fixe le niveau adapté, puis le parcours est validé." },
  { titre: "Inscription et cours", texte: "Sessions interactives, exercices pratiques et cas concrets béninois." },
  { titre: "Suivi, évaluation, licence", texte: "Mesure des acquis, certificat, licence de travail et remboursement des frais de formation." },
];

export const FRAIS = {
  inscription: 5_000,
  // À CONFIRMER : année et date de la prochaine session.
  dateLimite: "20 septembre",
};

export const ENGAGEMENTS = [
  { titre: "Qualité pédagogique", texte: "Formateurs experts du SYSCOHADA et professionnels de la finance." },
  { titre: "Certification reconnue", texte: "Attestation de capacitation aux standards OHADA." },
  { titre: "Digital et technologies", texte: "Formation aux outils modernes et aux innovations du marché." },
  { titre: "Licence de travail", texte: "Attribution d'une zone de gestion et d'une équipe commerciale." },
];

// Liste provisoire de zones (communes du Bénin). À CONFIRMER : découpage voulu par FIDELEM.
export const ZONES = [
  "Cotonou", "Abomey-Calavi", "Porto-Novo", "Sèmè-Podji", "Ouidah", "Allada", "Bohicon", "Abomey",
  "Lokossa", "Comè", "Grand-Popo", "Pobè", "Kétou", "Savè", "Dassa-Zoumè", "Savalou",
  "Parakou", "Djougou", "Natitingou", "Kandi", "Malanville", "Nikki", "Bembèrèkè",
];

export const FAQ: { theme: string; questions: { q: string; r: string }[] }[] = [
  {
    theme: "Financement",
    questions: [
      { q: "Comment fonctionne une demande de financement ?", r: "Vous remplissez une demande en ligne en indiquant votre projet, votre zone et vos disponibilités. Un conseiller FIDELEM de votre zone vous contacte, étudie votre situation, monte le dossier avec vous et le présente aux partenaires financiers. Vous suivez l'avancement depuis votre espace." },
      { q: "Quels financements propose FIDELEM ?", r: "Trois familles : le financement immobilier (terrain, construction, achat, rénovation), le financement transport (véhicule personnel ou de travail) et le financement d'affaires (fonds de roulement, équipement, création ou développement d'activité)." },
      { q: "Quels documents dois-je fournir ?", r: "En général une pièce d'identité, des justificatifs de revenus ou d'activité et les documents liés au projet (devis, facture pro forma, convention de vente). La liste exacte dépend du financement : votre conseiller vous la remet au premier rendez-vous." },
      { q: "Combien de temps faut-il pour obtenir une réponse ?", r: "Un conseiller vous recontacte rapidement après votre demande. Le délai de décision dépend ensuite du dossier et du partenaire financier : comptez en général 48 à 72 heures une fois le dossier complet." },
      { q: "Puis-je rembourser par anticipation ?", r: "Oui, le remboursement anticipé est possible. Votre conseiller vous précise les conditions applicables à votre financement." },
    ],
  },
  {
    theme: "Conseiller Financier",
    questions: [
      { q: "Comment devenir Conseiller Financier ?", r: "Vous déposez votre candidature en ligne. Après un premier échange, un test fixe le niveau de formation adapté : Inclusion, Croissance ou Patrimoine. Vous suivez la formation (3 à 7 mois, 3 séances de 2 h 30 par semaine), puis, après évaluation, vous recevez votre certificat et une licence de travail avec une zone de gestion et une équipe commerciale." },
      { q: "Combien coûtent les formations ?", r: "50 000 FCFA pour Inclusion, 100 000 FCFA pour Croissance et 150 000 FCFA pour Patrimoine, payables en 3 fois au début de chaque mois. S'y ajoutent 5 000 FCFA de frais d'inscription, non remboursables." },
      { q: "Les frais de formation sont-ils remboursés ?", r: "Oui. Les frais de formation sont entièrement remboursés à la signature du contrat, après validation de la formation. Seuls les frais d'inscription ne sont pas remboursables." },
      { q: "Puis-je choisir mon niveau de formation ?", r: "Vous indiquez le niveau visé dans votre candidature, mais le niveau définitif est fixé après le test, pour que la formation corresponde à votre profil." },
      { q: "Comment trouver un conseiller près de chez moi ?", r: "Utilisez la recherche « Trouver un conseiller » : indiquez votre commune pour voir les conseillers de votre zone et leur demander un rendez-vous." },
    ],
  },
  {
    theme: "EasyLife et compte",
    questions: [
      { q: "Qu'est-ce qu'EasyLife ?", r: "Un écosystème de services pour améliorer le quotidien : EasyLife Living (le confort de vie tout-en-un), Services, Finance, Mobility et Business." },
      { q: "Que comprend EasyLife Living ?", r: "Un logement meublé, l'eau, l'électricité et le gaz, le transport domicile-travail, une assurance maladie, un forfait de communication, un panier alimentaire, un programme d'épargne et une assistance." },
      { q: "Comment prendre rendez-vous ?", r: "Chaque formulaire du site vous permet de choisir le mode de rendez-vous (agence, téléphone, visio ou WhatsApp), une date, un créneau et vos autres disponibilités." },
      { q: "Comment suivre ma demande ?", r: "Connectez-vous à votre espace pour voir le statut de vos demandes, votre conseiller et vos prochains rendez-vous." },
    ],
  },
];

export const formatFcfa = (n: number) => `${new Intl.NumberFormat("fr-FR").format(Math.round(n)).replace(/\u202F|\u00A0/g, " ")} FCFA`;
