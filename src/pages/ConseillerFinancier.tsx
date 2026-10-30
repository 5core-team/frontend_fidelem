import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, BookOpen, Laptop, BadgeCheck, Check, MapPin, LogIn, GraduationCap } from "lucide-react";
import Gabarit, { Bandeau } from "@/components/Gabarit";
import { ENGAGEMENTS, FORMATIONS, FRAIS, PARCOURS_CONSEILLER, formatFcfa } from "@/donnees/fidelem";

const ICONES_ENGAGEMENT = [BookOpen, Award, Laptop, BadgeCheck];

const ConseillerFinancier = () => (
  <Gabarit fond="bg-white">
    <Bandeau
      titre="Conseiller Financier Autonome"
      texte="Aider à vivre mieux avec une vie financière plus saine. Fidelem forme des conseillers financiers opérationnels, capables d'accompagner tous les profils de clients, des petits entrepreneurs aux grandes fortunes."
    >
      <Link to="/conseiller-financier/candidature"><Button className="bg-fidelem-secondary text-fidelem hover:bg-fidelem-secondary/90 text-lg py-6 px-8">Devenir conseiller financier</Button></Link>
      <Link to="/trouver-un-conseiller"><Button className="bg-white text-fidelem hover:bg-white/90 text-lg py-6 px-8">Trouver un conseiller</Button></Link>
    </Bandeau>

    {/* Trois entrees */}
    <section className="py-16 bg-fidelem-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-6">
        {[
          { icone: GraduationCap, titre: "Devenir conseiller financier", texte: "Candidatez, passez le test de niveau et suivez la formation adaptée.", lien: "/conseiller-financier/candidature", action: "Je candidate" },
          { icone: MapPin, titre: "Trouver un conseiller dans ma zone", texte: "Indiquez votre commune : vous voyez les conseillers de votre zone.", lien: "/trouver-un-conseiller", action: "Chercher" },
          { icone: LogIn, titre: "Espace conseiller", texte: "Connectez-vous pour voir les demandes des clients de votre zone.", lien: "/espace-conseiller/connexion", action: "Se connecter" },
        ].map(({ icone: Icone, titre, texte, lien, action }) => (
          <div key={titre} className="bg-white rounded-xl p-6 shadow-md flex flex-col">
            <Icone className="h-10 w-10 text-fidelem mb-4" />
            <h3 className="text-xl font-semibold mb-2">{titre}</h3>
            <p className="text-gray-600 flex-1">{texte}</p>
            <Link to={lien} className="mt-4"><Button className="w-full bg-fidelem hover:bg-fidelem/90">{action}</Button></Link>
          </div>
        ))}
      </div>
    </section>

    {/* Notre approche */}
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-fidelem mb-4">Une formation unique au Bénin</h2>
          <p className="text-lg text-gray-600">En tant que cabinet de finance, Fidelem propose une offre de formation unique sur le marché béninois, conçue pour former des conseillers financiers opérationnels.</p>
        </div>
        <ul className="space-y-3">
          {[
            "L'approche duale : personnes physiques et personnes morales",
            "La spécialisation par niveau de revenu du client",
            "La pédagogie pratique, avec des études de cas réels béninois",
            "La conformité au SYSCOHADA révisé",
          ].map((x) => <li key={x} className="flex gap-3 bg-fidelem-light rounded-lg p-4"><Check className="h-5 w-5 text-fidelem shrink-0 mt-0.5" /><span>{x}</span></li>)}
        </ul>
      </div>
    </section>

    {/* Formations et formules */}
    <section className="py-20 bg-fidelem-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-fidelem mb-4">Formations et formules</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Trois niveaux, correspondant aux trois profils de clientèle que le conseiller accompagnera</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {FORMATIONS.map((f) => (
            <Card key={f.id} className={`flex flex-col ${f.niveau === 2 ? "border-fidelem-secondary border-2" : ""}`}>
              <CardHeader>
                <p className="text-sm font-semibold uppercase tracking-wide text-fidelem-secondary">Niveau {f.niveau}</p>
                <CardTitle className="text-2xl">CF {f.nom}</CardTitle>
                <p className="text-gray-600">{f.clientele}</p>
                <p className="text-3xl font-bold text-fidelem pt-2">{formatFcfa(f.prix)}</p>
                <p className="text-sm text-gray-500">{f.duree} · {f.rythme}</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="font-semibold mb-2">Compétences</p>
                <ul className="space-y-2 mb-4">
                  {f.competences.map((c) => <li key={c} className="flex gap-2 text-gray-700"><Check className="h-5 w-5 text-fidelem shrink-0" />{c}</li>)}
                </ul>
                <p className="font-semibold mb-2">Débouchés</p>
                <p className="text-gray-600 text-sm mb-1">Revenu de {formatFcfa(f.revenu)} en moyenne par mois</p>
                <ul className="text-sm text-gray-600 space-y-1 mb-6">
                  {f.debouches.map((d) => <li key={d}>• {d}</li>)}
                </ul>
                <Link to={`/conseiller-financier/candidature?niveau=${f.id}`} className="mt-auto">
                  <Button className="w-full bg-fidelem hover:bg-fidelem/90">Choisir CF {f.nom}</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Engagement du cabinet */}
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-fidelem mb-12 text-center">L'engagement du cabinet</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ENGAGEMENTS.map((e, i) => {
            const Icone = ICONES_ENGAGEMENT[i];
            return (
              <div key={e.titre} className="flex flex-col items-center text-center bg-fidelem-light rounded-xl p-6">
                <Icone className="h-12 w-12 text-fidelem mb-4" />
                <h3 className="text-lg font-semibold mb-2">{e.titre}</h3>
                <p className="text-gray-600">{e.texte}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>

    {/* Comment ca se passe */}
    <section className="py-20 bg-fidelem text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-12 text-center">Comment ça se passe ?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PARCOURS_CONSEILLER.map((p, i) => (
            <div key={p.titre} className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <span className="text-3xl font-bold text-fidelem-secondary">0{i + 1}</span>
              <h3 className="text-xl font-semibold mt-2 mb-2">{p.titre}</h3>
              <p className="opacity-90">{p.texte}</p>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <div className="bg-white text-gray-800 rounded-xl p-6 space-y-2">
            <p className="font-semibold text-fidelem">Frais de formation</p>
            <p>Selon la formule du niveau, qualifié après le test.</p>
            <p>Paiement possible en 3 fois, au début de chaque mois.</p>
            <p>Les frais de formation sont <strong>totalement remboursés</strong> à la signature du contrat, après la validation de la formation.</p>
          </div>
          <div className="bg-white text-gray-800 rounded-xl p-6 space-y-2">
            <p className="font-semibold text-fidelem">Inscription</p>
            <p>Frais d'inscription : <strong>{formatFcfa(FRAIS.inscription)}</strong>, non remboursables.</p>
            <p>Délai d'inscription : <strong>{FRAIS.dateLimite}</strong>.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="py-20 bg-fidelem-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-fidelem to-fidelem-dark rounded-2xl p-8 md:p-12 shadow-xl text-white md:flex items-center justify-between gap-8">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl font-bold mb-2">Prêt à devenir conseiller financier ?</h2>
            <p className="text-xl opacity-90">Une licence de travail, une zone de gestion et une équipe commerciale vous attendent.</p>
          </div>
          <Link to="/conseiller-financier/candidature"><Button className="bg-white text-fidelem hover:bg-white/90 text-lg py-6 px-8">Je candidate</Button></Link>
        </div>
      </div>
    </section>
  </Gabarit>
);

export default ConseillerFinancier;
