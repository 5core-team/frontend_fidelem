import type { AxiosAdapter, AxiosInstance, InternalAxiosRequestConfig } from "axios";

// ============================================================================
// Mode démonstration : les espaces connectés fonctionnent sans serveur, avec
// des données d'exemple. On l'active depuis /demo ; tous les appels axios sont
// alors servis ici, et les modifications (prise en charge, statut…) restent en mémoire.
// ============================================================================

const CLE = "fidelem-demo";
/** La démo n'existe qu'en local (npm run dev), ou si VITE_DEMO=1 est défini au build. */
export const DEMO_DISPONIBLE = import.meta.env.DEV || import.meta.env.VITE_DEMO === "1";
export const modeDemo = () => { if (!DEMO_DISPONIBLE) return false; try { return localStorage.getItem(CLE) === "1"; } catch { return false; } };

export const COMPTES_DEMO = {
  advisor: { id: "c1", name: "Aïcha", last_name: "Houénou", email: "aicha.houenou@demo.fidelem.pro", phone: "01 97 00 11 22", address: "Cotonou", role: "advisor", zone: "Cotonou", niveau: "Croissance" },
  user: { id: "u1", name: "Rodrigue", last_name: "Agossou", email: "rodrigue.agossou@demo.fidelem.pro", phone: "01 96 12 34 56", address: "Akpakpa, Cotonou", role: "user", conseiller_nom: "Aïcha Houénou", conseiller_telephone: "01 97 00 11 22" },
  manager: { id: "m1", name: "Responsable", last_name: "FIDELEM", email: "responsable@demo.fidelem.pro", phone: "01 66 11 11 64", address: "Cotonou", role: "manager" },
} as const;

export function activerDemo(role: keyof typeof COMPTES_DEMO) {
  localStorage.setItem(CLE, "1");
  localStorage.setItem("user", JSON.stringify(COMPTES_DEMO[role]));
  localStorage.setItem("authToken", "demo");
}
export function quitterDemo() {
  localStorage.removeItem(CLE); localStorage.removeItem("user"); localStorage.removeItem("authToken");
}

const jour = (decalage: number) => { const d = new Date(); d.setDate(d.getDate() + decalage); return d.toISOString().slice(0, 10); };
const instant = (decalage: number) => { const d = new Date(); d.setDate(d.getDate() + decalage); return d.toISOString(); };

// Demandes envoyées depuis le site, pas encore prises en charge (zone de Cotonou).
const DEMANDES_ZONE = [
  { id: "s101", prenom: "Bernadette", nom: "Kpossou", telephone: "01 95 44 21 08", email: "b.kpossou@exemple.bj", financement: "immobilier", objet: "Construction d'une maison", montant: 18000000, duree: 120, message: "Terrain acquis à Fidjrossè, je veux construire 3 chambres.", zone: "Cotonou", rendezVous: { mode: "En agence", date: jour(2), creneau: "Matin (8 h – 12 h)", autresDisponibilites: ["Mardi", "Jeudi"], zone: "Cotonou", contactPrefere: "Appel" }, statut: "Nouvelle", created_at: instant(-1) },
  { id: "s102", prenom: "Koffi", nom: "Dossa", telephone: "01 94 10 77 32", financement: "transport", objet: "Taxi-moto et tricycle", montant: 1200000, duree: 24, message: "Deux motos pour ma petite flotte de livraison.", zone: "Cotonou", rendezVous: { mode: "Sur WhatsApp", date: jour(1), creneau: "Fin de journée (17 h – 19 h)", autresDisponibilites: ["Samedi"], zone: "Cotonou", contactPrefere: "WhatsApp" }, statut: "Nouvelle", created_at: instant(0) },
  { id: "s103", prenom: "Mariam", nom: "Bello", telephone: "01 97 55 63 90", email: "mariam.bello@exemple.bj", financement: "affaires", objet: "Fonds de roulement et stock", montant: 3500000, duree: 18, message: "Boutique de pagnes au marché Dantokpa, besoin de stock pour les fêtes.", zone: "Cotonou", rendezVous: { mode: "Par téléphone", date: jour(3), creneau: "Après-midi (14 h – 17 h)", autresDisponibilites: [], zone: "Cotonou", contactPrefere: "Appel" }, statut: "Nouvelle", created_at: instant(-2) },
];

