
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, Car, CreditCard, Building2, ShieldCheck } from "lucide-react";
import Navbar from "../components/Navbar";

const Services = () => {
  const services = [
    {
      title: "Crédit Immobilier",
      description: "Financez l'achat de votre bien immobilier avec nos solutions adaptées",
      icon: <Home className="h-8 w-8 text-fidelem" />,
      features: ["Taux compétitifs", "Durée flexible", "Accompagnement personnalisé"]
    },
    {
      title: "Crédit Auto",
      description: "Obtenez le financement idéal pour votre véhicule",
      icon: <Car className="h-8 w-8 text-fidelem" />,
      features: ["Réponse rapide", "Mensualités adaptées", "Assurance avantageuse"]
    },
    {
      title: "Crédit Consommation",
      description: "Réalisez vos projets personnels avec nos solutions de financement",
      icon: <CreditCard className="h-8 w-8 text-fidelem" />,
      features: ["Montant jusqu'à 75 000 F", "Taux fixe", "Sans frais cachés"]
    },
    {
      title: "Crédit Professionnel",
      description: "Des solutions sur mesure pour les entrepreneurs et professionnels",
      icon: <Building2 className="h-8 w-8 text-fidelem" />,
      features: ["Expertise dédiée", "Financement adapté", "Conseil personnalisé"]
    }
  ];

  return (
    <div className="min-h-screen bg-fidelem-light">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-fidelem mb-4">Nos Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez nos solutions de financement adaptées à tous vos projets
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-fidelem/5 rounded-full" />
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  {service.icon}
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                </div>
                <p className="text-gray-600">{service.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-fidelem" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/contact">
                  <Button className="w-full bg-fidelem hover:bg-fidelem/90">
                    En savoir plus
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
