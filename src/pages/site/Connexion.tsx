import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cheminEspace } from "@/components/site/Gabarit";
import { DefilementFluide } from "@/components/site/Mouvement";
import { Champ } from "@/components/site/Formulaires";
import { CONTACT } from "@/donnees/fidelem";
import { demanderReinitialisation, reinitialiserMotDePasse } from "@/config/api";
import { lireErreur } from "@/config/http";

/** Écran d'authentification en deux colonnes : formulaire à gauche, panneau de marque à droite. */
function Ecran({ titre, sousTitre, panneau, children }: { titre: string; sousTitre: string; panneau: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="f-site f-auth">
      <DefilementFluide />
      <div className="f-auth__form">
        <Link to="/" className="f-logo" aria-label="FIDELEM, accueil"><img src="/brand/fidelem-logo.png" alt="FIDELEM" /></Link>
        <main className="f-auth__corps">
          <h1 className="f-titre-l">{titre}</h1>
          <p className="f-texte">{sousTitre}</p>
          {children}
        </main>
      </div>
      <aside className="f-auth__panneau" aria-hidden="true">{panneau}</aside>
    </div>
  );
}

function FormulaireConnexion({ role }: { role: "usager" | "conseiller" }) {
  const { login, logout } = useAuth();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [voir, setVoir] = useState(false);
  const [erreur, setErreur] = useState(params.get("session") === "expiree" ? "Votre session a expiré. Reconnectez-vous." : "");
  const [envoi, setEnvoi] = useState(false);

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur("");
    if (!email || !mdp) return setErreur("Indiquez votre e-mail et votre mot de passe.");
    setEnvoi(true);
    try {
      const u = await login(email, mdp);
      if (role === "conseiller" && u.role === "user") {
        await logout();
        setErreur("Ce compte est un compte usager. Connectez-vous depuis la connexion usager.");
      } else nav(cheminEspace(u.role));
    } catch (err: unknown) {
      const { statut, code } = lireErreur(err);
      if (code === "compte_rejete") setErreur(`Ce compte n'a pas été retenu. Pour en savoir plus, appelez le ${CONTACT.telephone}.`);
      else if (code === "compte_en_attente") setErreur(role === "conseiller"
        ? "Votre compte conseiller est en attente de validation. Il sera activé avec votre licence et votre zone."
        : `Votre compte est en attente de validation. Appelez le ${CONTACT.telephone} si l'attente se prolonge.`);
      else if (statut === 401 || statut === 422) setErreur("E-mail ou mot de passe incorrect.");
      else if (statut === 429) setErreur("Trop de tentatives. Patientez une minute avant de réessayer.");
      else setErreur(`Connexion impossible pour le moment. Réessayez ou appelez le ${CONTACT.telephone}.`);
    } finally { setEnvoi(false); }
  };

  return (
    <form className="f-form" onSubmit={soumettre} noValidate>
      <Champ libelle="E-mail"><input id="f-login-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" /></Champ>
      <div className="f-champ">
        <span style={{ display: "flex", justifyContent: "space-between" }}>Mot de passe <Link to="/mot-de-passe-oublie" style={{ textTransform: "none", letterSpacing: 0, textDecoration: "underline" }}>Mot de passe oublié ?</Link></span>
        <div style={{ position: "relative" }}>
          <input id="f-login-mdp" type={voir ? "text" : "password"} autoComplete="current-password" value={mdp} onChange={(e) => setMdp(e.target.value)} style={{ paddingRight: 48 }} />
          <button type="button" onClick={() => setVoir((v) => !v)} aria-label={voir ? "Masquer le mot de passe" : "Afficher le mot de passe"} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", width: 38, height: 38, display: "grid", placeItems: "center", background: "transparent", border: 0, cursor: "pointer", color: "var(--f-encre-2)" }}>
            {voir ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      {erreur && <div className="f-alerte f-alerte--erreur" role="alert"><AlertCircle style={{ flex: "none" }} />{erreur}</div>}
      <button className="f-btn f-btn--or f-btn--grand" type="submit" disabled={envoi} style={{ justifyContent: "center" }}>
        {envoi ? <><Loader2 className="animate-spin" /> Connexion</> : <>Se connecter <ArrowRight /></>}
      </button>
    </form>
  );
}

