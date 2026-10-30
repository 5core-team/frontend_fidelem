import { useEffect, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { Check, ArrowRight, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Gabarit, { Bandeau } from "@/components/Gabarit";
import { SimulateurRapide } from "@/components/SimulateurRapide";
import { FINANCEMENTS, formatFcfa } from "@/donnees/fidelem";
import { envoyerDemandeFinancement } from "@/config/apiPublic";
import {
  BlocCoordonnees, BlocRendezVous, BlocSituation, BoutonEnvoi, Champ, Confirmation, MessageErreurEnvoi,
  champClasse, selectClasse, coordonneesVides, rendezVousVide, situationVide, useEnvoi,
  validerCoordonnees, validerRendezVous, validerSituation,
} from "@/components/Formulaires";

const DUREES = [6, 12, 18, 24, 36, 48, 60, 72, 84, 120, 180, 240];

function FormulaireDemande({ slug }: { slug: string }) {
  const f = FINANCEMENTS.find((x) => x.slug === slug)!;
  const [params] = useSearchParams();
  const [coord, setCoord] = useState(coordonneesVides());
  const [rdv, setRdv] = useState(rendezVousVide());
  const [montant, setMontant] = useState(params.get("montant") ?? "");
  const [duree, setDuree] = useState(params.get("duree") ?? String(f.simulateur.dureeDefaut));
  const [objet, setObjet] = useState(f.projets[0]);
  const [situation, setSituation] = useState(situationVide());
  const { etat, erreurs, envoyer, messageErreur } = useEnvoi();

  // Le simulateur de la page pre-remplit le montant et la duree.
  useEffect(() => {
    const m = params.get("montant"), d = params.get("duree");
    if (m) setMontant(m);
    if (d) setDuree(d);
  }, [params]);

  const soumettre = (e: React.FormEvent) => {
    e.preventDefault();
    const v = { ...validerSituation(situation), ...validerCoordonnees(coord), ...validerRendezVous(rdv) };
    if (!Number(montant)) v.montant = "Indiquez le montant dont vous avez besoin.";
    // La situation part en champs dédiés et, en tête du message, pour le conseiller.
    const message = `Revenus mensuels : ${situation.revenus} · Contrat : ${situation.contrat} · Activité actuelle : ${situation.activite.trim()}`;
    envoyer(v, () => envoyerDemandeFinancement({ ...coord, financement: f.slug, montant: Number(montant), duree: Number(duree), objet, message, ...situation, rendezVous: rdv }));
  };

  if (etat === "succes") return (
    <Confirmation titre="Votre demande est envoyée.">
      Un conseiller financier Fidelem de {rdv.zone} va vous contacter {rdv.contactPrefere === "E-mail" ? "par e-mail" : rdv.contactPrefere === "WhatsApp" ? "sur WhatsApp" : "par téléphone"} pour confirmer votre rendez-vous. Préparez dès maintenant les pièces listées plus haut.
    </Confirmation>
  );

  return (
    <form onSubmit={soumettre} noValidate className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Champ libelle="Projet à financer" id="f-objet">
          <select id="f-objet" className={selectClasse} value={objet} onChange={(e) => setObjet(e.target.value)}>
            {f.projets.map((p) => <option key={p}>{p}</option>)}
          </select>
        </Champ>
        <Champ libelle="Montant (FCFA)" id="f-montant" erreur={erreurs.montant}>
          <input id="f-montant" className={champClasse} inputMode="numeric" placeholder={formatFcfa(f.simulateur.defaut).replace(" FCFA", "")}
            value={montant ? Number(montant).toLocaleString("fr-FR") : ""} onChange={(e) => setMontant(e.target.value.replace(/\D/g, ""))} aria-invalid={!!erreurs.montant} />
        </Champ>
        <Champ libelle="Durée de remboursement" id="f-duree">
          <select id="f-duree" className={selectClasse} value={duree} onChange={(e) => setDuree(e.target.value)}>
            {DUREES.filter((d) => d >= f.simulateur.dureeMin && d <= f.simulateur.dureeMax || String(d) === duree)
              .map((d) => <option key={d} value={d}>{d < 24 ? `${d} mois` : `${d / 12} ans`}</option>)}
          </select>
        </Champ>
      </div>
      <BlocSituation valeur={situation} onChange={setSituation} erreurs={erreurs} />
      <BlocCoordonnees valeur={coord} onChange={setCoord} erreurs={erreurs} />
      <BlocRendezVous valeur={rdv} onChange={setRdv} erreurs={erreurs} />
      {etat === "erreur" && <MessageErreurEnvoi message={messageErreur} />}
      <BoutonEnvoi etat={etat}>Envoyer ma demande</BoutonEnvoi>
    </form>
  );
}

export default function ServiceDetail() {
  const { slug } = useParams();
  const f = FINANCEMENTS.find((x) => x.slug === slug);
  const [ouverte, setOuverte] = useState<number | null>(null);
  if (!f) return <Navigate to="/services" replace />;
  const autres = FINANCEMENTS.filter((x) => x.slug !== f.slug);

  return (
    <Gabarit fond="bg-white">
      <Bandeau titre={f.nom} texte={f.resume}>
        <a href="#demande"><Button className="bg-white text-fidelem hover:bg-white/90 text-lg py-6 px-8">Faire ma demande</Button></a>
        <Link to="/trouver-un-conseiller"><Button className="bg-fidelem-secondary text-fidelem hover:bg-fidelem-secondary/90 text-lg py-6 px-8">Trouver un conseiller</Button></Link>
      </Bandeau>

      {/* Ce que l'on finance, pour qui, les pièces */}
      <section className="py-16 bg-fidelem-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
          {[
            { titre: "Ce que l'on finance", liste: f.projets },
            { titre: "Pour qui ?", liste: f.pourQui },
            { titre: "Les pièces à préparer", liste: f.pieces },
          ].map((b) => (
            <Card key={b.titre}>
              <CardHeader><CardTitle className="text-xl text-fidelem">{b.titre}</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {b.liste.map((x) => <li key={x} className="flex gap-2 text-gray-700"><Check className="h-5 w-5 text-fidelem shrink-0 mt-0.5" />{x}</li>)}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Etapes */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-fidelem mb-10 text-center">Comment ça se passe</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {f.etapes.map((e, i) => (
              <div key={e.titre} className="bg-fidelem-light rounded-lg p-6">
                <span className="text-3xl font-bold text-fidelem-secondary opacity-80">0{i + 1}</span>
                <h3 className="text-xl font-semibold mt-2 mb-2">{e.titre}</h3>
                <p className="text-gray-600">{e.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simulation */}
      <section className="py-16 bg-gradient-to-r from-fidelem to-fidelem-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Simulez votre financement</h2>
            <p className="text-xl opacity-90">Ajustez le montant et la durée de remboursement pour estimer vos mensualités, puis envoyez votre demande.</p>
          </div>
          <SimulateurRapide key={f.slug} initial={f.slug} />
        </div>
      </section>

      {/* Demande */}
      <section id="demande" className="py-16 bg-fidelem-light scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-fidelem">Faire ma demande de {f.nom.toLowerCase()}</CardTitle>
              <p className="text-gray-600">Gratuit et sans engagement. Un conseiller financier de votre zone vous rappelle au créneau choisi.</p>
            </CardHeader>
            <CardContent><FormulaireDemande key={f.slug} slug={f.slug} /></CardContent>
          </Card>
        </div>
      </section>

      {/* Questions et autres financements */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <h2 className="text-3xl font-bold text-fidelem mb-6 text-center">Questions fréquentes</h2>
          {f.faq.map((q, i) => (
            <Card key={q.q} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setOuverte(ouverte === i ? null : i)}>
              <CardHeader className="py-4">
                <CardTitle className="flex justify-between items-center text-lg gap-4">
                  {q.q}
                  <ChevronDown className={`h-5 w-5 text-fidelem shrink-0 transition-transform ${ouverte === i ? "rotate-180" : ""}`} />
                </CardTitle>
              </CardHeader>
              {ouverte === i && <CardContent className="pt-0 pb-4"><p className="text-gray-600">{q.r}</p></CardContent>}
            </Card>
          ))}
          <div className="grid sm:grid-cols-2 gap-4 pt-8">
            {autres.map((a) => (
              <Link key={a.slug} to={`/services/${a.slug}`} className="group rounded-xl bg-fidelem-light p-6 hover:shadow-md transition-shadow">
                <p className="text-sm text-gray-500">Autre financement</p>
                <p className="text-xl font-semibold text-fidelem flex items-center gap-2">{a.nom} <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Gabarit>
  );
}
