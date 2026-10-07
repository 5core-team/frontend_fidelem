import type { AxiosAdapter, InternalAxiosRequestConfig } from "axios";

// Données d'exemple du mode démonstration, au format de l'API (voir apiEspace.ts).

const CLE = "fidelem-demo";

export const COMPTES_DEMO = {
  advisor: { id: "c1", name: "Aïcha", last_name: "Houénou", email: "aicha.houenou@demo.fidelem.pro", phone: "01 97 00 11 22", address: "Cotonou", role: "advisor", statut: "Actif", zone: "Cotonou", niveau: "croissance", financements: ["Immobilier", "Affaires"] },
  user: { id: "u1", name: "Rodrigue", last_name: "Agossou", email: "rodrigue.agossou@demo.fidelem.pro", phone: "01 96 12 34 56", address: "Akpakpa, Cotonou", role: "user", statut: "Actif", conseiller_nom: "Aïcha Houénou", conseiller_telephone: "01 97 00 11 22" },
  manager: { id: "m1", name: "Responsable", last_name: "FIDELEM", email: "responsable@demo.fidelem.pro", phone: "01 66 11 11 64", address: "Cotonou", role: "manager", statut: "Actif" },
} as const;

export function activerDemo(role: keyof typeof COMPTES_DEMO) {
  localStorage.setItem(CLE, "1");
  localStorage.setItem("user", JSON.stringify(COMPTES_DEMO[role]));
  localStorage.setItem("authToken", "demo");
}

const jour = (decalage: number) => { const d = new Date(); d.setDate(d.getDate() + decalage); return d.toISOString().slice(0, 10); };
const instant = (decalage: number) => { const d = new Date(); d.setDate(d.getDate() + decalage); return d.toISOString(); };
const conseillere = { id: "c1", nom: "Aïcha Houénou", telephone: "01 97 00 11 22" };

// Demandes envoyées depuis le site, pas encore prises en charge (zone de Cotonou).
const DEMANDES_ZONE = [
  { id: "101", origine: "site", prenom: "Bernadette", nom: "Kpossou", telephone: "01 95 44 21 08", email: "b.kpossou@exemple.bj", financement: "immobilier", objet: "Construction d'une maison", montant: 18000000, duree: 120, message: "Terrain acquis à Fidjrossè, je veux construire 3 chambres.", zone: "Cotonou", rendezVous: { mode: "En agence", date: jour(2), creneau: "Matin (8 h – 12 h)", autresDisponibilites: ["Mardi", "Jeudi"], zone: "Cotonou", contactPrefere: "Appel" }, statut: "Nouvelle", conseillerId: null, notes: [], created_at: instant(-1) },
  { id: "102", origine: "site", prenom: "Koffi", nom: "Dossa", telephone: "01 94 10 77 32", email: null, financement: "transport", objet: "Taxi-moto et tricycle", montant: 1200000, duree: 24, message: "Deux motos pour ma petite flotte de livraison.", zone: "Cotonou", rendezVous: { mode: "Sur WhatsApp", date: jour(1), creneau: "Fin de journée (17 h – 19 h)", autresDisponibilites: ["Samedi"], zone: "Cotonou", contactPrefere: "WhatsApp" }, statut: "Nouvelle", conseillerId: null, notes: [], created_at: instant(0) },
  { id: "103", origine: "site", prenom: "Mariam", nom: "Bello", telephone: "01 97 55 63 90", email: "mariam.bello@exemple.bj", financement: "affaires", objet: "Fonds de roulement et stock", montant: 3500000, duree: 18, message: "Boutique de pagnes au marché Dantokpa, besoin de stock pour les fêtes.", zone: "Cotonou", rendezVous: { mode: "Par téléphone", date: jour(3), creneau: "Après-midi (14 h – 17 h)", autresDisponibilites: [], zone: "Cotonou", contactPrefere: "Appel" }, statut: "Nouvelle", conseillerId: null, notes: [], created_at: instant(-2) },
];