export function Connexion() {
  const { user } = useAuth();
  if (user) return <Navigate to={cheminEspace(user.role)} replace />;
  return (
    <Ecran titre="Connexion" sousTitre="Suivez vos demandes de financement, votre conseiller et vos rendez-vous." panneau={<>
      <span className="f-barres f-barres--blanc">Suivi</span>
      <p className="f-titre-m">Votre demande, votre conseiller, vos rendez-vous. Au même endroit.</p>
    </>}>
      <FormulaireConnexion role="usager" />
      <div className="f-auth__autres">
        <p className="f-note">Pas encore de demande ? <Link to="/services" style={{ textDecoration: "underline" }}>Faire une demande de financement</Link></p>
        <p className="f-note">Vous êtes conseiller ? <Link to="/espace-conseiller/connexion" style={{ textDecoration: "underline" }}>Espace Conseiller</Link></p>
      </div>
    </Ecran>
  );
}

export function ConnexionConseiller() {
  const { user } = useAuth();
  if (user && user.role !== "user") return <Navigate to={cheminEspace(user.role)} replace />;
  return (
    <Ecran titre="Espace Conseiller" sousTitre="Retrouvez les demandes de votre zone, vos rendez-vous et vos clients." panneau={<>
      <span className="f-barres f-barres--or">Zone</span>
      <p className="f-titre-m">Les demandes des usagers de votre zone arrivent directement dans votre espace.</p>
    </>}>
      <FormulaireConnexion role="conseiller" />
      <div className="f-auth__autres">
        <p className="f-note">Pas encore conseiller ? <Link to="/conseiller-financier" style={{ textDecoration: "underline" }}>Devenir conseiller financier</Link></p>
      </div>
    </Ecran>
  );
}

export function MotDePasseOublie() {
  const [email, setEmail] = useState("");
  const [etat, setEtat] = useState<"repos" | "envoi" | "ok" | "erreur">("repos");
  return (
    <Ecran titre="Mot de passe oublié" sousTitre="Indiquez l'e-mail de votre compte : nous vous envoyons un lien pour choisir un nouveau mot de passe." panneau={<span className="f-barres f-barres--blanc">Accès</span>}>
      {etat === "ok" ? (
        <div className="f-alerte f-alerte--succes" role="status"><CheckCircle2 style={{ flex: "none" }} />Si un compte existe pour {email}, vous allez recevoir un e-mail avec un lien de réinitialisation.</div>
      ) : (
        <form className="f-form" noValidate onSubmit={async (e) => { e.preventDefault(); if (!/^\S+@\S+\.\S+$/.test(email)) return; setEtat("envoi"); try { await demanderReinitialisation(email); setEtat("ok"); } catch { setEtat("erreur"); } }}>
          <Champ libelle="E-mail"><input id="f-oubli-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Champ>
          {etat === "erreur" && <div className="f-alerte f-alerte--erreur" role="alert"><AlertCircle style={{ flex: "none" }} />L'envoi n'a pas fonctionné. Appelez le {CONTACT.telephone} pour réinitialiser votre accès.</div>}
          <button className="f-btn f-btn--or f-btn--grand" type="submit" disabled={etat === "envoi"} style={{ justifyContent: "center" }}>Envoyer le lien <ArrowRight /></button>
        </form>
      )}
      <p className="f-note"><Link to="/connexion" style={{ textDecoration: "underline" }}>Retour à la connexion</Link></p>
    </Ecran>
  );
}

