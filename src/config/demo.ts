import type { AxiosInstance } from "axios";

// ============================================================================
// Mode démonstration : les espaces connectés fonctionnent sans serveur, avec des
// données d'exemple. On l'active depuis /demo ; tous les appels axios sont alors
// servis par demoDonnees.ts, chargé à la demande pour rester hors du bundle principal.
// ============================================================================

const CLE = "fidelem-demo";
/** La démo n'existe qu'en local (npm run dev), ou si VITE_DEMO=1 est défini au build. */
export const DEMO_DISPONIBLE = import.meta.env.DEV || import.meta.env.VITE_DEMO === "1";
export const modeDemo = () => { if (!DEMO_DISPONIBLE) return false; try { return localStorage.getItem(CLE) === "1"; } catch { return false; } };

export function quitterDemo() {
  try { localStorage.removeItem(CLE); localStorage.removeItem("user"); localStorage.removeItem("authToken"); } catch { /* stockage indisponible */ }
}

/** Branche le mode démonstration sur une instance axios (sans effet si le mode n'est pas actif). */
export function brancherDemo(instance: AxiosInstance) {
  // Condition écrite en toutes lettres pour que le build de production retire l'import.
  if (!(import.meta.env.DEV || import.meta.env.VITE_DEMO === "1") || !modeDemo()) return;
  instance.defaults.adapter = async (config) => (await import("./demoDonnees")).adaptateur(config);
}
