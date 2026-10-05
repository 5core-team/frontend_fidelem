import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Gabarit from "@/components/site/Gabarit";
import EnTetePage from "@/components/site/EnTetePage";
import { MotBarres, TitreLignes } from "@/components/site/Mouvement";
import { FINANCEMENTS } from "@/donnees/fidelem";

export default function Services() {
  return (
    <Gabarit>
      <EnTetePage
        label="Services"
        lignes={["Nos", <em key="e">financements.</em>]}
        chapo="Trois familles de financement pour les particuliers, les travailleurs et les entreprises. À chaque fois, un conseiller de votre zone monte le dossier avec vous."
        note="Immobilier · Transport · Affaires"
      />

      <section className="f-section f-section--serree" style={{ paddingTop: 0 }}>
        <div className="f-conteneur f-services">
          {FINANCEMENTS.map((f, i) => (
            <article key={f.slug} className="f-service" data-revele>
              <div className="f-service__image f-guide"><img className="f-photo" src={f.image} alt="" loading="lazy" /></div>
              <div className="f-service__corps">
                <div className="f-service__tete">
                  <span className="f-numero">0{i + 1} / 03</span>
                  <h2 className="f-titre-l">{f.nom}</h2>
                  <p className="f-chapo">{f.resume}</p>
                </div>
                <div className="f-grille-2" style={{ gap: 24 }}>
                  <div><p className="f-label f-label--doux">Projets couverts</p><ul className="f-liste">{f.projets.slice(0, 4).map((p) => <li key={p}>{p}</li>)}</ul></div>
                  <div><p className="f-label f-label--doux">Pour qui</p><ul className="f-liste">{f.pourQui.map((p) => <li key={p}>{p}</li>)}</ul></div>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <div className="f-guide f-guide--serre"><Link className="f-btn f-btn--encre" to={`/services/${f.slug}`}>En savoir plus <ArrowUpRight /></Link></div>
                  <Link className="f-btn f-btn--gris" to={`/services/${f.slug}#demande`}>Faire ma demande</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="f-section">
        <div className="f-conteneur f-role">
          <MotBarres mot="Conseil" variante="or" />
          <div className="f-role__texte">
            <TitreLignes className="f-titre-l" lignes={["Le rôle du conseiller", "à chaque étape."]} />
            <p className="f-texte" data-revele>Votre conseiller FIDELEM est formé pour accompagner tous les profils, du petit commerçant au chef d'entreprise. Il analyse votre situation, vous dit quelles pièces préparer, monte un dossier solide et le présente aux partenaires financiers. Il reste votre interlocuteur jusqu'à la réponse.</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }} data-revele>
              <Link className="f-btn f-btn--or f-btn--grand" to="/trouver-un-conseiller">Trouver un conseiller <ArrowRight /></Link>
              <Link className="f-btn f-btn--gris f-btn--grand" to="/easylife">Voir aussi EasyLife</Link>
            </div>
          </div>
        </div>
      </section>
    </Gabarit>
  );
}
