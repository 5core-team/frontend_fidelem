import { ReactNode, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import { CONTACT, NAVIGATION } from "@/donnees/fidelem";
import { useAuth } from "@/context/AuthContext";
import { DefilementFluide, useRevele } from "./Mouvement";
import LienBrouille from "./LienBrouille";

export const cheminEspace = (role?: string) =>
  role === "advisor" ? "/espace-conseiller" : role === "manager" ? "/responsable" : "/mon-espace";

function EnTete() {
  const { user } = useAuth();
  return (
    <header className="f-entete-site">
      <div className="f-conteneur f-entete-site__barre">
        <Link to="/" className="f-logo" aria-label="FIDELEM, accueil">
          <img src="/brand/fidelem-logo.png" alt="FIDELEM" width={394} height={150} />
        </Link>
        <nav className="f-nav-haut" aria-label="Navigation principale">
          {NAVIGATION.map((l) => (
            <LienBrouille key={l.chemin} to={l.chemin} end={l.chemin === "/"}>{l.libelle}</LienBrouille>
          ))}
        </nav>
        <div className="f-entete-site__actions">
          {user ? (
            <Link className="f-btn f-btn--encre" to={cheminEspace(user.role)}>Mon espace</Link>
          ) : (
            <>
              <Link className="f-btn f-btn--gris f-masque-mobile" to="/connexion">Connexion</Link>
              <Link className="f-btn f-btn--encre" to="/espace-conseiller/connexion">Espace Conseiller</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function Dock() {
  const [ouvert, setOuvert] = useState(false);
  const [visible, setVisible] = useState(false);
  const { pathname } = useLocation();
  const bouton = useRef<HTMLButtonElement>(null);
  const panneau = useRef<HTMLDivElement>(null);

  useEffect(() => setOuvert(false), [pathname]);

  useEffect(() => {
    const maj = () => setVisible(window.innerWidth < 1080 || window.scrollY > 420);
    maj();
    window.addEventListener("scroll", maj, { passive: true });
    window.addEventListener("resize", maj);
    return () => { window.removeEventListener("scroll", maj); window.removeEventListener("resize", maj); };
  }, []);

  useEffect(() => {
    if (!ouvert) return;
    panneau.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    const touche = (e: KeyboardEvent) => { if (e.key === "Escape") { setOuvert(false); bouton.current?.focus(); } };
    document.addEventListener("keydown", touche);
    return () => document.removeEventListener("keydown", touche);
  }, [ouvert]);

  return (
    <>
      {ouvert && <div className="f-voile" onClick={() => setOuvert(false)} />}
      {ouvert && (
        <div className="f-panneau" ref={panneau} id="f-menu" role="dialog" aria-label="Menu" data-lenis-prevent>
          <ul className="f-panneau__liens">
            {NAVIGATION.map((l, i) => (
              <li key={l.chemin}>
                <NavLink to={l.chemin} end={l.chemin === "/"}><span>0{i + 1}</span>{l.libelle}</NavLink>
              </li>
            ))}
          </ul>
          <div className="f-panneau__pied">
            <Link className="f-btn f-btn--or" to="/trouver-un-conseiller">Trouver un conseiller</Link>
            <Link className="f-btn f-btn--gris" to="/connexion">Connexion</Link>
            <Link className="f-btn f-btn--encre" to="/espace-conseiller/connexion">Espace Conseiller</Link>
          </div>
        </div>
      )}
      <nav className={`f-dock ${visible || ouvert ? "" : "est-cache"}`} aria-label="Navigation rapide">
        <button ref={bouton} type="button" className="f-btn f-btn--blanc" aria-expanded={ouvert} aria-controls="f-menu" onClick={() => setOuvert((o) => !o)}>
          {ouvert ? "Fermer" : "Menu"}
        </button>
        <button type="button" className="f-btn f-btn--blanc f-dock__plus" aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={ouvert} onClick={() => setOuvert((o) => !o)}>
          <Plus />
        </button>
        <Link to="/" className="f-dock__marque" aria-label="Accueil"><img src="/brand/fidelem-mark.png" alt="" /></Link>
        <Link className="f-btn f-btn--or" to="/contact">Contact</Link>
      </nav>
    </>
  );
}

function PiedDePage() {
  return (
    <footer className="f-pied">
      <div className="f-conteneur">
        <div className="f-pied__haut">
          <nav aria-label="Plan du site" className="f-pied__nav">
            {NAVIGATION.map((l) => <LienBrouille key={l.chemin} to={l.chemin}>{l.libelle}</LienBrouille>)}
          </nav>
          <div className="f-pied__contact">
            <a className="f-pied__mail" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <a href={`tel:${CONTACT.telephoneLien}`}>{CONTACT.telephone}</a>
            <div className="f-pied__liens">
              <LienBrouille to="/trouver-un-conseiller">Trouver un conseiller</LienBrouille>
              <LienBrouille to="/espace-conseiller/connexion">Espace Conseiller</LienBrouille>
              <LienBrouille to="/faq">FAQ</LienBrouille>
            </div>
          </div>
          <div className="f-pied__legal">
            <div className="f-pied__liens">
              <LienBrouille to="/mentions-legales">Mentions légales</LienBrouille>
              <LienBrouille to="/confidentialite">Confidentialité</LienBrouille>
              <LienBrouille to="/conditions">Conditions</LienBrouille>
            </div>
          </div>
        </div>
        <div className="f-pied__bas">
          <span className="f-pied__copy">©{new Date().getFullYear()}</span>
          <span className="f-pied__mot" aria-hidden="true">FIDELEM</span>
        </div>
      </div>
    </footer>
  );
}

/** Gabarit commun à toutes les pages publiques : en-tête, dock flottant, pied de page. */
export default function Gabarit({ children, sansPied = false }: { children: ReactNode; sansPied?: boolean }) {
  const { pathname } = useLocation();
  useRevele([pathname]);
  return (
    <div className="f-site">
      <a className="f-evitement" href="#contenu">Aller au contenu</a>
      <DefilementFluide />
      <EnTete />
      <main id="contenu">{children}</main>
      {!sansPied && <PiedDePage />}
      <Dock />
    </div>
  );
}