// Dossiers déjà suivis par la conseillère (format de l'API existante).
const DOSSIERS = [
  { id: "h201", user_id: "u1", user: { name: "Rodrigue", last_name: "Agossou", phone: "01 96 12 34 56", email: "rodrigue.agossou@demo.fidelem.pro", id: "u1" }, amount: 6500000, duration: 48, purpose: "Transport · Véhicule de livraison", additional_details: "Camionnette pour ma boulangerie.", status: "En attente", zone: "Cotonou", rendez_vous: { mode: "En agence", date: jour(1), creneau: "Matin (8 h – 12 h)", contactPrefere: "Appel" }, created_at: instant(-6) },
  { id: "h202", user_id: "u2", user: { name: "Florence", last_name: "Adjovi", phone: "01 91 22 33 44", email: "f.adjovi@exemple.bj", id: "u2" }, amount: 25000000, duration: 180, purpose: "Immobilier · Achat d'un logement", additional_details: "", status: "Approuvé", created_at: instant(-20) },
  { id: "h203", user_id: "u3", user: { name: "Serge", last_name: "Tossou", phone: "01 98 76 54 32", email: "s.tossou@exemple.bj", id: "u3" }, amount: 8000000, duration: 36, purpose: "Affaires · Achat d'équipement", additional_details: "Machines pour un atelier de couture.", status: "En attente", zone: "Cotonou", rendez_vous: { mode: "Par téléphone", date: jour(3), creneau: "Après-midi (14 h – 17 h)", contactPrefere: "WhatsApp" }, created_at: instant(-9) },
  { id: "h204", user_id: "u4", user: { name: "Nadège", last_name: "Hounkpè", phone: "01 90 11 12 13", email: "n.hounkpe@exemple.bj", id: "u4" }, amount: 2000000, duration: 24, purpose: "Transport · Véhicule personnel", additional_details: "", status: "Rejeté", created_at: instant(-30) },
];

const CLIENTS = [
  { id: "u1", name: "Rodrigue", last_name: "Agossou", email: "rodrigue.agossou@demo.fidelem.pro", phone: "01 96 12 34 56", address: "Akpakpa, Cotonou" },
  { id: "u2", name: "Florence", last_name: "Adjovi", email: "f.adjovi@exemple.bj", phone: "01 91 22 33 44", address: "Cadjèhoun, Cotonou" },
  { id: "u3", name: "Serge", last_name: "Tossou", email: "s.tossou@exemple.bj", phone: "01 98 76 54 32", address: "Godomey" },
  { id: "u4", name: "Nadège", last_name: "Hounkpè", email: "n.hounkpe@exemple.bj", phone: "01 90 11 12 13", address: "Gbégamey, Cotonou" },
];

const UTILISATEURS = [
  ...CLIENTS.map((c) => ({ ...c, type_compte: "user", statut: "Actif", created_at: instant(-40) })),
  { id: "c1", name: "Aïcha", last_name: "Houénou", email: "aicha.houenou@demo.fidelem.pro", phone: "01 97 00 11 22", address: "Cotonou", type_compte: "advisor", statut: "Actif", zone: "Cotonou", created_at: instant(-90) },
  { id: "c2", name: "Jean-Marc", last_name: "Zinsou", email: "jm.zinsou@exemple.bj", phone: "01 93 40 50 60", address: "Abomey-Calavi", type_compte: "advisor", statut: "Actif", zone: "Abomey-Calavi", created_at: instant(-70) },
  { id: "c3", name: "Clarisse", last_name: "Ahouandjinou", email: "c.ahouandjinou@exemple.bj", phone: "01 92 80 70 60", address: "Porto-Novo", type_compte: "advisor", statut: "En attente", zone: "Porto-Novo", created_at: instant(-3) },
];

