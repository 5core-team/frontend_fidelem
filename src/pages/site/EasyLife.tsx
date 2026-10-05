import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Gabarit from "@/components/site/Gabarit";
import EnTetePage from "@/components/site/EnTetePage";
import { MotBarres, TitreLignes } from "@/components/site/Mouvement";
import { ICONES_LIVING } from "@/components/site/icones";
import { NOTES_LIVING } from "@/components/site/notesLiving";
import { EASYLIFE } from "@/donnees/fidelem";
import { envoyerInteretEasyLife } from "@/config/apiPublic";
import {
  BlocCoordonnees, BlocRendezVous, BoutonEnvoi, Champ, Choix, Confirmation, MessageErreurEnvoi,
  coordonneesVides, rendezVousVide, useEnvoi, validerCoordonnees, validerRendezVous,
} from "@/components/site/Formulaires";

const POLES = ["EasyLife Living", ...EASYLIFE.poles.map((p) => `EasyLife ${p.nom}`)];

function FormulaireInteret() {
  const [coord, setCoord] = useState(coordonneesVides());
  const [rdv, setRdv] = useState(rendezVousVide());
  const [profil, setProfil] = useState("Travailleur");
  const [pole, setPole] = useState(POLES[0]);
  const message = "";
  const { etat, erreurs, envoyer } = useEnvoi();

  if (etat === "succes") return (
    <Confirmation titre="Merci, votre intérêt est bien noté.">
      L'équipe EasyLife vous recontacte pour vous présenter {pole} et répondre à vos questions.
    </Confirmation>
  );

  return (
    <form className="f-form" noValidate onSubmit={(e) => { e.preventDefault(); envoyer({ ...validerCoordonnees(coord), ...validerRendezVous(rdv) }, () => envoyerInteretEasyLife({ ...coord, profil, pole, message, rendezVous: rdv })); }}>
      <div className="f-champ"><span>Vous êtes</span><Choix nom="profil" options={["Travailleur", "Entreprise", "Partenaire"]} valeur={profil} onChange={(v) => setProfil(v as string)} /></div>
      <Champ libelle="Ce qui vous intéresse"><select id="f-pole" value={pole} onChange={(e) => setPole(e.target.value)}>{POLES.map((p) => <option key={p}>{p}</option>)}</select></Champ>
      <BlocCoordonnees valeur={coord} onChange={setCoord} erreurs={erreurs} />
      <BlocRendezVous valeur={rdv} onChange={setRdv} erreurs={erreurs} titre="Pour en parler" />
      {etat === "erreur" && <MessageErreurEnvoi />}
      <BoutonEnvoi etat={etat}>Envoyer</BoutonEnvoi>
    </form>
  );
}

export default function EasyLife() {
  return (
    <Gabarit>
      <EnTetePage
        label="EasyLife · l'écosystème"
        lignes={["Construire un", <em key="e">meilleur quotidien.</em>]}
        chapo={EASYLIFE.presentation}
        note="Logement, mobilité, services, épargne et entreprises : EasyLife réunit les services essentiels du quotidien."
        enfants={<div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 32 }} data-revele="400">
          <a className="f-btn f-btn--or f-btn--grand" href="#living">Découvrir EasyLife Living</a>
          <a className="f-btn f-btn--gris f-btn--grand" href="#interet">Je suis intéressé(e)</a>
        </div>}
      />

      {/* EasyLife Living */}
      <section id="living" className="f-section">
        <div className="f-conteneur f-liste-offre">
          <div className="f-liste-offre__cote">
            <p className="f-label f-label--doux">Offre phare · disponible en premier</p>
            <TitreLignes className="f-titre-xl" lignes={["EasyLife Living.", <em key="e">Le confort de vie tout-en-un.</em>]} />
            <p className="f-texte" data-revele>{EASYLIFE.living.texte}</p>
            <div className="f-guide f-guide--serre" style={{ width: "fit-content" }} data-revele><a className="f-btn f-btn--or f-btn--grand" href="#interet">Je veux en bénéficier <ArrowRight /></a></div>
          </div>
          <ol className="f-liste-offre__items">
            {EASYLIFE.living.offre.map((o, i) => {
              const Icone = ICONES_LIVING[o.icone as keyof typeof ICONES_LIVING];
              return (
                <li key={o.titre} data-revele={i * 50}>
                  <span className="f-numero">0{i + 1}</span>
                  <Icone aria-hidden="true" />
                  <span className="f-liste-offre__nom">{o.titre}</span>
                  <span className="f-liste-offre__note">{NOTES_LIVING[o.titre]}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Les pôles */}
      <section className="f-section">
        <div className="f-conteneur">
          <div className="f-entete">
            <MotBarres mot="Pôles" variante="or" />
            <div className="f-guide" data-revele><p className="f-label">Après Living, l'écosystème se déploie autour de quatre pôles complémentaires, pour les particuliers, les travailleurs et les entreprises.</p></div>
          </div>
          <div className="f-poles">
            {EASYLIFE.poles.map((p, i) => (
              <article key={p.nom} className="f-pole f-carte" data-revele={i * 90}>
                <div className="f-pole__tete">
                  <span className="f-numero">EasyLife</span>
                  <h3 className="f-titre-l">{p.nom}</h3>
                </div>
                <p className="f-label">{p.titre}</p>
                <p className="f-texte">{p.texte}</p>
                <ul className="f-puces">{p.offres.map((o) => <li key={o} className="f-puce">{o}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Vision, mission, valeurs */}
      <section className="f-section f-section--serree" style={{ background: "var(--f-papier-2)" }}>
        <div className="f-conteneur f-vision">
          <div className="f-vision__bloc" data-revele>
            <p className="f-label f-label--doux">Vision</p>
            <p className="f-titre-m">{EASYLIFE.vision}</p>
          </div>
          <div className="f-vision__bloc" data-revele>
            <p className="f-label f-label--doux">Mission</p>
            <p className="f-titre-m">{EASYLIFE.mission}</p>
          </div>
        </div>
      </section>

      {/* Intérêt */}
      <section className="f-section" id="interet">
        <div className="f-conteneur f-demande">
          <div className="f-demande__cote">
            <TitreLignes className="f-titre-l" lignes={["Rejoindre", "EasyLife."]} />
            <p className="f-texte" data-revele>Travailleur, entreprise ou prestataire : dites-nous ce qui vous intéresse et quand vous êtes disponible. L'équipe vous recontacte.</p>
            <p className="f-titre-m" style={{ color: "var(--f-encre-3)" }} data-revele>« {EASYLIFE.slogan} »</p>
          </div>
          <div className="f-carte" data-revele><FormulaireInteret /></div>
        </div>
      </section>
    </Gabarit>
  );
}
