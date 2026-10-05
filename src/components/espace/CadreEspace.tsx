import { ReactNode, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Menu, X, ExternalLink, type LucideIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { CONTACT } from "@/donnees/fidelem";

export type LienEspace = { libelle: string; chemin: string; icone: LucideIcon; fin?: boolean; badge?: number };

/** Cadre commun des espaces connectés : barre latérale, en-tête de page, déconnexion. */
export default function CadreEspace({ titreEspace, liens, children }: { titreEspace: string; liens: LienEspace[]; children: ReactNode }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [ouvert, setOuvert] = useState(false);
  const initiales = `${user?.name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="f-site f-app">
      <a className="f-evitement" href="#contenu-espace">Aller au contenu</a>
      <aside className={`f-app__cote ${ouvert ? "est-ouvert" : ""}`}>
        <div className="f-app__marque">
          <Link to="/" aria-label="FIDELEM, retour au site"><img src="/brand/fidelem-logo.png" alt="FIDELEM" /></Link>
          <button type="button" className="f-app__fermer" onClick={() => setOuvert(false)} aria-label="Fermer le menu"><X /></button>
        </div>
        <p className="f-label f-label--doux f-app__espace">{titreEspace}</p>
        <nav className="f-app__nav" aria-label={titreEspace}>
          {liens.map(({ libelle, chemin, icone: Icone, fin, badge }) => (
            <NavLink key={chemin} to={chemin} end={fin} onClick={() => setOuvert(false)}>
              <Icone aria-hidden="true" /><span>{libelle}</span>{!!badge && <em>{badge}</em>}
            </NavLink>
          ))}
        </nav>
        <div className="f-app__pied">
          <div className="f-app__profil">
            <span className="f-app__avatar">{initiales || "?"}</span>
            <span><strong>{user?.name} {user?.last_name}</strong><small>{user?.email}</small></span>
          </div>
          <Link className="f-app__lien-site" to="/">Voir le site <ExternalLink /></Link>
          <button type="button" className="f-btn f-btn--gris" onClick={() => { logout(); nav("/"); }}><LogOut /> Déconnexion</button>
          <p className="f-note">Assistance : {CONTACT.telephone}</p>
        </div>
      </aside>
      {ouvert && <div className="f-voile" onClick={() => setOuvert(false)} />}
      <div className="f-app__principal">
        <header className="f-app__barre-mobile">
          <button type="button" className="f-btn f-btn--blanc f-dock__plus" onClick={() => setOuvert(true)} aria-label="Ouvrir le menu"><Menu /></button>
          <img src="/brand/fidelem-logo.png" alt="FIDELEM" />
          <span className="f-app__avatar">{initiales}</span>
        </header>
        <main id="contenu-espace" className="f-app__contenu">{children}</main>
      </div>
    </div>
  );
}

export function TetePage({ sur, titre, texte, actions }: { sur?: string; titre: string; texte?: string; actions?: ReactNode }) {
  return (
    <div className="f-app__tete">
      <div>
        {sur && <p className="f-label f-label--doux">{sur}</p>}
        <h1 className="f-titre-l">{titre}</h1>
        {texte && <p className="f-texte">{texte}</p>}
      </div>
      {actions && <div className="f-app__actions">{actions}</div>}
    </div>
  );
}

const COULEURS: Record<string, [string, string]> = {
  "Nouvelle": ["#1B2A5E", "#E1E5F2"],
  "Prise en charge": ["#6A4A00", "#F3E3B6"],
  "Rendez-vous fixé": ["#6A4A00", "#F8D98A"],
  "Dossier en cours": ["#3C4256", "#E4E5EA"],
  "Acceptée": ["#1D4D36", "#D7EDE0"],
  "Refusée": ["#7A2B1D", "#F5DCD5"],
};

export function PastilleStatut({ statut }: { statut: string }) {
  const [c, f] = COULEURS[statut] ?? ["#3C4256", "#E4E5EA"];
  return <span className="f-pastille" style={{ color: c, background: f }}>{statut}</span>;
}

export function Chiffre({ libelle, valeur, aide, accent }: { libelle: string; valeur: ReactNode; aide?: string; accent?: boolean }) {
  return (
    <div className={`f-chiffre ${accent ? "f-chiffre--or" : ""}`}>
      <span className="f-label f-label--doux">{libelle}</span>
      <strong>{valeur}</strong>
      {aide && <span className="f-note">{aide}</span>}
    </div>
  );
}

export function EtatVide({ titre, texte, action }: { titre: string; texte: string; action?: ReactNode }) {
  return (
    <div className="f-vide f-guide" style={{ justifyItems: "start" }}>
      <p className="f-titre-m">{titre}</p>
      <p className="f-texte">{texte}</p>
      {action}
    </div>
  );
}
