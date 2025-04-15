
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Building, Award, Clock } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-fidelem-light py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-fidelem mb-4">À propos de Fidelem</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Votre partenaire de confiance pour des solutions de crédit sur mesure
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-6 w-6 text-fidelem" />
                Notre Histoire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Depuis notre création, Fidelem s'engage à simplifier l'accès au crédit
                tout en maintenant les plus hauts standards de qualité et de sécurité.
                Notre plateforme innovante connecte les emprunteurs aux meilleurs
                conseillers financiers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-fidelem" />
                Notre Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Faciliter l'accès au crédit en offrant un service personnalisé et
                transparent. Nous nous efforçons de créer des solutions adaptées à
                chaque situation, guidées par l'expertise de nos conseillers.
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
              <p className="text-gray-600">Un accompagnement personnalisé pour chaque client</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Clock className="h-12 w-12 text-fidelem mb-4" />
              <h3 className="text-xl font-semibold mb-2">Réactivité</h3>
              <p className="text-gray-600">Des réponses rapides à vos demandes de crédit</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Award className="h-12 w-12 text-fidelem mb-4" />
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-gray-600">Un service de qualité garanti par nos experts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
