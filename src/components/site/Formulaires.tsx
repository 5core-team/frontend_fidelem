import { ReactNode, useState } from "react";
import { CheckCircle2, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { CONTACT, ZONES } from "@/donnees/fidelem";
import type { Coordonnees, RendezVous } from "@/config/apiPublic";
import { lireErreur } from "@/config/http";

export function Champ({ libelle, optionnel, erreur, children }: { libelle: string; optionnel?: boolean; erreur?: string; children: ReactNode }) {
  return (
    <label className="f-champ">
      <span>{libelle}{optionnel && <em> · facultatif</em>}</span>
      {children}
      {erreur && <small className="f-erreur" role="alert">{erreur}</small>}
    </label>
  );
}

export function Choix({ nom, options, valeur, onChange, multiple = false }: {
  nom: string; options: string[]; valeur: string | string[]; onChange: (v: string | string[]) => void; multiple?: boolean;
}) {
  const coche = (o: string) => (multiple ? (valeur as string[]).includes(o) : valeur === o);
  const basculer = (o: string) => {
    if (!multiple) return onChange(o);
    const liste = valeur as string[];
    onChange(liste.includes(o) ? liste.filter((x) => x !== o) : [...liste, o]);
  };
  return (
    <div className="f-choix" role={multiple ? "group" : "radiogroup"}>
      {options.map((o) => (
        <label key={o}>
          <input type={multiple ? "checkbox" : "radio"} name={nom} checked={coche(o)} onChange={() => basculer(o)} />
          <span>{o}</span>
        </label>
      ))}
    </div>
  );
}

export const rendezVousVide = (zone = ""): RendezVous => ({ mode: "Par téléphone", date: "", creneau: "Matin (8 h – 12 h)", autresDisponibilites: [], zone, contactPrefere: "Appel" });
export const coordonneesVides = (): Coordonnees => ({ prenom: "", nom: "", telephone: "", email: "" });

const MODES = ["En agence", "Par téléphone", "En visio", "Sur WhatsApp"];
const CRENEAUX = ["Matin (8 h – 12 h)", "Midi (12 h – 14 h)", "Après-midi (14 h – 17 h)", "Fin de journée (17 h – 19 h)"];
const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

const demain = () => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10); };

/** Coordonnées réduites à l'essentiel : nom complet et téléphone (e-mail seulement si demandé). */
export function BlocCoordonnees({ valeur, onChange, erreurs, avecEmail = false }: { valeur: Coordonnees; onChange: (v: Coordonnees) => void; erreurs: Record<string, string>; avecEmail?: boolean }) {
  const nomComplet = [valeur.prenom, valeur.nom].filter(Boolean).join(" ");
  const majNom = (v: string) => { const [prenom, ...reste] = v.trimStart().split(" "); onChange({ ...valeur, prenom: prenom ?? "", nom: reste.join(" ") }); };
  return (
    <div className={avecEmail ? "f-grille-3" : "f-grille-2"}>
      <Champ libelle="Nom et prénom" erreur={erreurs.prenom || erreurs.nom}><input id="f-nom-complet" autoComplete="name" value={nomComplet} onChange={(e) => majNom(e.target.value)} aria-invalid={!!(erreurs.prenom || erreurs.nom)} /></Champ>
      <Champ libelle="Téléphone" erreur={erreurs.telephone}><input id="f-telephone" type="tel" inputMode="tel" autoComplete="tel" placeholder="01 00 00 00 00" value={valeur.telephone} onChange={(e) => onChange({ ...valeur, telephone: e.target.value })} aria-invalid={!!erreurs.telephone} /></Champ>
      {avecEmail && <Champ libelle="E-mail" erreur={erreurs.email}><input id="f-email" type="email" autoComplete="email" value={valeur.email} onChange={(e) => onChange({ ...valeur, email: e.target.value })} aria-invalid={!!erreurs.email} /></Champ>}
    </div>
  );
}

