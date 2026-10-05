import Gabarit from "@/components/site/Gabarit";
import EnTetePage from "@/components/site/EnTetePage";
import EtapesPile from "@/components/site/EtapesPile";
import { useNavigate } from "react-router-dom";
import Simulateur from "@/components/site/Simulateur";
import { TitreLignes } from "@/components/site/Mouvement";
import { FINANCEMENTS } from "@/donnees/fidelem";

export default function Services() {
  const nav = useNavigate();
  return (
    <Gabarit>
      <EnTetePage
        label="Services"
        lignes={["Nos", <em key="e">financements.</em>]}
        chapo="Trois financements, un conseiller de votre zone à chaque étape."
      />
      {/* Les 3 financements en pile de cartes figée, comme la section Process de a-lign */}
      <EtapesPile
        mot="Financer"
        titre="Nos financements"
        intro="Choisissez votre financement pour voir les projets couverts et faire votre demande."
        bouton={{ libelle: "Trouver un conseiller", vers: "/trouver-un-conseiller" }}
        etapes={FINANCEMENTS.map((f) => ({
          titre: f.nom, texte: f.accroche, puces: f.projets.slice(0, 4), image: f.image,
          lien: `/services/${f.slug}`, demande: `/services/${f.slug}#demande`,
        }))}
      />
      <section className="f-section f-section--serree" id="simulateur">
        <div className="f-conteneur f-simu-section">
          <div className="f-simu-section__tete">
            <TitreLignes className="f-titre-l" lignes={["Simulez votre", "financement."]} />
            <p className="f-texte" data-revele>Choisissez un financement, ajustez le montant et la durée : vous voyez tout de suite vos mensualités.</p>
          </div>
          <Simulateur onUtiliser={({ slug, montant, duree }) => nav(`/services/${slug}?montant=${montant}&duree=${duree}#demande`)} />
        </div>
      </section>
    </Gabarit>
  );
}
