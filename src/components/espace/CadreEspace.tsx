import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { CONTACT } from "@/donnees/fidelem";
import { modeDemo, quitterDemo } from "@/config/demo";

export type LienEspace = { libelle: string; chemin: string; icone: LucideIcon; fin?: boolean; badge?: number };

/** Cadre des espaces connectés, comme les anciens tableaux de bord : barre du site, onglets, contenu. */
export default function CadreEspace({ titreEspace, liens, children }: { titreEspace: string; liens: LienEspace[]; children: ReactNode }) {
  const { user } = useAuth();
  return (
    <div className="f-app min-h-screen bg-fidelem-light">
      <Navbar />
      {modeDemo() && (
        <div className="bg-fidelem-secondary/20 text-fidelem text-sm" role="status">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2">
            <span><strong>Mode démonstration</strong> · données d'exemple, actions simulées</span>
            <button type="button" className="underline font-medium" onClick={() => { quitterDemo(); window.location.href = "/demo"; }}>Changer d'espace</button>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-fidelem-secondary">{titreEspace}</p>
          <p className="text-sm text-gray-500">{user?.name} {user?.last_name} · Assistance : {CONTACT.telephone}</p>
        </div>
        <nav aria-label={titreEspace} className="mb-8 overflow-x-auto">
          <div className="inline-flex h-11 items-center rounded-md bg-muted p-1 text-muted-foreground min-w-max">
            {liens.map(({ libelle, chemin, icone: Icone, fin, badge }) => (
              <NavLink key={chemin} to={chemin} end={fin}
                className={({ isActive }) => `inline-flex items-center gap-2 whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${isActive ? "bg-background text-fidelem shadow-sm" : "hover:text-fidelem"}`}>
                <Icone size={16} aria-hidden="true" />{libelle}
                {!!badge && <span className="rounded-full bg-fidelem-secondary text-fidelem text-xs px-2 py-0.5">{badge}</span>}
              </NavLink>
            ))}
          </div>
        </nav>
        <main id="contenu-espace" className="space-y-6">{children}</main>
      </div>
    </div>
  );
}

export function TetePage({ sur, titre, texte, actions }: { sur?: string; titre: string; texte?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        {sur && <p className="text-sm text-gray-500">{sur}</p>}
        <h1 className="text-3xl font-bold text-fidelem">{titre}</h1>
        {texte && <p className="text-gray-600 mt-1">{texte}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

const COULEURS: Record<string, string> = {
  "Nouvelle": "bg-blue-500",
  "Prise en charge": "bg-amber-500",
  "Rendez-vous fixé": "bg-indigo-500",
  "Dossier en cours": "bg-slate-500",
  "Acceptée": "bg-green-500",
  "Refusée": "bg-red-500",
  "Actif": "bg-green-500",
  "En attente": "bg-amber-500",
  "Rejeté": "bg-red-500",
};

/** Badge coloré selon le statut ; `libelle` remplace le texte affiché. */
export function PastilleStatut({ statut, libelle }: { statut: string; libelle?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white whitespace-nowrap ${COULEURS[statut] ?? "bg-gray-500"}`}>
      {libelle ?? statut}
    </span>
  );
}

/** Carte de chiffre ; la couleur suit sa place dans la rangée (bleu, ambre, vert, indigo). */
export function Chiffre({ libelle, valeur, aide }: { libelle: string; valeur: ReactNode; aide?: string; accent?: boolean }) {
  return (
    <Card className="f-chiffre border">
      <CardContent className="p-6">
        <p className="text-sm font-medium">{libelle}</p>
        <div className="text-2xl font-bold mt-1">{valeur}</div>
        {aide && <p className="text-xs opacity-80 mt-1">{aide}</p>}
      </CardContent>
    </Card>
  );
}

export function EtatVide({ titre, texte, action }: { titre: string; texte: string; action?: ReactNode }) {
  return (
    <div className="text-center py-10 px-4 space-y-2">
      <p className="text-lg font-semibold text-gray-800">{titre}</p>
      <p className="text-gray-500 max-w-md mx-auto">{texte}</p>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