// Dossiers déjà suivis par la conseillère.
const DOSSIERS = [
  { id: "201", origine: "espace", usagerId: "u1", prenom: "Rodrigue", nom: "Agossou", telephone: "01 96 12 34 56", email: "rodrigue.agossou@demo.fidelem.pro", financement: "transport", objet: "Véhicule de livraison", montant: 6500000, duree: 48, message: "Camionnette pour ma boulangerie.", statut: "Rendez-vous fixé", zone: "Cotonou", rendezVous: { mode: "En agence", date: jour(1), creneau: "Matin (8 h – 12 h)", contactPrefere: "Appel" }, conseillerId: "c1", conseiller: conseillere, notes: [{ texte: "Facture pro forma reçue.", date: instant(-3), auteur: "Aïcha Houénou" }], created_at: instant(-6) },
  { id: "202", origine: "historique", usagerId: "u2", prenom: "Florence", nom: "Adjovi", telephone: "01 91 22 33 44", email: "f.adjovi@exemple.bj", financement: "immobilier", objet: "Achat d'un logement", montant: 25000000, duree: 180, message: null, statut: "Acceptée", zone: "Cotonou", rendezVous: null, conseillerId: "c1", conseiller: conseillere, notes: [], created_at: instant(-20) },
  { id: "203", origine: "espace", usagerId: "u3", prenom: "Serge", nom: "Tossou", telephone: "01 98 76 54 32", email: "s.tossou@exemple.bj", financement: "affaires", objet: "Achat d'équipement", montant: 8000000, duree: 36, message: "Machines pour un atelier de couture.", statut: "Dossier en cours", zone: "Cotonou", rendezVous: { mode: "Par téléphone", date: jour(3), creneau: "Après-midi (14 h – 17 h)", contactPrefere: "WhatsApp" }, conseillerId: "c1", conseiller: conseillere, notes: [], created_at: instant(-9) },
  { id: "204", origine: "historique", usagerId: "u4", prenom: "Nadège", nom: "Hounkpè", telephone: "01 90 11 12 13", email: "n.hounkpe@exemple.bj", financement: "transport", objet: "Véhicule personnel", montant: 2000000, duree: 24, message: null, statut: "Refusée", zone: "Cotonou", rendezVous: null, conseillerId: "c1", conseiller: conseillere, notes: [], created_at: instant(-30) },
];

const CLIENTS = [
  { id: "u1", name: "Rodrigue", last_name: "Agossou", email: "rodrigue.agossou@demo.fidelem.pro", phone: "01 96 12 34 56", address: "Akpakpa, Cotonou" },
  { id: "u2", name: "Florence", last_name: "Adjovi", email: "f.adjovi@exemple.bj", phone: "01 91 22 33 44", address: "Cadjèhoun, Cotonou" },
  { id: "u3", name: "Serge", last_name: "Tossou", email: "s.tossou@exemple.bj", phone: "01 98 76 54 32", address: "Godomey" },
  { id: "u4", name: "Nadège", last_name: "Hounkpè", email: "n.hounkpe@exemple.bj", phone: "01 90 11 12 13", address: "Gbégamey, Cotonou" },
];

const UTILISATEURS = [
  ...CLIENTS.map((c) => ({ ...c, type_compte: "user", statut: "Actif", created_at: instant(-40) })),
  { id: "c1", name: "Aïcha", last_name: "Houénou", email: "aicha.houenou@demo.fidelem.pro", phone: "01 97 00 11 22", address: "Cotonou", type_compte: "advisor", statut: "Actif", zone: "Cotonou", niveau: "croissance", financements: ["Immobilier", "Affaires"], created_at: instant(-90) },
  { id: "c2", name: "Jean-Marc", last_name: "Zinsou", email: "jm.zinsou@exemple.bj", phone: "01 93 40 50 60", address: "Abomey-Calavi", type_compte: "advisor", statut: "Actif", zone: "Abomey-Calavi", niveau: "patrimoine", financements: ["Immobilier"], created_at: instant(-70) },
  { id: "c3", name: "Clarisse", last_name: "Ahouandjinou", email: "c.ahouandjinou@exemple.bj", phone: "01 92 80 70 60", address: "Porto-Novo", type_compte: "advisor", statut: "En attente", zone: null, niveau: null, financements: [], created_at: instant(-3) },
  { id: "c4", name: "Romain", last_name: "Gbaguidi", email: "r.gbaguidi@exemple.bj", phone: "01 93 11 22 33", address: "Cotonou", type_compte: "advisor", statut: "Actif", zone: null, niveau: "inclusion", financements: ["Transport"], created_at: instant(-12) },
];

const CONSEILLERS_PUBLICS = [
  { id: "c1", prenom: "Aïcha", nom: "Houénou", zone: "Cotonou", niveau: "croissance", financements: ["Immobilier", "Affaires"] },
  { id: "c4", prenom: "Romain", nom: "Gbaguidi", zone: "Cotonou", niveau: "inclusion", financements: ["Transport", "Affaires"] },
  { id: "c2", prenom: "Jean-Marc", nom: "Zinsou", zone: "Abomey-Calavi", niveau: "patrimoine", financements: ["Immobilier"] },
  { id: "c5", prenom: "Sandrine", nom: "Dégbé", zone: "Porto-Novo", niveau: "croissance", financements: ["Immobilier", "Transport"] },
];