/** Page ouverte depuis le lien de l'e-mail de réinitialisation : choisir un nouveau mot de passe. */
export function ReinitialiserMotDePasse() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const email = params.get("email") ?? "";
  const [mdp, setMdp] = useState("");
  const [mdp2, setMdp2] = useState("");
  const [voir, setVoir] = useState(false);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [etat, setEtat] = useState<"repos" | "envoi" | "ok" | "lien" | "erreur">(token && email ? "repos" : "lien");

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    const v: Record<string, string> = {};
    if (mdp.length < 8) v.mdp = "Au moins 8 caractères.";
    if (mdp !== mdp2) v.mdp2 = "Les deux mots de passe ne correspondent pas.";
    setErreurs(v);
    if (Object.keys(v).length) return;
    setEtat("envoi");
    try {
      await reinitialiserMotDePasse({ token, email, password: mdp, password_confirmation: mdp2 });
      setEtat("ok");
    } catch (err) {
      const { statut, champs } = lireErreur(err);
      if (statut === 422 && champs.password) { setErreurs({ mdp: champs.password }); setEtat("repos"); }
      else setEtat(statut === 422 ? "lien" : "erreur");
    }
  };

  return (
    <Ecran titre="Nouveau mot de passe" sousTitre={etat === "lien" ? "Un lien de réinitialisation ne sert qu'une fois et reste valable une heure." : `Choisissez un nouveau mot de passe pour ${email}.`} panneau={<span className="f-barres f-barres--blanc">Accès</span>}>
      {etat === "ok" ? (
        <>
          <div className="f-alerte f-alerte--succes" role="status"><CheckCircle2 style={{ flex: "none" }} />Mot de passe enregistré. Les sessions ouvertes avec l'ancien mot de passe sont fermées.</div>
          <div className="f-auth__autres">
            <Link className="f-btn f-btn--or f-btn--grand" to="/connexion" style={{ justifyContent: "center" }}>Se connecter <ArrowRight /></Link>
            <p className="f-note">Vous êtes conseiller ? <Link to="/espace-conseiller/connexion" style={{ textDecoration: "underline" }}>Connexion à l'Espace Conseiller</Link></p>
          </div>
        </>
      ) : etat === "lien" ? (
        <>
          <div className="f-alerte f-alerte--erreur" role="alert"><AlertCircle style={{ flex: "none" }} />Ce lien n'est plus valide : il a déjà servi, ou il a expiré. Demandez un nouveau lien.</div>
          <Link className="f-btn f-btn--or f-btn--grand" to="/mot-de-passe-oublie" style={{ justifyContent: "center" }}>Demander un nouveau lien <ArrowRight /></Link>
        </>
      ) : (
        <form className="f-form" noValidate onSubmit={soumettre}>
          <div className="f-champ">
            <label htmlFor="f-reinit-mdp" style={{ font: "500 12px/1.2 var(--f-texte)", letterSpacing: ".02em", textTransform: "uppercase", color: "var(--f-encre-2)" }}>Nouveau mot de passe</label>
            <div style={{ position: "relative" }}>
              <input id="f-reinit-mdp" type={voir ? "text" : "password"} autoComplete="new-password" value={mdp} onChange={(e) => setMdp(e.target.value)} aria-invalid={!!erreurs.mdp} aria-describedby="f-reinit-aide" style={{ paddingRight: 48 }} />
              <button type="button" onClick={() => setVoir((x) => !x)} aria-label={voir ? "Masquer le mot de passe" : "Afficher le mot de passe"} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", width: 38, height: 38, display: "grid", placeItems: "center", background: "transparent", border: 0, cursor: "pointer", color: "var(--f-encre-2)" }}>
                {voir ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {erreurs.mdp ? <small id="f-reinit-aide" className="f-erreur" role="alert">{erreurs.mdp}</small> : <small id="f-reinit-aide" className="f-note">8 caractères au moins.</small>}
          </div>
          <Champ libelle="Confirmer le mot de passe" erreur={erreurs.mdp2}><input id="f-reinit-mdp2" type={voir ? "text" : "password"} autoComplete="new-password" value={mdp2} onChange={(e) => setMdp2(e.target.value)} aria-invalid={!!erreurs.mdp2} /></Champ>
          {etat === "erreur" && <div className="f-alerte f-alerte--erreur" role="alert"><AlertCircle style={{ flex: "none" }} />Le mot de passe n'a pas pu être enregistré. Réessayez, ou appelez le {CONTACT.telephone}.</div>}
          <button className="f-btn f-btn--or f-btn--grand" type="submit" disabled={etat === "envoi"} style={{ justifyContent: "center" }}>
            {etat === "envoi" ? <><Loader2 className="animate-spin" /> Enregistrement</> : <>Enregistrer le mot de passe <ArrowRight /></>}
          </button>
        </form>
      )}
      <p className="f-note"><Link to="/connexion" style={{ textDecoration: "underline" }}>Retour à la connexion</Link></p>
    </Ecran>
  );
}
