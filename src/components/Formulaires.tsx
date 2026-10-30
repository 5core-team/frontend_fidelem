// Champs des formulaires du site, dans le style des pages (cartes blanches,
// champs gris clair, bouton bleu Fidelem). La logique (validation, envoi,
// erreurs de l'API) est partagée avec les espaces : components/site/Formulaires.
import { ReactNode } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT, ZONES } from "@/donnees/fidelem";
import type { Coordonnees, RendezVous } from "@/config/apiPublic";
import type { Etat, Situation } from "@/components/site/Formulaires";

export {
  coordonneesVides, rendezVousVide, situationVide, useEnvoi,
  validerCoordonnees, validerRendezVous, validerSituation,
} from "@/components/site/Formulaires";

/** Classes communes des champs (identiques aux champs shadcn du site). */
export const champClasse =
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fidelem focus-visible:ring-offset-2 aria-[invalid=true]:border-red-500";
export const selectClasse = `${champClasse} h-10`;

export function Champ({ libelle, id, optionnel, erreur, aide, children }: {
  libelle: ReactNode; id?: string; optionnel?: boolean; erreur?: string; aide?: ReactNode; children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium block">
        {libelle}{optionnel && <span className="text-gray-400 font-normal"> (facultatif)</span>}
      </label>
      {children}
      {erreur ? <p className="text-sm text-red-600" role="alert">{erreur}</p> : aide ? <p className="text-xs text-gray-500">{aide}</p> : null}
    </div>
  );
}

