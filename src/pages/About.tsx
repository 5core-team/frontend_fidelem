import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Building, Award, Clock, Users, Sparkles } from "lucide-react";
import Gabarit, { EnTetePage } from "@/components/Gabarit";
import { EASYLIFE } from "@/donnees/fidelem";

const About = () => (
  <Gabarit>
    <div className="max-w-7xl mx-auto px-4 py-12">
      <EnTetePage titre="À propos de Fidelem" sousTitre="Votre partenaire de confiance pour des solutions de financement sur mesure" />

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building className="h-6 w-6 text-fidelem" />Notre Histoire</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Depuis notre création, Fidelem s'engage à simplifier l'accès au financement
              tout en maintenant les plus hauts standards de qualité et de sécurité.
              Notre plateforme innovante connecte les usagers aux meilleurs
              conseillers financiers de leur zone.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Award className="h-6 w-6 text-fidelem" />Notre Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Faciliter l'accès au financement en offrant un service personnalisé et
              transparent. Nous nous efforçons de créer des solutions adaptées à
              chaque situation, guidées par l'expertise de nos conseillers, pour aider
              chacun à vivre mieux avec une vie financière plus saine.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-fidelem mb-6">Nos Valeurs</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <User className="h-12 w-12 text-fidelem mb-4" />
            <h3 className="text-xl font-semibold mb-2">Proximité</h3>
            <p className="text-gray-600">Un accompagnement personnalisé pour chaque client de chaque zone</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Clock className="h-12 w-12 text-fidelem mb-4" />
            <h3 className="text-xl font-semibold mb-2">Réactivité</h3>
            <p className="text-gray-600">Des réponses rapides aux demandes de financement de chaque client de chaque zone</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Award className="h-12 w-12 text-fidelem mb-4" />
            <h3 className="text-xl font-semibold mb-2">Excellence</h3>
            <p className="text-gray-600">Un service de qualité garanti par nos experts, pour chaque client de chaque zone</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-6 w-6 text-fidelem" />Des conseillers dans chaque zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">Trois niveaux de formation, une licence et une zone de gestion pour chaque conseiller financier Fidelem.</p>
            <Link to="/conseiller-financier"><Button className="bg-fidelem hover:bg-fidelem/90">Le métier de conseiller</Button></Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="h-6 w-6 text-fidelem" />EasyLife</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">{EASYLIFE.presentation} Le financement des biens et de la consommation.</p>
            <Link to="/easylife"><Button className="bg-fidelem hover:bg-fidelem/90">Découvrir EasyLife</Button></Link>
          </CardContent>
        </Card>
      </div>
    </div>
  </Gabarit>
);

export default About;
