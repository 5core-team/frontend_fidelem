import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Home, Zap, Bus, HeartPulse, Smartphone, ShoppingBasket, PiggyBank, LifeBuoy,
  Package, Wallet, Check, Sparkles, Target, Eye,
} from "lucide-react";
import Gabarit, { Bandeau } from "@/components/Gabarit";
import { EASYLIFE } from "@/donnees/fidelem";

const ICONES_LIVING = [Home, Zap, Bus, HeartPulse, Smartphone, ShoppingBasket, PiggyBank, LifeBuoy];
const ICONES_VOLETS = [Package, Wallet];

const EasyLife = () => (
  <Gabarit fond="bg-white">
    <Bandeau
      titre="EasyLife : financer vos biens et votre quotidien"
      texte="EasyLife est le moyen de financement de Fidelem pour obtenir des biens et pour financer la consommation de tous les jours."
    >
      <a href="#financer"><Button className="bg-white text-fidelem hover:bg-white/90 text-lg py-6 px-8">Voir les financements</Button></a>
      <Link to="/contact"><Button className="bg-fidelem-secondary text-fidelem hover:bg-fidelem-secondary/90 text-lg py-6 px-8">Je suis intéressé(e)</Button></Link>
    </Bandeau>

    {/* Les deux volets */}
    <section id="financer" className="py-20 bg-fidelem-light scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-fidelem mb-4">Les deux volets d'EasyLife</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Obtenir un bien sans tout payer d'un coup, et maîtriser ses dépenses essentielles</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {EASYLIFE.volets.map((v, i) => {
            const Icone = ICONES_VOLETS[i];
            return (
              <Card key={v.nom} className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-fidelem-secondary/10 rounded-full" />
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 rounded-full bg-fidelem text-white"><Icone className="h-6 w-6" /></div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-fidelem-secondary">Volet {i + 1}</p>
                      <CardTitle className="text-2xl">Financement : {v.nom.toLowerCase()}</CardTitle>
                    </div>
                  </div>
                  <p className="text-lg font-medium text-gray-800">{v.titre}</p>
                  <p className="text-gray-600">{v.texte}</p>
                </CardHeader>
                <CardContent>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {v.points.map((p) => <li key={p} className="flex gap-2 text-gray-700"><Check className="h-5 w-5 text-fidelem shrink-0" />{p}</li>)}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>

    {/* EasyLife Living */}
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-wide text-fidelem-secondary">Offre phare, disponible en premier</p>
          <h2 className="text-3xl font-bold text-fidelem mt-2 mb-4">{EASYLIFE.living.nom} : {EASYLIFE.living.accroche.toLowerCase()}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{EASYLIFE.living.texte}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {EASYLIFE.living.offre.map((o, i) => {
            const Icone = ICONES_LIVING[i] ?? Sparkles;
            return (
              <div key={o.titre} className="bg-fidelem-light rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                <Icone className="h-10 w-10 text-fidelem mx-auto mb-3" />
                <p className="font-semibold">{o.titre}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>

    {/* Les poles */}
    <section className="py-20 bg-fidelem text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-4">L'écosystème EasyLife</h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">Quatre pôles pour compléter EasyLife Living</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {EASYLIFE.poles.map((p) => (
            <div key={p.nom} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg">
              <p className="text-sm font-semibold uppercase tracking-wide text-fidelem-secondary">EasyLife {p.nom}</p>
              <h3 className="text-xl font-semibold mt-1 mb-2">{p.titre}</h3>
              <p className="opacity-90 mb-4">{p.texte}</p>
              <ul className="space-y-1 text-sm opacity-90">
                {p.offres.map((o) => <li key={o}>• {o}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Vision, mission */}
    <section className="py-20 bg-fidelem-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Eye className="h-6 w-6 text-fidelem" />Notre vision</CardTitle></CardHeader>
          <CardContent><p className="text-gray-600">{EASYLIFE.vision}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-6 w-6 text-fidelem" />Notre mission</CardTitle></CardHeader>
          <CardContent><p className="text-gray-600">{EASYLIFE.mission}</p></CardContent>
        </Card>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-gradient-to-r from-fidelem to-fidelem-dark rounded-2xl p-8 md:p-12 shadow-xl text-white md:flex items-center justify-between gap-8">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl font-bold mb-2">Rejoindre EasyLife</h2>
            <p className="text-xl opacity-90">« {EASYLIFE.slogan} »</p>
          </div>
          <Link to="/contact"><Button className="bg-white text-fidelem hover:bg-white/90 text-lg py-6 px-8">Parler à un conseiller</Button></Link>
        </div>
      </div>
    </section>
  </Gabarit>
);

export default EasyLife;
