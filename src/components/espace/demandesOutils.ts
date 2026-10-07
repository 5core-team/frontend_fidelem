import { FINANCEMENTS } from "@/donnees/fidelem";
import type { Demande } from "@/config/apiEspace";

// Outils d'affichage des demandes, partagés par les espaces conseiller et responsable.

export const nomFinancement = (f: string) => FINANCEMENTS.find((x) => x.slug === f)?.court ?? (f === "conseil" ? "Conseil" : f);
export const dateCourte = (s?: string) => (s ? new Date(s).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : "—");
export const rdvTexte = (d: Demande) => (d.rendezVous?.date ? `${dateCourte(d.rendezVous.date)} · ${d.rendezVous.creneau?.split(" (")[0] ?? ""}` : "À fixer");
export const ORIGINES: Record<Demande["origine"], string> = { site: "Formulaire du site", espace: "Créée dans l'espace", historique: "Ancienne plateforme" };
/** Les adresses de fiche acceptent encore l'ancien préfixe « site- » ou « historique- ». */
export const idDepuisAdresse = (id: string) => id.replace(/^(site|historique)-/, "");
