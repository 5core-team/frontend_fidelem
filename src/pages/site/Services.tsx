import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Gabarit from "@/components/site/Gabarit";
import EnTetePage from "@/components/site/EnTetePage";
import { FINANCEMENTS } from "@/donnees/fidelem";

export default function Services() {
  return (
    <Gabarit>
      <EnTetePage
        label="Services"
        lignes={["Nos", <em key="e">financements.</em>]}
        chapo="Trois financements, un conseiller de votre zone à chaque étape."
      />

      <section className="f-section f-section--serree" style={{ paddingTop: 0 }}>
        <div className="f-conteneur">
          <ul className="f-niveaux">
            {FINANCEMENTS.map((f, i) => (
              <li key={f.slug}>
                <Link to={`/services/${f.slug}`} className="f-niveaux__lien">
                  <span className="f-niveaux__nom">{f.court}</span>
                  <span className="f-niveaux__fiche">
                    <span className="f-mono">0{i + 1} / 03</span>
                    <span>{f.accroche}</span>
                    <span className="f-lien" style={{ justifySelf: "end" }}>En savoir plus <ArrowUpRight /></span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

    </Gabarit>
  );
}
