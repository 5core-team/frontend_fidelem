import { ReactNode, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { CONTACT } from "@/donnees/fidelem";
import { demanderReinitialisation, reinitialiserMotDePasse } from "@/config/api";
import { lireErreur } from "@/config/http";
import { cheminEspace } from "@/lib/espaces";
import logo from "@/assets/logo.png";

/** Carte centrée sur fond clair, comme l'ancienne page de connexion. */
function Ecran({ titre, description, pied, children }: { titre: string; description: string; pied?: ReactNode; children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-fidelem-light p-4">
      <Link to="/" aria-label="Fidelem, accueil" className="mb-2"><img src={logo} alt="Fidelem" className="h-32 w-auto" /></Link>
      <div className="w-full max-w-md">
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-fidelem">{titre}</CardTitle>
            <CardDescription className="text-center">{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
          {pied && <CardFooter className="flex flex-col gap-2 text-sm text-center text-gray-600">{pied}</CardFooter>}
        </Card>
      </div>
    </div>
  );
}

const Alerte = ({ type, children }: { type: "erreur" | "succes"; children: ReactNode }) => (
  <div className={`flex gap-2 rounded-md p-3 text-sm ${type === "erreur" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`} role={type === "erreur" ? "alert" : "status"}>
    {type === "erreur" ? <AlertCircle className="h-5 w-5 shrink-0" /> : <CheckCircle2 className="h-5 w-5 shrink-0" />}
    <span>{children}</span>
  </div>
);

function ChampMotDePasse({ id, valeur, onChange, autoComplete }: { id: string; valeur: string; onChange: (v: string) => void; autoComplete: string }) {
  const [voir, setVoir] = useState(false);
  return (
    <div className="relative">
      <Input id={id} type={voir ? "text" : "password"} placeholder="••••••••" autoComplete={autoComplete}
        value={valeur} onChange={(e) => onChange(e.target.value)} className="pr-10" />
      <button type="button" onClick={() => setVoir(!voir)} aria-label={voir ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
        {voir ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

function FormulaireConnexion({ role }: { role: "usager" | "conseiller" }) {
  const { login, logout } = useAuth();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
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
    <form onSubmit={soumettre} noValidate className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Adresse e-mail</Label>
        <Input id="email" type="email" autoComplete="email" placeholder="exemple@fidelem.pro" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Mot de passe</Label>
          <Link to="/mot-de-passe-oublie" className="text-xs text-fidelem-accent hover:underline">Mot de passe oublié ?</Link>
        </div>
        <ChampMotDePasse id="password" valeur={mdp} onChange={setMdp} autoComplete="current-password" />
      </div>
      {erreur && <Alerte type="erreur">{erreur}</Alerte>}
      <Button type="submit" className="w-full bg-fidelem hover:bg-fidelem/90" disabled={envoi}>
        {envoi ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connexion en cours…</> : "Se connecter"}
      </Button>
    </form>
  );
}

export function Connexion() {
  const { user } = useAuth();
  if (user) return <Navigate to={cheminEspace(user.role)} replace />;
  return (
    <Ecran titre="Connexion" description="Suivez vos demandes de financement, votre conseiller et vos rendez-vous" pied={<>
      <p>Pas encore de demande ? <Link to="/services" className="text-fidelem-accent hover:underline">Faire une demande de financement</Link></p>
      <p>Vous êtes conseiller ? <Link to="/espace-conseiller/connexion" className="text-fidelem-accent hover:underline">Espace conseiller</Link></p>
    </>}>
      <FormulaireConnexion role="usager" />
    </Ecran>
  );
}

export function ConnexionConseiller() {
  const { user } = useAuth();
  if (user && user.role !== "user") return <Navigate to={cheminEspace(user.role)} replace />;
  return (
    <Ecran titre="Espace conseiller" description="Connectez-vous pour voir les demandes des clients de votre zone" pied={
      <p>Pas encore conseiller ? <Link to="/conseiller-financier" className="text-fidelem-accent hover:underline">Devenir conseiller financier</Link></p>
    }>
      <FormulaireConnexion role="conseiller" />
    </Ecran>
  );
}

export function MotDePasseOublie() {
  const [email, setEmail] = useState("");
  const [etat, setEtat] = useState<"repos" | "envoi" | "ok" | "erreur">("repos");
  return (
    <Ecran titre="Mot de passe oublié" description="Indiquez l'e-mail de votre compte : nous vous envoyons un lien pour choisir un nouveau mot de passe" pied={
      <Link to="/connexion" className="text-fidelem-accent hover:underline">Retour à la connexion</Link>
    }>
      {etat === "ok" ? (
        <Alerte type="succes">Si un compte existe pour {email}, vous allez recevoir un e-mail avec un lien de réinitialisation.</Alerte>
      ) : (
        <form noValidate className="space-y-4" onSubmit={async (e) => {
          e.preventDefault();
          if (!/^\S+@\S+\.\S+$/.test(email)) return;
          setEtat("envoi");
          try { await demanderReinitialisation(email); setEtat("ok"); } catch { setEtat("erreur"); }
        }}>
          <div className="space-y-2">
            <Label htmlFor="oubli-email">Adresse e-mail</Label>
            <Input id="oubli-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {etat === "erreur" && <Alerte type="erreur">L'envoi n'a pas fonctionné. Appelez le {CONTACT.telephone} pour réinitialiser votre accès.</Alerte>}
          <Button type="submit" className="w-full bg-fidelem hover:bg-fidelem/90" disabled={etat === "envoi"}>Envoyer le lien</Button>
        </form>
      )}
    </Ecran>
  );
}

/** Page ouverte depuis le lien de l'e-mail de réinitialisation. */
export function ReinitialiserMotDePasse() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const email = params.get("email") ?? "";
  const [mdp, setMdp] = useState("");
  const [mdp2, setMdp2] = useState("");
  const [erreur, setErreur] = useState("");
  const [etat, setEtat] = useState<"repos" | "envoi" | "ok" | "lien" | "erreur">(token && email ? "repos" : "lien");

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mdp.length < 8) return setErreur("Au moins 8 caractères.");
    if (mdp !== mdp2) return setErreur("Les deux mots de passe ne correspondent pas.");
    setErreur("");
    setEtat("envoi");
    try {
      await reinitialiserMotDePasse({ token, email, password: mdp, password_confirmation: mdp2 });
      setEtat("ok");
    } catch (err) {
      const { statut, champs } = lireErreur(err);
      if (statut === 422 && champs.password) { setErreur(champs.password); setEtat("repos"); }
      else setEtat(statut === 422 ? "lien" : "erreur");
    }
  };

  return (
    <Ecran titre="Nouveau mot de passe" description={etat === "lien" ? "Un lien de réinitialisation ne sert qu'une fois et reste valable une heure" : `Choisissez un nouveau mot de passe pour ${email}`} pied={
      <Link to="/connexion" className="text-fidelem-accent hover:underline">Retour à la connexion</Link>
    }>
      {etat === "ok" ? (
        <div className="space-y-4">
          <Alerte type="succes">Mot de passe enregistré. Vous pouvez vous connecter.</Alerte>
          <Link to="/connexion"><Button className="w-full bg-fidelem hover:bg-fidelem/90">Se connecter</Button></Link>
        </div>
      ) : etat === "lien" ? (
        <div className="space-y-4">
          <Alerte type="erreur">Ce lien n'est plus valide : il a déjà servi, ou il a expiré.</Alerte>
          <Link to="/mot-de-passe-oublie"><Button className="w-full bg-fidelem hover:bg-fidelem/90">Demander un nouveau lien</Button></Link>
        </div>
      ) : (
        <form noValidate className="space-y-4" onSubmit={soumettre}>
          <div className="space-y-2">
            <Label htmlFor="reinit-mdp">Nouveau mot de passe</Label>
            <ChampMotDePasse id="reinit-mdp" valeur={mdp} onChange={setMdp} autoComplete="new-password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reinit-mdp2">Confirmer le mot de passe</Label>
            <ChampMotDePasse id="reinit-mdp2" valeur={mdp2} onChange={setMdp2} autoComplete="new-password" />
          </div>
          {erreur && <Alerte type="erreur">{erreur}</Alerte>}
          {etat === "erreur" && <Alerte type="erreur">Le mot de passe n'a pas pu être enregistré. Réessayez, ou appelez le {CONTACT.telephone}.</Alerte>}
          <Button type="submit" className="w-full bg-fidelem hover:bg-fidelem/90" disabled={etat === "envoi"}>Enregistrer le mot de passe</Button>
        </form>
      )}
    </Ecran>
  );
}
