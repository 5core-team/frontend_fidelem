import type { Role } from "@/config/api";

/** Espace connecté de chaque rôle. */
export const cheminEspace = (role?: Role | null) =>
  role === "manager" ? "/responsable" : role === "advisor" ? "/espace-conseiller" : "/mon-espace";

export const libelleRole = (role?: Role | null) =>
  role === "manager" ? "Responsable financier" : role === "advisor" ? "Conseiller financier" : "Usager";
