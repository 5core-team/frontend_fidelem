import axios, { isAxiosError } from "axios";
import { brancherDemo } from "./demo";

export const CLE_JETON = "authToken";
export const CLE_UTILISATEUR = "user";

const lire = (cle: string) => { try { return localStorage.getItem(cle); } catch { return null; } };

/** Client HTTP unique de l'application. VITE_API_URL se termine par /api. */
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  timeout: 15000,
});

brancherDemo(http);

http.interceptors.request.use((config) => {
  const jeton = lire(CLE_JETON);
  if (jeton) config.headers.Authorization = `Bearer ${jeton}`;
  return config;
});

let surSessionExpiree: (() => void) | null = null;
/** Enregistre ce qu'il faut faire quand l'API refuse le jeton (session expirée ou révoquée). */
export const quandSessionExpire = (action: () => void) => { surSessionExpiree = action; };

http.interceptors.response.use(undefined, (erreur) => {
  const config = isAxiosError(erreur) ? erreur.config : undefined;
  if (isAxiosError(erreur) && erreur.response?.status === 401 && config?.headers?.Authorization && !config.url?.endsWith("/login")) {
    surSessionExpiree?.();
  }
  return Promise.reject(erreur);
});

export type ErreurApi = {
  statut?: number;
  message?: string;
  code?: string;
  /** Première erreur de chaque champ, indexée par le dernier segment du nom (« rendezVous.zone » donne « zone »). */
  champs: Record<string, string>;
};

/** Lit une erreur renvoyée par l'API : statut, message, code et erreurs de validation. */
export function lireErreur(e: unknown): ErreurApi {
  if (!isAxiosError(e) || !e.response) return { champs: {} };
  const data = (e.response.data ?? {}) as { message?: string; code?: string; errors?: Record<string, string[]> };
  const champs: Record<string, string> = {};
  for (const [cle, messages] of Object.entries(data.errors ?? {})) {
    const nom = cle.split(".").pop() ?? cle;
    if (!champs[nom] && messages?.[0]) champs[nom] = messages[0];
  }
  return { statut: e.response.status, message: data.message, code: data.code, champs };
}
