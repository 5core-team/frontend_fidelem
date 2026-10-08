import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Gabarit, { EnTetePage } from "@/components/Gabarit";
import { FORMATIONS, FRAIS, formatFcfa } from "@/donnees/fidelem";
import { envoyerCandidature } from "@/config/apiPublic";
import {
  BlocCoordonnees, BlocRendezVous, BoutonEnvoi, Champ, Confirmation, MessageErreurEnvoi, Pastilles,
  champClasse, selectClasse, coordonneesVides, rendezVousVide, useEnvoi, validerCoordonnees, validerRendezVous,
} from "@/components/Formulaires";

const NIVEAUX = [...FORMATIONS.map((f) => `CF ${f.nom}`), "Je ne sais pas encore"];
const SITUATIONS = ["Salarié(e)", "Indépendant(e)", "Étudiant(e)", "Sans emploi", "Autre"];

export default function Candidature() {
  const [params] = useSearchParams();
  const pre = FORMATIONS.find((f) => f.id === params.get("niveau"));
  const [niveau, setNiveau] = useState(pre ? `CF ${pre.nom}` : NIVEAUX[3]);
  const [coord, setCoord] = useState(coordonneesVides());
  const [rdv, setRdv] = useState(rendezVousVide());
  const [situation, setSituation] = useState(SITUATIONS[0]);
  const [mdp, setMdp] = useState("");
  const [mdp2, setMdp2] = useState("");
  const [accord, setAccord] = useState(false);
  const { etat, erreurs, envoyer, messageErreur } = useEnvoi();
  const choisi = FORMATIONS.find((f) => `CF ${f.nom}` === niveau);

  const soumettre = (e: React.FormEvent) => {
    e.preventDefault();
    const v: Record<string, string> = { ...validerCoordonnees(coord), ...validerRendezVous(rdv) };
    if (!coord.email) v.email = "L'e-mail sert d'identifiant pour votre espace conseiller.";
    if (mdp.length < 8) v.mdp = "Au moins 8 caractères.";
    if (mdp !== mdp2) v.mdp2 = "Les deux mots de passe ne correspondent pas.";
    if (!accord) v.accord = "Vous devez accepter les conditions pour continuer.";
    envoyer(v, () => envoyerCandidature({ ...coord, niveauVise: niveau, situation, experience: "", motDePasse: mdp, rendezVous: rdv }));
  };

  return (
    <Gabarit>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <EnTetePage titre="Devenir conseiller financier" sousTitre="Deux minutes pour préparer l'échange et le test de niveau." />
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <Card className="lg:sticky lg:top-24">
            <CardHeader>
              <p className="text-sm text-gray-500">Récapitulatif</p>
              <CardTitle className="text-2xl text-fidelem">{choisi ? `CF ${choisi.nom}` : "Niveau fixé après le test"}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3 text-sm">
                <div><dt className="text-gray-500">Inscription</dt><dd className="font-medium">{formatFcfa(FRAIS.inscription)}, non remboursables</dd></div>
                <div><dt className="text-gray-500">Formation</dt><dd className="font-medium">{choisi ? `${formatFcfa(choisi.prix)} · ${choisi.duree}` : "50 000 à 150 000 FCFA"}</dd></div>
                <div><dt className="text-gray-500">Paiement</dt><dd className="font-medium">En 3 fois, au début de chaque mois</dd></div>
                <div><dt className="text-gray-500">Remboursement</dt><dd className="font-medium">Frais de formation remboursés à la signature du contrat</dd></div>
              </dl>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              {etat === "succes" ? (
                <Confirmation titre="Candidature envoyée.">
                  <p>Merci {coord.prenom}. Nous vous appelons pour l'échange et le test de niveau, à la date choisie ({rdv.date}, {rdv.creneau.toLowerCase()}).</p>
                  <p className="mt-3">Votre espace conseiller est créé <strong>en attente de validation</strong> : il sera activé avec votre licence et votre zone.</p>
                  <p className="mt-4"><Link className="text-fidelem underline" to="/conseiller-financier">Retour à la page Conseiller Financier</Link></p>
                </Confirmation>
              ) : (
                <form noValidate onSubmit={soumettre} className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Niveau visé <span className="text-gray-400 font-normal">(fixé définitivement après le test)</span></p>
                    <Pastilles nom="niveau" options={NIVEAUX} valeur={niveau} onChange={(v) => setNiveau(v as string)} />
                  </div>
                  <BlocCoordonnees valeur={coord} onChange={setCoord} erreurs={erreurs} avecEmail />
                  <Champ libelle="Situation actuelle" id="f-situation">
                    <select id="f-situation" className={selectClasse} value={situation} onChange={(e) => setSituation(e.target.value)}>
                      {SITUATIONS.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </Champ>
                  <BlocRendezVous valeur={rdv} onChange={setRdv} erreurs={erreurs} titre="Échange et test de niveau" />
                  <fieldset className="space-y-4 border-t border-gray-100 pt-5">
                    <legend className="text-sm font-semibold text-fidelem uppercase tracking-wide">Accès à votre espace conseiller</legend>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Champ libelle="Mot de passe" id="f-mdp" erreur={erreurs.mdp} aide="8 caractères au moins.">
                        <input id="f-mdp" className={champClasse} type="password" autoComplete="new-password" value={mdp} onChange={(e) => setMdp(e.target.value)} aria-invalid={!!erreurs.mdp} />
                      </Champ>
                      <Champ libelle="Confirmer le mot de passe" id="f-mdp2" erreur={erreurs.mdp2}>
                        <input id="f-mdp2" className={champClasse} type="password" autoComplete="new-password" value={mdp2} onChange={(e) => setMdp2(e.target.value)} aria-invalid={!!erreurs.mdp2} />
                      </Champ>
                    </div>
                    <label className="flex gap-3 text-sm text-gray-700">
                      <input id="f-accord" type="checkbox" className="mt-1 h-4 w-4 accent-[#002060]" checked={accord} onChange={(e) => setAccord(e.target.checked)} aria-invalid={!!erreurs.accord} />
                      <span>J'ai pris connaissance des frais (inscription de {formatFcfa(FRAIS.inscription)} non remboursables) et j'accepte les <Link to="/conditions" className="underline">conditions d'utilisation</Link>.</span>
                    </label>
                    {erreurs.accord && <p className="text-sm text-red-600" role="alert">{erreurs.accord}</p>}
                  </fieldset>
                  {etat === "erreur" && <MessageErreurEnvoi message={messageErreur} />}
                  <BoutonEnvoi etat={etat}>Envoyer ma candidature</BoutonEnvoi>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Gabarit>
  );
}