/** Rendez-vous compact : commune, date et créneau sur une ligne ; le reste est replié dans « Plus d'options ». */
export function BlocRendezVous({ valeur, onChange, erreurs, titre = "Rendez-vous" }: {
  valeur: RendezVous; onChange: (v: RendezVous) => void; erreurs: Record<string, string>; titre?: string;
}) {
  const maj = <K extends keyof RendezVous>(k: K, v: RendezVous[K]) => onChange({ ...valeur, [k]: v });
  return (
    <div className="f-form__groupe">
      <p className="f-label f-label--doux" style={{ margin: 0 }}>{titre}</p>
      <div className="f-grille-3">
        <Champ libelle="Votre commune" erreur={erreurs.zone}>
          <select id="f-zone" value={valeur.zone} onChange={(e) => maj("zone", e.target.value)} aria-invalid={!!erreurs.zone}>
            <option value="">Choisir</option>
            {ZONES.map((z) => <option key={z}>{z}</option>)}
          </select>
        </Champ>
        <Champ libelle="Date" erreur={erreurs.date}>
          <input id="f-date" type="date" min={demain()} value={valeur.date} onChange={(e) => maj("date", e.target.value)} aria-invalid={!!erreurs.date} />
        </Champ>
        <Champ libelle="Créneau">
          <select id="f-creneau" value={valeur.creneau} onChange={(e) => maj("creneau", e.target.value)}>
            {CRENEAUX.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Champ>
      </div>
      <details className="f-options">
        <summary>Plus d'options <span>· {valeur.mode.toLowerCase()}, rappel par {valeur.contactPrefere.toLowerCase()}</span></summary>
        <div className="f-options__corps">
          <div className="f-champ"><span>Mode de rendez-vous</span><Choix nom="mode" options={MODES} valeur={valeur.mode} onChange={(v) => maj("mode", v as string)} /></div>
          <div className="f-champ"><span>Autres jours possibles</span><Choix nom="jours" multiple options={JOURS} valeur={valeur.autresDisponibilites} onChange={(v) => maj("autresDisponibilites", v as string[])} /></div>
          <div className="f-champ"><span>On vous recontacte par</span><Choix nom="contact" options={["Appel", "WhatsApp", "E-mail"]} valeur={valeur.contactPrefere} onChange={(v) => maj("contactPrefere", v as string)} /></div>
        </div>
      </details>
    </div>
  );
}

export const validerCoordonnees = (c: Coordonnees) => {
  const e: Record<string, string> = {};
  if (!c.prenom.trim() || !c.nom.trim()) e.prenom = "Indiquez votre nom et votre prénom.";
  if (c.telephone.replace(/\D/g, "").length < 8) e.telephone = "Indiquez un numéro de téléphone complet.";
  if (c.email && !/^\S+@\S+\.\S+$/.test(c.email)) e.email = "Cette adresse e-mail n'est pas valide.";
  return e;
};
export const validerRendezVous = (r: RendezVous) => {
  const e: Record<string, string> = {};
  if (!r.zone) e.zone = "Choisissez votre commune.";
  if (!r.date) e.date = "Choisissez une date.";
  return e;
};

export type Etat = "repos" | "envoi" | "succes" | "erreur";

/** Noms de champs de l'API qui diffèrent de ceux du formulaire. */
const CHAMPS_API: Record<string, string> = { motDePasse: "mdp" };

/** Gère l'envoi : validation, état, défilement vers la première erreur, erreurs renvoyées par l'API. */
export function useEnvoi() {
  const [etat, setEtat] = useState<Etat>("repos");
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [messageErreur, setMessageErreur] = useState<string | undefined>();
  const signaler = (e: Record<string, string>) => {
    setErreurs(e);
    setTimeout(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 0);
  };
  const envoyer = async (validation: Record<string, string>, action: () => Promise<unknown>) => {
    setMessageErreur(undefined);
    if (Object.keys(validation).length) return signaler(validation);
    setErreurs({});
    setEtat("envoi");
    try { await action(); setEtat("succes"); } catch (e) {
      const { statut, message, champs } = lireErreur(e);
      if (statut === 422) {
        signaler(Object.fromEntries(Object.entries(champs).map(([cle, m]) => [CHAMPS_API[cle] ?? cle, m])));
        setMessageErreur(message ? `Certaines informations sont à corriger. ${message}` : "Certaines informations sont à corriger.");
      } else if (statut === 429) setMessageErreur("Trop d'envois en peu de temps. Patientez une minute avant de réessayer.");
      setEtat("erreur");
    }
  };
  return { etat, setEtat, erreurs, envoyer, messageErreur };
}

export function BoutonEnvoi({ etat, children }: { etat: Etat; children: ReactNode }) {
  return (
    <button className="f-btn f-btn--or f-btn--grand" type="submit" disabled={etat === "envoi"}>
      {etat === "envoi" ? <><Loader2 className="animate-spin" /> Envoi en cours</> : <>{children} <ArrowRight /></>}
    </button>
  );
}

export function MessageErreurEnvoi({ message }: { message?: string }) {
  return (
    <div className="f-alerte f-alerte--erreur" role="alert">
      <AlertCircle style={{ flex: "none", marginTop: 2 }} />
      {message ? <span>{message}</span> : (
        <span>Votre demande n'a pas pu être envoyée. Réessayez dans un instant, ou appelez-nous au <a href={`tel:${CONTACT.telephoneLien}`} style={{ textDecoration: "underline" }}>{CONTACT.telephone}</a>.</span>
      )}
    </div>
  );
}

export function Confirmation({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <div className="f-carte f-carte--blanche" role="status" style={{ display: "grid", gap: 14 }}>
      <CheckCircle2 style={{ width: 36, height: 36, color: "var(--f-succes)" }} />
      <h3 className="f-titre-m">{titre}</h3>
      <div className="f-texte">{children}</div>
    </div>
  );
}
