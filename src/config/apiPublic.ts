import { http } from "./http";

// Appels des formulaires du site public (contrat : docs/CONTRAT-API.md du dépôt backend_fidelem).

export type RendezVous = {
  mode: string;
  date: string;
  creneau: string;
  autresDisponibilites: string[];
  zone: string;
  contactPrefere: string;
};

export type Coordonnees = { prenom: string; nom: string; telephone: string; email: string };

export type DemandeFinancement = Coordonnees & {
  financement: string;
  montant: number;
  duree: number;
  objet: string;
  message: string;
  conseillerId?: string;
  rendezVous: RendezVous;
};

export type MessageContact = Coordonnees & { objet: string; message: string; rendezVous: RendezVous };

export type Candidature = Coordonnees & {
  niveauVise: string;
  situation: string;
  experience: string;
  motDePasse: string;
  rendezVous: RendezVous;
};

export type InteretEasyLife = Coordonnees & { profil: string; pole: string; message: string; rendezVous: RendezVous };

export type ConseillerPublic = {
  id: string;
  prenom: string;
  nom: string;
  zone: string;
  niveau: "inclusion" | "croissance" | "patrimoine";
  financements: string[];
  photo?: string | null;
};

export const envoyerDemandeFinancement = (d: DemandeFinancement) => http.post("/demandes-financement", d);
export const envoyerMessageContact = (d: MessageContact) => http.post("/messages-contact", d);
export const envoyerCandidature = (d: Candidature) => http.post("/candidatures-conseiller", d);
export const envoyerInteretEasyLife = (d: InteretEasyLife) => http.post("/easylife/interets", d);

export const rechercherConseillers = async (zone: string): Promise<ConseillerPublic[]> => {
  const { data } = await http.get("/conseillers", { params: { zone } });
  return Array.isArray(data) ? data : data?.data ?? [];
};
