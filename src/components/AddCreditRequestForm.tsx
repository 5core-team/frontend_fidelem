import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { FINANCEMENTS } from "@/donnees/fidelem";
import { nouvelleDemandeUsager } from "@/config/apiEspace";
import { BlocRendezVous, Champ, rendezVousVide, validerRendezVous } from "@/components/site/Formulaires";

interface AddCreditRequestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAdvisor?: boolean;
  /** Clients du conseiller, pour choisir pour qui la demande est créée. */
  clients?: { id: string | number; name?: string; last_name?: string }[];
  onCree?: () => void;
}

/** Nouvelle demande de financement depuis un espace connecté (usager, ou conseiller pour un client). */
export function AddCreditRequestForm({ open, onOpenChange, isAdvisor = false, clients = [], onCree }: AddCreditRequestFormProps) {
  const { user } = useAuth();
  const [financement, setFinancement] = useState<string>(FINANCEMENTS[0].slug);
  const f = FINANCEMENTS.find((x) => x.slug === financement)!;
  const [objet, setObjet] = useState(f.projets[0]);
  const [montant, setMontant] = useState("");
  const [duree, setDuree] = useState("36");
  const [message, setMessage] = useState("");
  const [clientId, setClientId] = useState("");
  const [rdv, setRdv] = useState(rendezVousVide());
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [envoi, setEnvoi] = useState(false);

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    const v: Record<string, string> = isAdvisor ? {} : validerRendezVous(rdv);
    if (!Number(montant)) v.montant = "Indiquez le montant.";
    if (isAdvisor && !clientId) v.client = "Choisissez le client concerné.";
    setErreurs(v);
    if (Object.keys(v).length || !user) return;
    setEnvoi(true);
    try {
      await nouvelleDemandeUsager(isAdvisor ? clientId : user.id, { montant: Number(montant), duree: Number(duree), objet: `${f.court} · ${objet}`, message, rendezVous: rdv });
      toast.success("Demande de financement créée.");
      onOpenChange(false);
      onCree?.();
      setMontant(""); setMessage("");
    } catch {
      toast.error("La demande n'a pas pu être créée. Réessayez dans un instant.");
    } finally { setEnvoi(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto" style={{ background: "var(--f-papier)", borderRadius: 16, fontFamily: "var(--f-texte)" }}>
        <DialogHeader>
          <DialogTitle className="f-titre-m" style={{ textAlign: "left" }}>Nouvelle demande de financement</DialogTitle>
          <DialogDescription>{isAdvisor ? "Créez une demande pour l'un de vos clients." : "Décrivez votre projet et vos disponibilités."}</DialogDescription>
        </DialogHeader>
        <form className="f-form" onSubmit={soumettre} noValidate>
          {isAdvisor && (
            <Champ libelle="Client" erreur={erreurs.client}>
              <select id="f-nd-client" value={clientId} onChange={(e) => setClientId(e.target.value)} aria-invalid={!!erreurs.client}>
                <option value="">Choisir un client</option>
                {clients.map((c) => <option key={String(c.id)} value={String(c.id)}>{c.name} {c.last_name}</option>)}
              </select>
            </Champ>
          )}
          <div className="f-grille-2">
            <Champ libelle="Financement">
              <select id="f-nd-type" value={financement} onChange={(e) => { setFinancement(e.target.value); setObjet(FINANCEMENTS.find((x) => x.slug === e.target.value)!.projets[0]); }}>
                {FINANCEMENTS.map((x) => <option key={x.slug} value={x.slug}>{x.court}</option>)}
              </select>
            </Champ>
            <Champ libelle="Projet">
              <select id="f-nd-objet" value={objet} onChange={(e) => setObjet(e.target.value)}>{f.projets.map((p) => <option key={p}>{p}</option>)}</select>
            </Champ>
            <Champ libelle="Montant (FCFA)" erreur={erreurs.montant}>
              <input id="f-nd-montant" inputMode="numeric" value={montant} onChange={(e) => setMontant(e.target.value.replace(/\D/g, ""))} aria-invalid={!!erreurs.montant} />
            </Champ>
            <Champ libelle="Durée">
              <select id="f-nd-duree" value={duree} onChange={(e) => setDuree(e.target.value)}>{[6, 12, 24, 36, 48, 60, 84, 120, 180, 240].map((d) => <option key={d} value={d}>{d < 24 ? `${d} mois` : `${d / 12} ans`}</option>)}</select>
            </Champ>
          </div>
          <Champ libelle="Précisions" optionnel><textarea id="f-nd-message" value={message} onChange={(e) => setMessage(e.target.value)} /></Champ>
          {!isAdvisor && <BlocRendezVous valeur={rdv} onChange={setRdv} erreurs={erreurs} />}
          <button className="f-btn f-btn--or f-btn--grand" type="submit" disabled={envoi} style={{ justifyContent: "center" }}>{envoi ? "Envoi en cours" : "Envoyer la demande"}</button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