/** Pastilles à cocher (choix unique ou multiple). */
export function Pastilles({ nom, options, valeur, onChange, multiple = false }: {
  nom: string; options: string[]; valeur: string | string[]; onChange: (v: string | string[]) => void; multiple?: boolean;
}) {
  const coche = (o: string) => (multiple ? (valeur as string[]).includes(o) : valeur === o);
  const basculer = (o: string) => {
    if (!multiple) return onChange(o);
    const liste = valeur as string[];
    onChange(liste.includes(o) ? liste.filter((x) => x !== o) : [...liste, o]);
  };
  return (
    <div className="flex flex-wrap gap-2" role={multiple ? "group" : "radiogroup"}>
      {options.map((o) => (
        <label key={o} className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm transition-colors ${coche(o) ? "bg-fidelem text-white border-fidelem" : "bg-white text-gray-700 border-gray-300 hover:border-fidelem"}`}>
          <input className="sr-only" type={multiple ? "checkbox" : "radio"} name={nom} checked={coche(o)} onChange={() => basculer(o)} />
          {o}
        </label>
      ))}
    </div>
  );
}

function Groupe({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-4 border-t border-gray-100 pt-5">
      <legend className="text-sm font-semibold text-fidelem uppercase tracking-wide">{titre}</legend>
      {children}
    </fieldset>
  );
}

/** Coordonnées : nom complet et téléphone, e-mail si demandé. */
export function BlocCoordonnees({ valeur, onChange, erreurs, avecEmail = false }: {
  valeur: Coordonnees; onChange: (v: Coordonnees) => void; erreurs: Record<string, string>; avecEmail?: boolean;
}) {
  const nomComplet = [valeur.prenom, valeur.nom].filter(Boolean).join(" ");
  const majNom = (v: string) => { const [prenom, ...reste] = v.trimStart().split(" "); onChange({ ...valeur, prenom: prenom ?? "", nom: reste.join(" ") }); };
  return (
    <Groupe titre="Vos coordonnées">
      <div className={`grid gap-4 ${avecEmail ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
        <Champ libelle="Nom et prénom" id="f-nom-complet" erreur={erreurs.prenom || erreurs.nom}>
          <input id="f-nom-complet" className={champClasse} autoComplete="name" value={nomComplet} onChange={(e) => majNom(e.target.value)} aria-invalid={!!(erreurs.prenom || erreurs.nom)} />
        </Champ>
        <Champ libelle="Téléphone" id="f-telephone" erreur={erreurs.telephone}>
          <input id="f-telephone" className={champClasse} type="tel" inputMode="tel" autoComplete="tel" placeholder="01 00 00 00 00" value={valeur.telephone} onChange={(e) => onChange({ ...valeur, telephone: e.target.value })} aria-invalid={!!erreurs.telephone} />
        </Champ>
        {avecEmail && (
          <Champ libelle="E-mail" id="f-email" erreur={erreurs.email}>
            <input id="f-email" className={champClasse} type="email" autoComplete="email" value={valeur.email} onChange={(e) => onChange({ ...valeur, email: e.target.value })} aria-invalid={!!erreurs.email} />
          </Champ>
        )}
      </div>
    </Groupe>
  );
}

const MODES = ["En agence", "Par téléphone", "En visio", "Sur WhatsApp"];
const CRENEAUX = ["Matin (8 h – 12 h)", "Midi (12 h – 14 h)", "Après-midi (14 h – 17 h)", "Fin de journée (17 h – 19 h)"];
const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const demain = () => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10); };

/** Rendez-vous avec un conseiller financier et disponibilités. */
export function BlocRendezVous({ valeur, onChange, erreurs, titre = "Rendez-vous avec un conseiller financier" }: {
  valeur: RendezVous; onChange: (v: RendezVous) => void; erreurs: Record<string, string>; titre?: string;
}) {
  const maj = <K extends keyof RendezVous>(k: K, v: RendezVous[K]) => onChange({ ...valeur, [k]: v });
  return (
    <Groupe titre={titre}>
      <div className="grid gap-4 md:grid-cols-3">
        <Champ libelle="Votre commune" id="f-zone" erreur={erreurs.zone} aide="Un conseiller de votre zone vous accompagne.">
          <select id="f-zone" className={selectClasse} value={valeur.zone} onChange={(e) => maj("zone", e.target.value)} aria-invalid={!!erreurs.zone}>
            <option value="">Choisir</option>
            {ZONES.map((z) => <option key={z}>{z}</option>)}
          </select>
        </Champ>
        <Champ libelle="Date souhaitée" id="f-date" erreur={erreurs.date}>
          <input id="f-date" className={champClasse} type="date" min={demain()} value={valeur.date} onChange={(e) => maj("date", e.target.value)} aria-invalid={!!erreurs.date} />
        </Champ>
        <Champ libelle="Créneau" id="f-creneau">
          <select id="f-creneau" className={selectClasse} value={valeur.creneau} onChange={(e) => maj("creneau", e.target.value)}>
            {CRENEAUX.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Champ>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Vos autres disponibilités <span className="text-gray-400 font-normal">(facultatif)</span></p>
        <Pastilles nom="jours" multiple options={JOURS} valeur={valeur.autresDisponibilites} onChange={(v) => maj("autresDisponibilites", v as string[])} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm font-medium">Mode de rendez-vous</p>
          <Pastilles nom="mode" options={MODES} valeur={valeur.mode} onChange={(v) => maj("mode", v as string)} />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">On vous recontacte par</p>
          <Pastilles nom="contact" options={["Appel", "WhatsApp", "E-mail"]} valeur={valeur.contactPrefere} onChange={(v) => maj("contactPrefere", v as string)} />
        </div>
      </div>
    </Groupe>
  );
}

// Tranches de revenus reprises des trois niveaux de conseiller FIDELEM.
const REVENUS = ["Moins de 100 000 FCFA", "100 000 à 500 000 FCFA", "500 000 à 1 500 000 FCFA", "Plus de 1 500 000 FCFA"];
const CONTRATS = ["CDI", "CDD", "Fonctionnaire", "Indépendant ou commerçant", "Contrat temporaire ou stage", "Sans contrat"];

/** Situation de l'usager : revenus, contrat et activité actuelle. */
export function BlocSituation({ valeur, onChange, erreurs }: { valeur: Situation; onChange: (v: Situation) => void; erreurs: Record<string, string> }) {
  const maj = <K extends keyof Situation>(k: K, v: Situation[K]) => onChange({ ...valeur, [k]: v });
  return (
    <Groupe titre="Votre situation">
      <div className="grid gap-4 md:grid-cols-3">
        <Champ libelle="Revenus mensuels" id="f-revenus" erreur={erreurs.revenus}>
          <select id="f-revenus" className={selectClasse} value={valeur.revenus} onChange={(e) => maj("revenus", e.target.value)} aria-invalid={!!erreurs.revenus}>
            <option value="">Choisir</option>
            {REVENUS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </Champ>
        <Champ libelle="Contrat" id="f-contrat" erreur={erreurs.contrat}>
          <select id="f-contrat" className={selectClasse} value={valeur.contrat} onChange={(e) => maj("contrat", e.target.value)} aria-invalid={!!erreurs.contrat}>
            <option value="">Choisir</option>
            {CONTRATS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Champ>
        <Champ libelle="Activité actuelle" id="f-activite" erreur={erreurs.activite}>
          <input id="f-activite" className={champClasse} placeholder="Ex. commerçante, enseignant" value={valeur.activite} onChange={(e) => maj("activite", e.target.value)} aria-invalid={!!erreurs.activite} />
        </Champ>
      </div>
    </Groupe>
  );
}

export function BoutonEnvoi({ etat, children }: { etat: Etat; children: ReactNode }) {
  return (
    <Button type="submit" disabled={etat === "envoi"} className="w-full bg-fidelem hover:bg-fidelem/90 h-11 text-base">
      {etat === "envoi" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Envoi en cours</> : children}
    </Button>
  );
}

export function MessageErreurEnvoi({ message }: { message?: string }) {
  return (
    <div className="flex gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
      <AlertCircle className="h-5 w-5 shrink-0" />
      {message ? <span>{message}</span> : (
        <span>Votre demande n'a pas pu être envoyée. Réessayez dans un instant, ou appelez-nous au <a href={`tel:${CONTACT.telephoneLien}`} className="underline">{CONTACT.telephone}</a>.</span>
      )}
    </div>
  );
}

export function Confirmation({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <div className="text-center space-y-4 py-6" role="status">
      <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto" />
      <h3 className="text-2xl font-semibold text-fidelem">{titre}</h3>
      <div className="text-gray-600 max-w-xl mx-auto">{children}</div>
    </div>
  );
}