const CONSEILLERS_PUBLICS = [
  { id: "c1", prenom: "Aïcha", nom: "Houénou", zone: "Cotonou", niveau: "croissance", financements: ["Immobilier", "Affaires"] },
  { id: "c4", prenom: "Romain", nom: "Gbaguidi", zone: "Cotonou", niveau: "inclusion", financements: ["Transport", "Affaires"] },
  { id: "c2", prenom: "Jean-Marc", nom: "Zinsou", zone: "Abomey-Calavi", niveau: "patrimoine", financements: ["Immobilier"] },
  { id: "c5", prenom: "Sandrine", nom: "Dégbé", zone: "Porto-Novo", niveau: "croissance", financements: ["Immobilier", "Transport"] },
];

const CANDIDATURES = [
  { prenom: "Clarisse", nom: "Ahouandjinou", telephone: "01 92 80 70 60", niveauVise: "CF Croissance", rendezVous: { zone: "Porto-Novo", date: jour(4), creneau: "Matin (8 h – 12 h)" } },
  { prenom: "Ulrich", nom: "Mensah", telephone: "01 99 21 43 65", niveauVise: "CF Inclusion", rendezVous: { zone: "Parakou", date: jour(6), creneau: "Après-midi (14 h – 17 h)" } },
];

const INTERETS = [
  { prenom: "Estelle", nom: "Kiki", profil: "Travailleur", pole: "EasyLife Living", telephone: "01 95 66 77 88", message: "Logement meublé proche de Ganhi." },
  { prenom: "SOBEBRA", nom: "RH", profil: "Entreprise", pole: "EasyLife Business", telephone: "01 21 33 44 55", message: "Avantages sociaux pour 120 employés." },
];

const reponse = (config: InternalAxiosRequestConfig, data: unknown, status = 200) =>
  new Promise<never>((ok) => setTimeout(() => ok({ data, status, statusText: "OK", headers: {}, config } as never), 250));

/** Sert toutes les requêtes avec les données d'exemple. */
const adaptateur: AxiosAdapter = (config) => {
  const url = (config.url || "").split("?")[0];
  const m = (config.method || "get").toLowerCase();
  if (m !== "get") return reponse(config, { ok: true, message: "Mode démonstration : action simulée." });
  const routes: [RegExp, unknown][] = [
    [/^\/conseiller\/demandes-zone$/, DEMANDES_ZONE],
    [/^\/credit-requests-conseiller$/, DOSSIERS],
    [/^\/credit-requests-client$/, DOSSIERS.filter((d) => d.user_id === "u1")],
    [/^\/credit-requests-admin$/, DOSSIERS],
    [/^\/advisor\/[^/]+\/clients$/, CLIENTS],
    [/^\/advisor\/[^/]+\/stats$/, { totalUsers: 4, pendingRequests: 2, approvedRequests: 1 }],
    [/^\/users$/, UTILISATEURS],
    [/^\/user-stats$/, { pendingUsers: 1, totalUsers: 4, totalAdvisors: 3 }],
    [/^\/credit-stats$/, { total: DOSSIERS.length + DEMANDES_ZONE.length }],
    [/^\/candidatures-conseiller$/, CANDIDATURES],
    [/^\/easylife\/interets$/, INTERETS],
    [/^\/active-credits$/, []],
  ];
  const trouve = routes.find(([r]) => r.test(url));
  if (url === "/conseillers") {
    const zone = String((config.params as { zone?: string })?.zone ?? "");
    return reponse(config, CONSEILLERS_PUBLICS.filter((c) => c.zone === zone));
  }
  return reponse(config, trouve ? trouve[1] : [], trouve ? 200 : 200);
};

/** Branche le mode démonstration sur une instance axios (sans effet si le mode n'est pas actif). */
export function brancherDemo(instance: AxiosInstance) {
  if (!DEMO_DISPONIBLE) return;
  if (modeDemo()) instance.defaults.adapter = adaptateur;
}