const CANDIDATURES = [
  { id: 1, prenom: "Clarisse", nom: "Ahouandjinou", telephone: "01 92 80 70 60", email: "c.ahouandjinou@exemple.bj", niveauVise: "CF Croissance", situation: "Salarié(e)", statutCompte: "En attente", rendezVous: { zone: "Porto-Novo", date: jour(4), creneau: "Matin (8 h – 12 h)" }, created_at: instant(-3) },
  { id: 2, prenom: "Ulrich", nom: "Mensah", telephone: "01 99 21 43 65", email: "u.mensah@exemple.bj", niveauVise: "CF Inclusion", situation: "Étudiant(e)", statutCompte: "En attente", rendezVous: { zone: "Parakou", date: jour(6), creneau: "Après-midi (14 h – 17 h)" }, created_at: instant(-1) },
];

const MESSAGES = [
  { id: 1, prenom: "Estelle", nom: "Kiki", telephone: "01 95 66 77 88", email: "e.kiki@exemple.bj", objet: "EasyLife", message: "Je cherche un logement meublé proche de Ganhi, avec le transport compris.", rendezVous: { zone: "Cotonou", date: jour(2), creneau: "Midi (12 h – 14 h)", contactPrefere: "WhatsApp" }, created_at: instant(0) },
  { id: 2, prenom: "Paterne", nom: "Agbo", telephone: "01 96 45 32 10", email: null, objet: "Demande de financement", message: "Je voudrais savoir si un salarié du privé peut financer un terrain à Calavi.", rendezVous: { zone: "Abomey-Calavi", date: jour(1), creneau: "Matin (8 h – 12 h)", contactPrefere: "Appel" }, created_at: instant(-1) },
  { id: 3, prenom: "Yolande", nom: "Sossa", telephone: "01 97 12 45 78", email: "y.sossa@exemple.bj", objet: "Autre", message: "Avez-vous une agence à Bohicon ?", rendezVous: null, created_at: instant(-4) },
];

const INTERETS = [
  { id: 1, prenom: "Estelle", nom: "Kiki", profil: "Travailleur", pole: "EasyLife Living", telephone: "01 95 66 77 88", message: "Logement meublé proche de Ganhi.", created_at: instant(0) },
  { id: 2, prenom: "SOBEBRA", nom: "RH", profil: "Entreprise", pole: "EasyLife Business", telephone: "01 21 33 44 55", message: "Avantages sociaux pour 120 employés.", created_at: instant(-2) },
];

const TOUTES = [...DEMANDES_ZONE, ...DOSSIERS];

const reponse = (config: InternalAxiosRequestConfig, data: unknown, status = 200) =>
  new Promise<never>((ok) => setTimeout(() => ok({ data, status, statusText: "OK", headers: {}, config } as never), 250));

const utilisateurCourant = () => { try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; } };

/** Sert toutes les requêtes avec les données d'exemple. Les écritures sont simulées. */
export const adaptateur: AxiosAdapter = (config) => {
  const url = (config.url || "").split("?")[0];
  const m = (config.method || "get").toLowerCase();
  if (url === "/update-profile" && m === "post") {
    const corps = JSON.parse(String(config.data || "{}"));
    const u = { ...utilisateurCourant(), name: corps.firstName, last_name: corps.lastName, email: corps.email, phone: corps.phone, address: corps.address };
    return reponse(config, { message: "Profil mis à jour (démonstration).", user: u });
  }
  if (m !== "get") return reponse(config, { ok: true, message: "Mode démonstration : action simulée." });

  if (url === "/conseillers") {
    const zone = String((config.params as { zone?: string })?.zone ?? "");
    return reponse(config, CONSEILLERS_PUBLICS.filter((c) => c.zone === zone));
  }
  const routes: [RegExp, unknown][] = [
    [/^\/me$/, utilisateurCourant()],
    [/^\/conseiller\/demandes-zone$/, DEMANDES_ZONE],
    [/^\/credit-requests-conseiller$/, DOSSIERS],
    [/^\/credit-requests-client$/, DOSSIERS.filter((d) => d.usagerId === "u1")],
    [/^\/credit-requests-admin$/, TOUTES],
    [/^\/advisor\/[^/]+\/clients$/, CLIENTS],
    [/^\/users$/, UTILISATEURS],
    [/^\/user-stats$/, { pendingUsers: 1, totalUsers: CLIENTS.length, totalAdvisors: 4 }],
    [/^\/credit-stats$/, { total: TOUTES.length }],
    [/^\/candidatures-conseiller$/, CANDIDATURES],
    [/^\/messages-contact$/, MESSAGES],
    [/^\/easylife\/interets$/, INTERETS],
  ];
  const trouve = routes.find(([r]) => r.test(url));
  return reponse(config, trouve ? trouve[1] : []);
};
