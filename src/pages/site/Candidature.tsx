import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Gabarit from "@/components/site/Gabarit";
import EnTetePage from "@/components/site/EnTetePage";
import { FORMATIONS, FRAIS, PARCOURS_CONSEILLER, formatFcfa } from "@/donnees/fidelem";
import { envoyerCandidature } from "@/config/apiPublic";
import {
  BlocCoordonnees, BlocRendezVous, BoutonEnvoi, Champ, Choix, Confirmation, MessageErreurEnvoi,
  coordonneesVides, rendezVousVide, useEnvoi, validerCoordonnees, validerRendezVous,
} from "@/components/site/Formulaires";

const NIVEAUX = [...FORMATIONS.map((f) => `CF ${f.nom}`), "Je ne sais pas encore"];

export default function Candidature() {
  const [params] = useSearchParams();
  const pre = FORMATIONS.find((f) => f.id === params.get("niveau"));
  const [niveau, setNiveau] = useState(pre ? `CF ${pre.nom}` : NIVEAUX[3]);
  const [coord, setCoord] = useState(coordonneesVides());
  const [rdv, setRdv] = useState(rendezVousVide());
  const [situation, setSituation] = useState("Salarié(e)");
  const experience = "";
  const [mdp, setMdp] = useState("");
  const [mdp2, setMdp2] = useState("");
  const [accord, setAccord] = useState(false);
  const { etat, erreurs, envoyer } = useEnvoi();
  const choisi = FORMATIONS.find((f) => `CF ${f.nom}` === niveau);

  const soumettre = (e: React.FormEvent) => {
    e.preventDefault();
    const v: Record<string, string> = { ...validerCoordonnees(coord), ...validerRendezVous(rdv) };
    if (!coord.email) v.email = "L'e-mail sert d'identifiant pour votre Espace Conseiller.";
    if (mdp.length < 8) v.mdp = "Au moins 8 caractères.";
    if (mdp !== mdp2) v.mdp2 = "Les deux mots de passe ne correspondent pas.";
    if (!accord) v.accord = "Vous devez accepter les conditions pour continuer.";
    envoyer(v, () => envoyerCandidature({ ...coord, niveauVise: niveau, situation, experience, motDePasse: mdp, rendezVous: rdv }));
  };

  return (
    <Gabarit>
      <EnTetePage label="Conseiller Financier · candidature" lignes={["Votre", <em key="e">candidature.</em>]} chapo="Quelques informations pour préparer l'échange et le test de niveau. Votre compte est créé en attente, puis activé avec votre licence et votre zone." />
      <section className="f-section" style={{ paddingTop: 0 }}>
        <div className="f-conteneur f-demande">
          <aside className="f-demande__cote">
            <div className="f-carte f-carte--blanche" style={{ display: "grid", gap: 16 }}>
              <p className="f-label f-label--doux">Récapitulatif</p>
              <p className="f-titre-m">{choisi ? `CF ${choisi.nom}` : "Niveau fixé après le test"}</p>
              <dl className="f-recap">
                <div><dt>Inscription</dt><dd>{formatFcfa(FRAIS.inscription)} · non remboursables</dd></div>
                <div><dt>Formation</dt><dd>{choisi ? `${formatFcfa(choisi.prix)} · ${choisi.duree}` : "50 000 à 150 000 FCFA"}</dd></div>
                <div><dt>Paiement</dt><dd>En 3 fois, au début de chaque mois</dd></div>
                <div><dt>Remboursement</dt><dd>Frais de formation remboursés à la signature du contrat</dd></div>
              </dl>
            </div>
          </aside>
          <div className="f-carte">
            {etat === "succes" ? (
              <Confirmation titre="Candidature envoyée.">
                <p>Merci {coord.prenom}. Nous vous appelons pour l'échange et le test de niveau, à la date choisie ({rdv.date}, {rdv.creneau.toLowerCase()}).</p>
                <p style={{ marginTop: 12 }}>Votre Espace Conseiller est créé <strong>en attente de validation</strong> : vous pourrez vous connecter avec votre e-mail, et il sera activé avec votre licence et votre zone.</p>
                <p style={{ marginTop: 16 }}><Link className="f-lien" to="/conseiller-financier">Retour à la page Conseiller Financier</Link></p>
              </Confirmation>
            ) : (
              <form className="f-form" noValidate onSubmit={soumettre}>
                <div className="f-champ"><span>Niveau visé <em>· fixé définitivement après le test</em></span><Choix nom="niveau" options={NIVEAUX} valeur={niveau} onChange={(v) => setNiveau(v as string)} /></div>
                <BlocCoordonnees valeur={coord} onChange={setCoord} erreurs={erreurs} avecEmail />
                <Champ libelle="Situation actuelle">
                  <select id="f-situation" value={situation} onChange={(e) => setSituation(e.target.value)}>{["Salarié(e)", "Indépendant(e)", "Étudiant(e)", "Sans emploi", "Autre"].map((o) => <option key={o}>{o}</option>)}</select>
                </Champ>
                <BlocRendezVous valeur={rdv} onChange={setRdv} erreurs={erreurs} titre="Échange et test de niveau" />
                <div className="f-form__groupe">
                  <div className="f-grille-2">
                    <Champ libelle="Mot de passe" erreur={erreurs.mdp}><input id="f-mdp" type="password" autoComplete="new-password" value={mdp} onChange={(e) => setMdp(e.target.value)} aria-invalid={!!erreurs.mdp} /></Champ>
                    <Champ libelle="Confirmer" erreur={erreurs.mdp2}><input id="f-mdp2" type="password" autoComplete="new-password" value={mdp2} onChange={(e) => setMdp2(e.target.value)} aria-invalid={!!erreurs.mdp2} /></Champ>
                  </div>
                  <label className="f-case">
                    <input id="f-accord" type="checkbox" checked={accord} onChange={(e) => setAccord(e.target.checked)} aria-invalid={!!erreurs.accord} />
                    <span>J'ai pris connaissance des frais (inscription de {formatFcfa(FRAIS.inscription)} non remboursables) et j'accepte les <Link to="/conditions" style={{ textDecoration: "underline" }}>conditions d'utilisation</Link>.</span>
                  </label>
                  {erreurs.accord && <small className="f-erreur" role="alert">{erreurs.accord}</small>}
                </div>
                {etat === "erreur" && <MessageErreurEnvoi />}
                <BoutonEnvoi etat={etat}>Envoyer ma candidature</BoutonEnvoi>
              </form>
            )}
          </div>
        </div>
      </section>
    </Gabarit>
  );
}
