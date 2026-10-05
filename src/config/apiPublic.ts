import axios from "axios";
import { brancherDemo } from "./demo";

// Appels du site public. Ces routes sont NOUVELLES : le back-end doit les créer
// (voir BACKEND-A-PREVOIR.md à la racine du projet). En attendant, les formulaires
// affichent un message d'erreur clair avec le numéro de téléphone de FIDELEM.

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

brancherDemo(client);
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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
  photo?: string;
};

export const envoyerDemandeFinancement = (d: DemandeFinancement) => client.post("/demandes-financement", d);
export const envoyerMessageContact = (d: MessageContact) => client.post("/messages-contact", d);
export const envoyerCandidature = (d: Candidature) => client.post("/candidatures-conseiller", d);
export const envoyerInteretEasyLife = (d: InteretEasyLife) => client.post("/easylife/interets", d);
export const demanderReinitialisation = (email: string) => client.post("/mot-de-passe/oubli", { email });

export const rechercherConseillers = async (zone: string): Promise<ConseillerPublic[]> => {
  const { data } = await client.get("/conseillers", { params: { zone } });
  return Array.isArray(data) ? data : data?.data ?? [];
};
