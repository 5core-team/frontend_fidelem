import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Gabarit from "@/components/site/Gabarit";
import EnTetePage from "@/components/site/EnTetePage";
import { MotBarres, TitreLignes } from "@/components/site/Mouvement";
import { ICONES_LIVING } from "@/components/site/icones";
import { NOTES_LIVING } from "@/components/site/notesLiving";
import { EASYLIFE } from "@/donnees/fidelem";

export default function EasyLife() {
  return (
    <Gabarit>
      <EnTetePage
        label="EasyLife · l'écosystème"
        lignes={["Construire un", <em key="e">meilleur quotidien.</em>]}
        chapo={EASYLIFE.presentation}
        enfants={<div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 32 }} data-revele="400">
          <a className="f-btn f-btn--or f-btn--grand" href="#living">Découvrir EasyLife Living</a>
          <Link className="f-btn f-btn--gris f-btn--grand" to="/contact">Je suis intéressé(e)</Link>
        </div>}
      />

      {/* EasyLife Living */}
      <section id="living" className="f-section">
        <div className="f-conteneur f-liste-offre">
          <div className="f-liste-offre__cote">
            <p className="f-label f-label--doux">Offre phare · disponible en premier</p>
            <TitreLignes className="f-titre-xl" lignes={["EasyLife Living.", <em key="e">Le confort de vie tout-en-un.</em>]} />
            <p className="f-texte" data-revele>{EASYLIFE.living.texte}</p>
            <div className="f-guide f-guide--serre" style={{ width: "fit-content" }} data-revele><Link className="f-btn f-btn--or f-btn--grand" to="/contact">Je veux en bénéficier <ArrowRight /></Link></div>
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
            <div className="f-guide" data-revele><p className="f-label">Quatre pôles pour compléter Living.</p></div>
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


      {/* Rejoindre */}
      <section className="f-section f-final">
        <div className="f-conteneur f-final__grille">
          <TitreLignes className="f-titre-xxl" lignes={["Rejoindre", "EasyLife."]} />
          <div className="f-final__actions" data-revele>
            <div className="f-guide f-guide--serre" style={{ width: "fit-content" }}><Link className="f-btn f-btn--or f-btn--grand" to="/contact">Rejoindre EasyLife <ArrowRight /></Link></div>
          </div>
        </div>
      </section>
    </Gabarit>
  );
}
