import { ReactNode } from "react";
import { TitreLignes } from "./Mouvement";

/** En-tête des pages intérieures : libellé, grand titre, chapo et une note encadrée en pointillés. */
export default function EnTetePage({ label, lignes, chapo, note, enfants }: { label: string; lignes: ReactNode[]; chapo?: ReactNode; note?: ReactNode; enfants?: ReactNode }) {
  return (
    <section className="f-page-tete">
      <div className="f-conteneur">
        <p className="f-label f-label--doux" data-revele>{label}</p>
        <TitreLignes as="h1" auChargement className="f-titre-xxl" lignes={lignes} />
        {(chapo || note) && (
          <div className="f-page-tete__bas">
            {chapo && <p className="f-chapo" data-revele="200">{chapo}</p>}
            {note && <div className="f-guide" data-revele="300"><p className="f-label">{note}</p></div>}
          </div>
        )}
        {enfants}
      </div>
    </section>
  );
}
