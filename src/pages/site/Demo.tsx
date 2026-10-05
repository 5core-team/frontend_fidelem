import { ArrowRight, Briefcase, User, ShieldCheck } from "lucide-react";
import Gabarit from "@/components/site/Gabarit";
import EnTetePage from "@/components/site/EnTetePage";
import { activerDemo, COMPTES_DEMO } from "@/config/demo";

const ESPACES = [
  { role: "advisor" as const, titre: "Espace Conseiller", texte: "Demandes de la zone de Cotonou, fiche d'une demande, rendez-vous, clients.", chemin: "/espace-conseiller", icone: Briefcase },
  { role: "user" as const, titre: "Espace Client", texte: "Suivi des demandes de financement et du conseiller attribué.", chemin: "/mon-espace", icone: User },
  { role: "manager" as const, titre: "Back-office", texte: "Candidatures, conseillers, zones, demandes et intérêts EasyLife.", chemin: "/responsable", icone: ShieldCheck },
];

/** Page d'entrée du mode démonstration : on choisit un espace, des données d'exemple remplacent le serveur. */
export default function Demo() {
  const entrer = (role: keyof typeof COMPTES_DEMO, chemin: string) => { activerDemo(role); window.location.href = chemin; };
  return (
    <Gabarit>
      <EnTetePage label="Démonstration" lignes={["Visiter", <em key="e">les espaces.</em>]} chapo="Des données d'exemple, sans serveur. Les actions sont simulées et ne sont pas enregistrées." />
      <section className="f-section" style={{ paddingTop: 0 }}>
        <div className="f-conteneur">
          <ul className="f-reseau f-demo">
            {ESPACES.map(({ role, titre, texte, chemin, icone: Icone }) => (
              <li key={role}>
                <Icone aria-hidden="true" style={{ width: 26, height: 26, color: "var(--f-or)" }} />
                <h2 className="f-titre-m">{titre}</h2>
                <p className="f-texte">{texte}</p>
                <p className="f-note">Connecté en tant que {COMPTES_DEMO[role].name} {COMPTES_DEMO[role].last_name}</p>
                <button type="button" className="f-btn f-btn--or" onClick={() => entrer(role, chemin)}>Entrer <ArrowRight /></button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Gabarit>
  );
}
