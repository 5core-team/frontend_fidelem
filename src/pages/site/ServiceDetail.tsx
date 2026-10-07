import { useEffect, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import Gabarit from "@/components/site/Gabarit";
import EnTetePage from "@/components/site/EnTetePage";
import Simulateur from "@/components/site/Simulateur";
import { TitreLignes } from "@/components/site/Mouvement";
import { FINANCEMENTS, formatFcfa } from "@/donnees/fidelem";
import { envoyerDemandeFinancement } from "@/config/apiPublic";
import {
  BlocCoordonnees, BlocRendezVous, BlocSituation, BoutonEnvoi, Champ, Confirmation, MessageErreurEnvoi,
  coordonneesVides, rendezVousVide, situationVide, useEnvoi, validerCoordonnees, validerRendezVous, validerSituation,
} from "@/components/site/Formulaires";

type Choix = { montant: number; duree: number; n: number };

function FormulaireDemande({ slug, choix }: { slug: string; choix: Choix | null }) {
  const f = FINANCEMENTS.find((x) => x.slug === slug)!;
  const [coord, setCoord] = useState(coordonneesVides());
  const [rdv, setRdv] = useState(rendezVousVide());
  const [montant, setMontant] = useState(choix ? String(choix.montant) : "");
  const [duree, setDuree] = useState(String(choix?.duree ?? f.simulateur.dureeDefaut));
  // Le simulateur pré-remplit le montant et la durée.
  useEffect(() => { if (choix) { setMontant(String(choix.montant)); setDuree(String(choix.duree)); } }, [choix]);
  const [objet, setObjet] = useState(f.projets[0]);
  const [situation, setSituation] = useState(situationVide());
  const { etat, erreurs, envoyer, messageErreur } = useEnvoi();

  const soumettre = (e: React.FormEvent) => {
    e.preventDefault();
    const v = { ...validerSituation(situation), ...validerCoordonnees(coord), ...validerRendezVous(rdv) };
    if (!Number(montant)) v.montant = "Indiquez le montant dont vous avez besoin.";
    // La situation part en champs dedies et, en attendant que l'API les
    // stocke, en tete du message que le conseiller lit deja.
    const message = `Revenus mensuels : ${situation.revenus} · Contrat : ${situation.contrat} · Activité actuelle : ${situation.activite.trim()}`;
    envoyer(v, () => envoyerDemandeFinancement({ ...coord, financement: f.slug, montant: Number(montant), duree: Number(duree), objet, message, ...situation, rendezVous: rdv }));
  };

  if (etat === "succes") return (
    <Confirmation titre="Votre demande est envoyée.">
      Un conseiller FIDELEM de {rdv.zone} va vous contacter {rdv.contactPrefere === "E-mail" ? "par e-mail" : rdv.contactPrefere === "WhatsApp" ? "sur WhatsApp" : "par téléphone"} pour confirmer votre rendez-vous {rdv.mode.toLowerCase()}. Préparez dès maintenant les pièces listées plus haut.
    </Confirmation>
  );

  return (
    <form className="f-form" onSubmit={soumettre} noValidate>
      <div className="f-grille-3">
        <Champ libelle="Projet à financer">
          <select id="f-objet" value={objet} onChange={(e) => setObjet(e.target.value)}>{f.projets.map((p) => <option key={p}>{p}</option>)}</select>
        </Champ>
        <Champ libelle="Montant (FCFA)" erreur={erreurs.montant}>
          <input id="f-montant" inputMode="numeric" placeholder={formatFcfa(f.simulateur.defaut).replace(" FCFA", "")} value={montant ? Number(montant).toLocaleString("fr-FR") : ""} onChange={(e) => setMontant(e.target.value.replace(/\D/g, ""))} aria-invalid={!!erreurs.montant} />
        </Champ>
        <Champ libelle="Durée de remboursement">
          <select id="f-duree" value={duree} onChange={(e) => setDuree(e.target.value)}>
            {[6, 12, 18, 24, 36, 48, 60, 72, 84, 120, 180, 240].filter((d) => d >= f.simulateur.dureeMin && d <= f.simulateur.dureeMax).map((d) => <option key={d} value={d}>{d < 24 ? `${d} mois` : `${d / 12} ans`}</option>)}
          </select>
        </Champ>
      </div>
      <BlocSituation valeur={situation} onChange={setSituation} erreurs={erreurs} />
      <BlocCoordonnees valeur={coord} onChange={setCoord} erreurs={erreurs} />
      <BlocRendezVous valeur={rdv} onChange={setRdv} erreurs={erreurs} />
      {etat === "erreur" && <MessageErreurEnvoi message={messageErreur} />}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
        <BoutonEnvoi etat={etat}>Envoyer ma demande</BoutonEnvoi>
      </div>
    </form>
  );
}

export default function ServiceDetail() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const [choix, setChoix] = useState<Choix | null>(() => {
    const m = Number(params.get("montant")), d = Number(params.get("duree"));
    return m && d ? { montant: m, duree: d, n: 0 } : null;
  });
  const f = FINANCEMENTS.find((x) => x.slug === slug);
  if (!f) return <Navigate to="/services" replace />;
  const autres = FINANCEMENTS.filter((x) => x.slug !== f.slug);

  return (
    <Gabarit>
      <EnTetePage
        label={`Services · ${f.court}`}
        lignes={[f.nom.split(" ")[0], <em key="e">{f.nom.split(" ").slice(1).join(" ")}</em>]}
        chapo={f.accroche}
        enfants={<div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 32 }} data-revele="400">
          <a className="f-btn f-btn--or f-btn--grand" href="#demande">Faire ma demande</a>
          <a className="f-btn f-btn--gris f-btn--grand" href="#simulateur">Simuler</a>
          <Link className="f-btn f-btn--gris f-btn--grand" to="/trouver-un-conseiller">Trouver un conseiller</Link>
        </div>}
      />


      <section className="f-section">
        <div className="f-conteneur f-detail">
          <div className="f-detail__bloc" data-revele>
            <span className="f-numero">01</span>
            <h2 className="f-titre-m">Ce que l'on finance</h2>
            <ul className="f-liste f-liste--grande">{f.projets.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>
          <div className="f-detail__bloc" data-revele>
            <span className="f-numero">02</span>
            <h2 className="f-titre-m">Les pièces à préparer</h2>
            <ul className="f-coches">{f.pieces.map((p) => <li key={p}><Check aria-hidden="true" />{p}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="f-section f-section--serree" id="simulateur">
        <div className="f-conteneur f-simu-section">
          <div className="f-simu-section__tete">
            <TitreLignes className="f-titre-l" lignes={["Simulez votre", "financement."]} />
            <p className="f-texte" data-revele>Ajustez le montant et la durée pour estimer vos mensualités.</p>
          </div>
          <Simulateur key={f.slug} slug={f.slug} onUtiliser={({ montant, duree }) => {
            setChoix((c) => ({ montant, duree, n: (c?.n ?? 0) + 1 }));
            document.getElementById("demande")?.scrollIntoView({ behavior: "smooth" });
          }} />
        </div>
      </section>

      <section className="f-section" id="demande">
        <div className="f-conteneur f-demande">
          <div className="f-demande__cote">
            <TitreLignes className="f-titre-l" lignes={["Faites votre", "demande."]} />
            <p className="f-texte" data-revele>Gratuit et sans engagement. Un conseiller de votre zone vous rappelle au créneau choisi.</p>
          </div>
          <div className="f-carte" data-revele><FormulaireDemande key={f.slug} slug={f.slug} choix={choix} /></div>
        </div>
      </section>

      <section className="f-section f-section--serree">
        <div className="f-conteneur f-faq-grille">
          <TitreLignes className="f-titre-l" lignes={["Questions", "fréquentes."]} />
          <div className="f-faq">
            {f.faq.map((q) => <details key={q.q}><summary>{q.q}<i aria-hidden="true">+</i></summary><p className="f-faq__reponse">{q.r}</p></details>)}
          </div>
        </div>
        <div className="f-conteneur f-autres">
          {autres.map((a) => (
            <Link key={a.slug} to={`/services/${a.slug}`} className="f-autre f-guide" data-revele>
              <span className="f-label f-label--doux">Autre financement</span>
              <span className="f-titre-m">{a.nom}</span>
              <ArrowUpRight aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </Gabarit>
  );
}
