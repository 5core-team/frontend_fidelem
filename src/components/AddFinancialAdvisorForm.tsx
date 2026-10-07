import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Champ, Choix } from "@/components/site/Formulaires";
import { creerConseiller } from "@/config/apiEspace";
import { lireErreur } from "@/config/http";
import { FORMATIONS, ZONES } from "@/donnees/fidelem";

interface AddFinancialAdvisorFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Appelé une fois le conseiller créé, pour rafraîchir la liste. */
  onCree?: () => void;
}

const SPECIALITES = ["Immobilier", "Transport", "Affaires"];
const vide = { prenom: "", nom: "", email: "", telephone: "", zone: "", niveau: "", specialites: [] as string[], mdp: "", mdp2: "" };

/** Back-office : crée un conseiller financier, actif tout de suite, avec sa zone et son niveau. */
export function AddFinancialAdvisorForm({ open, onOpenChange, onCree }: AddFinancialAdvisorFormProps) {
  const [v, setV] = useState(vide);
  const [voir, setVoir] = useState(false);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [envoi, setEnvoi] = useState(false);
  const maj = <K extends keyof typeof vide>(k: K, val: (typeof vide)[K]) => setV((x) => ({ ...x, [k]: val }));

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!v.prenom.trim()) err.name = "Indiquez le prénom.";
    if (!v.nom.trim()) err.last_name = "Indiquez le nom.";
    if (!/^\S+@\S+\.\S+$/.test(v.email)) err.email = "Indiquez une adresse e-mail valide.";
    if (v.telephone.replace(/\D/g, "").length < 8) err.phone = "Indiquez un numéro de téléphone complet.";
    if (v.mdp.length < 8) err.password = "Au moins 8 caractères.";
    if (v.mdp !== v.mdp2) err.mdp2 = "Les deux mots de passe ne correspondent pas.";
    setErreurs(err);
    if (Object.keys(err).length) {
      setTimeout(() => document.querySelector<HTMLElement>('[role="dialog"] [aria-invalid="true"]')?.focus(), 0);
      return;
    }
    setEnvoi(true);
    try {
      await creerConseiller({
        name: v.prenom.trim(), last_name: v.nom.trim(), email: v.email.trim(), phone: v.telephone.trim(), password: v.mdp,
        zone: v.zone || undefined, niveau: v.niveau || undefined, financements: v.specialites,
      });
      toast.success(`Conseiller créé. ${v.prenom} peut se connecter dès maintenant avec son e-mail.`);
      setV(vide);
      onOpenChange(false);
      onCree?.();
    } catch (e) {
      const { message, champs } = lireErreur(e);
      setErreurs(champs);
      toast.error("Le conseiller n'a pas été créé.", { description: message ?? "Réessayez dans un instant." });
    } finally { setEnvoi(false); }
  };

  const niveaux = FORMATIONS.map((f) => `CF ${f.nom}`);
  const niveauChoisi = FORMATIONS.find((f) => f.id === v.niveau);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto" style={{ background: "var(--f-papier)", borderRadius: 16, fontFamily: "var(--f-texte)" }}>
        <DialogHeader>
          <DialogTitle className="f-titre-m" style={{ textAlign: "left" }}>Nouveau conseiller</DialogTitle>
          <DialogDescription>Le compte est actif dès sa création. La zone peut être attribuée plus tard depuis la page Zones.</DialogDescription>
        </DialogHeader>
        <form className="f-form" onSubmit={soumettre} noValidate>
          <div className="f-grille-2">
            <Champ libelle="Prénom" erreur={erreurs.name}><input id="f-cf-prenom" autoComplete="off" value={v.prenom} onChange={(e) => maj("prenom", e.target.value)} aria-invalid={!!erreurs.name} /></Champ>
            <Champ libelle="Nom" erreur={erreurs.last_name}><input id="f-cf-nom" autoComplete="off" value={v.nom} onChange={(e) => maj("nom", e.target.value)} aria-invalid={!!erreurs.last_name} /></Champ>
            <Champ libelle="E-mail" erreur={erreurs.email}><input id="f-cf-email" type="email" autoComplete="off" placeholder="prenom.nom@exemple.bj" value={v.email} onChange={(e) => maj("email", e.target.value)} aria-invalid={!!erreurs.email} /></Champ>
            <Champ libelle="Téléphone" erreur={erreurs.phone}><input id="f-cf-tel" type="tel" inputMode="tel" placeholder="01 00 00 00 00" value={v.telephone} onChange={(e) => maj("telephone", e.target.value)} aria-invalid={!!erreurs.phone} /></Champ>
          </div>
          <Champ libelle="Zone de gestion" optionnel erreur={erreurs.zone}>
            <select id="f-cf-zone" value={v.zone} onChange={(e) => maj("zone", e.target.value)}>
              <option value="">À attribuer plus tard</option>
              {ZONES.map((z) => <option key={z}>{z}</option>)}
            </select>
          </Champ>
          <div className="f-champ"><span>Niveau <em>· facultatif</em></span>
            <Choix nom="f-cf-niveau" options={niveaux} valeur={niveauChoisi ? `CF ${niveauChoisi.nom}` : ""} onChange={(o) => maj("niveau", FORMATIONS.find((f) => `CF ${f.nom}` === o)?.id ?? "")} />
          </div>
          <div className="f-champ"><span>Spécialités <em>· affichées aux usagers qui cherchent un conseiller</em></span>
            <Choix nom="f-cf-specialites" multiple options={SPECIALITES} valeur={v.specialites} onChange={(o) => maj("specialites", o as string[])} />
          </div>
          <div className="f-form__groupe">
            <div className="f-grille-2">
              <Champ libelle="Mot de passe provisoire" erreur={erreurs.password}>
                <span style={{ position: "relative", display: "block" }}>
                  <input id="f-cf-mdp" type={voir ? "text" : "password"} autoComplete="new-password" value={v.mdp} onChange={(e) => maj("mdp", e.target.value)} aria-invalid={!!erreurs.password} style={{ paddingRight: 48 }} />
                  <button type="button" onClick={() => setVoir((x) => !x)} aria-label={voir ? "Masquer le mot de passe" : "Afficher le mot de passe"} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", width: 38, height: 38, display: "grid", placeItems: "center", background: "transparent", border: 0, cursor: "pointer", color: "var(--f-encre-2)" }}>
                    {voir ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </span>
              </Champ>
              <Champ libelle="Confirmer" erreur={erreurs.mdp2}><input id="f-cf-mdp2" type={voir ? "text" : "password"} autoComplete="new-password" value={v.mdp2} onChange={(e) => maj("mdp2", e.target.value)} aria-invalid={!!erreurs.mdp2} /></Champ>
            </div>
            <p className="f-note" style={{ margin: 0 }}>Transmettez ce mot de passe au conseiller : il le remplace depuis son profil.</p>
          </div>
          <button className="f-btn f-btn--or f-btn--grand" type="submit" disabled={envoi} style={{ justifyContent: "center" }}>
            {envoi ? <><Loader2 className="animate-spin" /> Création en cours</> : "Créer le conseiller"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
