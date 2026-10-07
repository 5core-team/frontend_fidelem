import { http } from "./http";
import type { Compte } from "./api";
import type { RendezVous } from "./apiPublic";

// Espaces connectés : demandes de financement, clients, conseillers et back-office.

export const STATUTS = ["Nouvelle", "Prise en charge", "Rendez-vous fixé", "Dossier en cours", "Acceptée", "Refusée"] as const;
export type Statut = typeof STATUTS[number];

export type Note = { id?: string | number; texte: string; date: string; auteur?: string | null };

export type Demande = {
  id: string;
  /** site : formulaire public ; espace : créée depuis un espace ; historique : ancienne plateforme. */
  origine: "site" | "espace" | "historique";
  usager: { nom: string; telephone?: string; email?: string; id?: string };
  financement: string;
  objet: string;
  montant: number;
  duree: number;
  message?: string;
  zone?: string;
  rendezVous?: Partial<RendezVous>;
  statut: Statut;
  conseillerId?: string;
  conseiller?: { id: string; nom: string; telephone?: string } | null;
  creeLe: string;
  notes?: Note[];
};

type Brut = Record<string, unknown>;

const statut = (s: unknown): Statut => ((STATUTS as readonly string[]).includes(String(s)) ? (s as Statut) : "Nouvelle");
const texte = (v: unknown) => (v === null || v === undefined || v === "" ? undefined : String(v));

/** Convertit une demande de l'API (DemandeResource) au format de l'interface. */
export const normaliser = (r: Brut): Demande => {
  const conseiller = r.conseiller as { id: number | string; nom: string; telephone?: string } | null | undefined;
  return {
    id: String(r.id),
    origine: (["site", "espace", "historique"].includes(String(r.origine)) ? r.origine : "site") as Demande["origine"],
    usager: {
      nom: [r.prenom, r.nom].filter(Boolean).join(" ") || "Usager",
      telephone: texte(r.telephone),
      email: texte(r.email),
      id: texte(r.usagerId),
    },
    financement: String(r.financement ?? ""),
    objet: String(r.objet ?? ""),
    montant: Number(r.montant ?? 0),
    duree: Number(r.duree ?? 0),
    message: texte(r.message),
    zone: texte(r.zone) ?? texte((r.rendezVous as RendezVous | undefined)?.zone),
    rendezVous: (r.rendezVous as RendezVous | null) ?? undefined,
    statut: statut(r.statut),
    conseillerId: texte(r.conseillerId),
    conseiller: conseiller ? { id: String(conseiller.id), nom: conseiller.nom, telephone: conseiller.telephone } : null,
    creeLe: String(r.created_at ?? new Date().toISOString()),
    notes: ((r.notes as Note[] | undefined) ?? []).map((n) => ({ ...n, date: String(n.date) })),
  };
};

const liste = <T = Brut>(d: unknown): T[] => (Array.isArray(d) ? d : Array.isArray((d as { data?: unknown })?.data) ? (d as { data: T[] }).data : []) as T[];
const demandes = async (url: string) => liste((await http.get(url)).data).map(normaliser);

/* Demandes */

/** Espace Conseiller : demandes de la zone et demandes adressées au conseiller, pas encore prises en charge. */
export const demandesDeMaZone = () => demandes("/conseiller/demandes-zone");
/** Espace Conseiller : dossiers suivis par le conseiller connecté. */
export const mesDemandes = () => demandes("/credit-requests-conseiller");
/** Mon espace : demandes de l'usager connecté. */
export const demandesUsager = () => demandes("/credit-requests-client");
/** Back-office : toutes les demandes. */
export const toutesLesDemandes = () => demandes("/credit-requests-admin");

export const prendreEnCharge = (d: Demande) => http.post(`/demandes-financement/${d.id}/prise-en-charge`);
export const changerStatut = (d: Demande, s: Statut) => http.put(`/demandes-financement/${d.id}/statut`, { statut: s });
export const ajouterNote = (d: Demande, texteNote: string) => http.post(`/demandes-financement/${d.id}/notes`, { texte: texteNote });
export const confirmerRendezVous = (d: Demande, rdv: Partial<RendezVous>) => http.put(`/demandes-financement/${d.id}/rendez-vous`, rdv);

/** Nouvelle demande depuis un espace : pour soi (usager) ou pour un client (conseiller, avec clientId). */
export const nouvelleDemande = (d: { montant: number; duree: number; financement: string; objet: string; message: string; rendezVous?: RendezVous; clientId?: string }) =>
  http.post("/credit-requests", {
    amount: d.montant,
    duration: d.duree,
    financement: d.financement,
    purpose: d.objet,
    additional_details: d.message,
    ...(d.clientId ? { clientId: d.clientId } : {}),
    rendez_vous: d.rendezVous,
    zone: d.rendezVous?.zone || undefined,
  });

/* Clients et conseillers */

export type NouveauCompte = { name: string; last_name: string; email: string; phone: string; address?: string; password: string };

export const clientsConseiller = async (conseillerId: string | number) => liste<Compte>((await http.get(`/advisor/${conseillerId}/clients`)).data);
export const creerClient = (d: NouveauCompte) => http.post<Compte>("/conseiller/clients", d);
export const creerConseiller = (d: NouveauCompte & { zone?: string; niveau?: string; financements?: string[] }) => http.post<Compte>("/responsable/conseillers", d);
export const attribuerZone = (conseillerId: string | number, zone: string | null) => http.put<Compte>(`/conseillers/${conseillerId}/zone`, { zone });

/* Back-office */

export type CandidatureRecue = {
  id: string | number; prenom: string; nom: string; telephone: string; email: string;
  niveauVise: string; situation: string; rendezVous?: Partial<RendezVous> | null; statutCompte?: string; created_at: string;
};
export type MessageRecu = {
  id: string | number; prenom: string; nom: string; telephone: string; email?: string | null;
  objet: string; message: string; rendezVous?: Partial<RendezVous> | null; created_at: string;
};
export type InteretRecu = {
  id: string | number; prenom: string; nom: string; telephone: string; email?: string | null;
  profil?: string | null; pole?: string | null; message?: string | null; created_at?: string;
};

export const candidaturesConseillers = async () => liste<CandidatureRecue>((await http.get("/candidatures-conseiller")).data);
export const messagesContact = async () => liste<MessageRecu>((await http.get("/messages-contact")).data);
export const interetsEasyLife = async () => liste<InteretRecu>((await http.get("/easylife/interets")).data);
