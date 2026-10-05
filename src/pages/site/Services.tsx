import Gabarit from "@/components/site/Gabarit";
import EnTetePage from "@/components/site/EnTetePage";
import EtapesPile from "@/components/site/EtapesPile";
import { FINANCEMENTS } from "@/donnees/fidelem";

export default function Services() {
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
    </Gabarit>
  );
}
