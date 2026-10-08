import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, Car, Briefcase, ShoppingBag, ShieldCheck } from "lucide-react";
import Gabarit, { EnTetePage } from "@/components/Gabarit";
import { FINANCEMENTS, EASYLIFE } from "@/donnees/fidelem";

const ICONES = { immobilier: Home, transport: Car, affaires: Briefcase };

const Services = () => (
  <Gabarit>
    <div className="max-w-7xl mx-auto px-4 py-12">
      <EnTetePage titre="Nos Services" sousTitre="Découvrez nos solutions de financement adaptées à tous vos projets" />

      <div className="grid md:grid-cols-2 gap-8">
        {FINANCEMENTS.map((f) => {
          const Icone = ICONES[f.slug];
          return (
            <Card key={f.slug} className="relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-fidelem/5 rounded-full" />
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <Icone className="h-8 w-8 text-fidelem" />
                  <CardTitle className="text-2xl">{f.nom}</CardTitle>
                </div>
                <p className="text-gray-600">{f.resume}</p>
              </CardHeader>
              <CardContent className="mt-auto">
                <ul className="space-y-2 mb-6">
                  {f.projets.slice(0, 3).map((p) => (
                    <li key={p} className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-fidelem shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <Link to={`/services/${f.slug}`}>
                  <Button className="w-full bg-fidelem hover:bg-fidelem/90">En savoir plus</Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}

        <Card className="relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-fidelem-secondary/10 rounded-full" />
          <CardHeader>
            <div className="flex items-center gap-4 mb-4">
              <ShoppingBag className="h-8 w-8 text-fidelem" />
              <CardTitle className="text-2xl">Financement des biens et de la consommation</CardTitle>
            </div>
            <p className="text-gray-600">Avec EasyLife, financez l'obtention de vos biens et vos dépenses du quotidien.</p>
          </CardHeader>
          <CardContent className="mt-auto">
            <ul className="space-y-2 mb-6">
              {EASYLIFE.volets.map((v) => (
                <li key={v.nom} className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-fidelem shrink-0" />
                  <span>{v.nom}</span>
                </li>
              ))}
            </ul>
            <Link to="/easylife">
              <Button className="w-full bg-fidelem hover:bg-fidelem/90">En savoir plus</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  </Gabarit>
);

export default Services;
