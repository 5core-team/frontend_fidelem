import axios from "axios";
import { getCreditRequestsConseiller, getCreditRequests, getClientsByAdvisor, updateCreditRequestStatus, createCreditRequest } from "./api";
import type { RendezVous } from "./apiPublic";

// Espaces connectés. Les demandes viennent de deux sources :
//  - l'API existante (/credit-requests-…), pour les demandes déjà en base ;
//  - les nouvelles routes (/demandes-financement…), à créer côté back-end, pour les
//    demandes envoyées depuis le site public avec la zone et le rendez-vous.
// Les deux formats sont ramenés au type Demande ci-dessous.

const client = axios.create({ baseURL: import.meta.env.VITE_API_URL, headers: { "Content-Type": "application/json" }, timeout: 15000 });
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const STATUTS = ["Nouvelle", "Prise en charge", "Rendez-vous fixé", "Dossier en cours", "Acceptée", "Refusée"] as const;
export type Statut = typeof STATUTS[number];

export type Demande = {
  id: string;
  source: "historique" | "site";
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
  creeLe: string;
  notes?: { texte: string; date: string; auteur?: string }[];
};

const statutDepuisAncien = (s?: string): Statut => {
  const v = (s || "").toLowerCase();
  if (v.startsWith("approuv")) return "Acceptée";
  if (v.includes("jet")) return "Refusée";
  if (v.includes("attente")) return "Dossier en cours";
  return (STATUTS as readonly string[]).includes(s || "") ? (s as Statut) : "Nouvelle";
};

type Brut = Record<string, unknown> & { user?: { name?: string; last_name?: string; phone?: string; email?: string; id?: string } };

export const normaliser = (r: Brut): Demande => {
  const ancien = "amount" in r || "purpose" in r;
  if (ancien) {
    return {
      id: String(r.id), source: "historique",
      usager: { nom: [r.user?.name, r.user?.last_name].filter(Boolean).join(" ") || "Usager", telephone: r.user?.phone, email: r.user?.email, id: r.user?.id ? String(r.user.id) : String(r.user_id ?? "") },
      financement: String(r.purpose ?? "Financement"), objet: String(r.purpose ?? ""),
      montant: Number(r.amount ?? 0), duree: Number(r.duration ?? 0), message: (r.additional_details as string) || undefined,
      statut: statutDepuisAncien(r.status as string), creeLe: String(r.created_at ?? new Date().toISOString()),
    };
  }
  return {
    id: String(r.id), source: "site",
    usager: { nom: [r.prenom, r.nom].filter(Boolean).join(" ") || "Usager", telephone: r.telephone as string, email: r.email as string },
    financement: String(r.financement ?? ""), objet: String(r.objet ?? ""),
    montant: Number(r.montant ?? 0), duree: Number(r.duree ?? 0), message: r.message as string,
    zone: (r.zone as string) ?? (r.rendezVous as RendezVous | undefined)?.zone, rendezVous: r.rendezVous as RendezVous,
    statut: statutDepuisAncien(r.statut as string), conseillerId: r.conseillerId ? String(r.conseillerId) : undefined,
    creeLe: String(r.created_at ?? r.creeLe ?? new Date().toISOString()), notes: (r.notes as Demande["notes"]) ?? [],
  };
};

const liste = (d: unknown): Brut[] => (Array.isArray(d) ? d : Array.isArray((d as { data?: unknown })?.data) ? (d as { data: Brut[] }).data : []) as Brut[];

/** Demandes de la zone du conseiller, pas encore prises en charge (nouvelle route). */
export const demandesDeMaZone = async (): Promise<Demande[]> => liste((await client.get("/conseiller/demandes-zone")).data).map(normaliser);

/** Demandes suivies par le conseiller (route existante). */
export const mesDemandes = async (conseillerId: string): Promise<Demande[]> => liste(await getCreditRequestsConseiller(conseillerId)).map(normaliser);

/** Demandes d'un usager (route existante). */
export const demandesUsager = async (usagerId: string): Promise<Demande[]> => liste(await getCreditRequests(usagerId)).map(normaliser);

export const clientsConseiller = async (conseillerId: string) => liste((await getClientsByAdvisor(conseillerId)).data);

export const prendreEnCharge = (d: Demande) => client.post(`/demandes-financement/${d.id}/prise-en-charge`);

export const changerStatut = (d: Demande, statut: Statut) => {
  if (d.source === "historique") {
    const ancien = statut === "Acceptée" ? "Approuvé" : statut === "Refusée" ? "Rejeté" : "En attente";
    return updateCreditRequestStatus(d.id, ancien);
  }
  return client.put(`/demandes-financement/${d.id}/statut`, { statut });
};

export const ajouterNote = (d: Demande, texte: string) => client.post(`/demandes-financement/${d.id}/notes`, { texte });
export const confirmerRendezVous = (d: Demande, rdv: Partial<RendezVous>) => client.put(`/demandes-financement/${d.id}/rendez-vous`, rdv);

export const nouvelleDemandeUsager = (usagerId: string, d: { montant: number; duree: number; objet: string; message: string; rendezVous: RendezVous }) =>
  createCreditRequest({ amount: d.montant, duration: d.duree, purpose: d.objet, additional_details: d.message, clientId: usagerId, rendez_vous: d.rendezVous, zone: d.rendezVous.zone });

// Back-office responsable
export const candidaturesConseillers = async () => liste((await client.get("/candidatures-conseiller")).data);
export const interetsEasyLife = async () => liste((await client.get("/easylife/interets")).data);
export const attribuerZone = (conseillerId: string, zone: string) => client.put(`/conseillers/${conseillerId}/zone`, { zone });
