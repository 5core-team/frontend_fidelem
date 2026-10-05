import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import Gabarit from "@/components/site/Gabarit";
import EnTetePage from "@/components/site/EnTetePage";
import { TitreLignes } from "@/components/site/Mouvement";
import { FINANCEMENTS, formatFcfa } from "@/donnees/fidelem";
import { envoyerDemandeFinancement } from "@/config/apiPublic";
import {
  BlocCoordonnees, BlocRendezVous, BoutonEnvoi, Champ, Confirmation, MessageErreurEnvoi,
  coordonneesVides, rendezVousVide, useEnvoi, validerCoordonnees, validerRendezVous,
} from "@/components/site/Formulaires";

function FormulaireDemande({ slug }: { slug: string }) {
  const f = FINANCEMENTS.find((x) => x.slug === slug)!;
  const [coord, setCoord] = useState(coordonneesVides());
  const [rdv, setRdv] = useState(rendezVousVide());
  const [montant, setMontant] = useState("");
  const [duree, setDuree] = useState(String(f.simulateur.dureeDefaut));
  const [objet, setObjet] = useState(f.projets[0]);
  const message = "";
  const { etat, erreurs, envoyer } = useEnvoi();

  const soumettre = (e: React.FormEvent) => {
    e.preventDefault();
    const v = { ...validerCoordonnees(coord), ...validerRendezVous(rdv) };
    if (!Number(montant)) v.montant = "Indiquez le montant dont vous avez besoin.";
    envoyer(v, () => envoyerDemandeFinancement({ ...coord, financement: f.slug, montant: Number(montant), duree: Number(duree), objet, message, rendezVous: rdv }));
  };

  if (etat === "succes") return (
    <Confirmation titre="Votre demande est envoyée.">
      Un conseiller FIDELEM de {rdv.zone} va vous contacter {rdv.contactPrefere === "E-mail" ? "par e-mail" : rdv.contactPrefere === "WhatsApp" ? "sur WhatsApp" : "par téléphone"} pour confirmer votre rendez-vous {rdv.mode.toLowerCase()}. Préparez dès maintenant les pièces listées plus haut.
    </Confirmation>
  );

  return (
    <form className="f-form" onSubmit={soumettre} noValidate>
      <div className="f-grille-3">
        <Champ libelle="Projet">
          <select id="f-objet" value={objet} onChange={(e) => setObjet(e.target.value)}>{f.projets.map((p) => <option key={p}>{p}</option>)}</select>
        </Champ>
        <Champ libelle="Montant (FCFA)" erreur={erreurs.montant}>
          <input id="f-montant" inputMode="numeric" placeholder={formatFcfa(f.simulateur.defaut).replace(" FCFA", "")} value={montant ? Number(montant).toLocaleString("fr-FR") : ""} onChange={(e) => setMontant(e.target.value.replace(/\D/g, ""))} aria-invalid={!!erreurs.montant} />
        </Champ>
        <Champ libelle="Durée">
          <select id="f-duree" value={duree} onChange={(e) => setDuree(e.target.value)}>
            {[6, 12, 24, 36, 48, 60, 84, 120, 180, 240].filter((d) => d >= f.simulateur.dureeMin && d <= f.simulateur.dureeMax).map((d) => <option key={d} value={d}>{d < 24 ? `${d} mois` : `${d / 12} ans`}</option>)}
          </select>
        </Champ>
      </div>
      <BlocCoordonnees valeur={coord} onChange={setCoord} erreurs={erreurs} />
      <BlocRendezVous valeur={rdv} onChange={setRdv} erreurs={erreurs} />
      {etat === "erreur" && <MessageErreurEnvoi />}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
        <BoutonEnvoi etat={etat}>Envoyer ma demande</BoutonEnvoi>
        <p className="f-note">Gratuit et sans engagement. Vos informations ne sont transmises qu'au conseiller de votre zone.</p>
      </div>
    </form>
  );
}

export default function ServiceDetail() {
  const { slug } = useParams();
  const f = FINANCEMENTS.find((x) => x.slug === slug);
  if (!f) return <Navigate to="/services" replace />;
  const autres = FINANCEMENTS.filter((x) => x.slug !== f.slug);

  return (
    <Gabarit>
      <EnTetePage
        label={`Services · ${f.court}`}
        lignes={[f.nom.split(" ")[0], <em key="e">{f.nom.split(" ").slice(1).join(" ")}</em>]}
        chapo={f.resume}
        enfants={<div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 32 }} data-revele="400">
          <a className="f-btn f-btn--or f-btn--grand" href="#demande">Faire ma demande</a>
          <Link className="f-btn f-btn--gris f-btn--grand" to="/trouver-un-conseiller">Trouver un conseiller</Link>
        </div>}
      />

      <div className="f-conteneur"><div className="f-service-visuel f-guide" data-revele><img className="f-photo" src={f.image} alt="" /></div></div>

      <section className="f-section">
        <div className="f-conteneur f-detail">
          <div className="f-detail__bloc" data-revele>
            <span className="f-numero">01</span>
            <h2 className="f-titre-m">Ce que l'on finance</h2>
            <ul className="f-liste f-liste--grande">{f.projets.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>
          <div className="f-detail__bloc" data-revele>
            <span className="f-numero">02</span>
            <h2 className="f-titre-m">Pour qui</h2>
            <ul className="f-liste f-liste--grande">{f.pourQui.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>
          <div className="f-detail__bloc" data-revele>
            <span className="f-numero">03</span>
            <h2 className="f-titre-m">Les pièces à préparer</h2>
            <ul className="f-coches">{f.pieces.map((p) => <li key={p}><Check aria-hidden="true" />{p}</li>)}</ul>
            <p className="f-note">La liste définitive dépend de votre dossier : votre conseiller la confirme au premier rendez-vous.</p>
          </div>
        </div>
      </section>

      <section className="f-section" id="demande">
        <div className="f-conteneur f-demande">
          <div className="f-demande__cote">
            <TitreLignes className="f-titre-l" lignes={["Faites votre", "demande."]} />
            <p className="f-texte" data-revele>Gratuit et sans engagement. Un conseiller de votre zone vous rappelle au créneau choisi.</p>
          </div>
          <div className="f-carte" data-revele><FormulaireDemande slug={f.slug} /></div>
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
