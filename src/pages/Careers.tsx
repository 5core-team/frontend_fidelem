
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, GraduationCap, Building } from "lucide-react";

const Careers = () => {
  const jobs = [
    {
      title: "Conseiller Financier Senior",
      department: "Service Crédit",
      location: "Paris",
      type: "CDI"
    },
    {
      title: "Analyste Crédit",
      department: "Analyse de Risques",
      location: "Lyon",
      type: "CDI"
    },
    {
      title: "Chargé de Relation Client",
      department: "Service Client",
      location: "Bordeaux",
      type: "CDI"
    }
  ];

  return (
    <div className="min-h-screen bg-fidelem-light py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-fidelem mb-4">Carrières chez Fidelem</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Rejoignez une équipe passionnée et innovante dans le secteur du crédit
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <Card>
            <CardContent className="flex flex-col items-center text-center p-6">
              <Users className="h-12 w-12 text-fidelem mb-4" />
              <CardTitle className="text-lg mb-2">Culture d'entreprise</CardTitle>
              <p className="text-gray-600">Un environnement collaboratif et dynamique</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center text-center p-6">
              <GraduationCap className="h-12 w-12 text-fidelem mb-4" />
              <CardTitle className="text-lg mb-2">Formation continue</CardTitle>
              <p className="text-gray-600">Des opportunités de développement professionnel</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center text-center p-6">
              <Building className="h-12 w-12 text-fidelem mb-4" />
              <CardTitle className="text-lg mb-2">Avantages</CardTitle>
              <p className="text-gray-600">Un package attractif et compétitif</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center text-center p-6">
              <Briefcase className="h-12 w-12 text-fidelem mb-4" />
              <CardTitle className="text-lg mb-2">Évolution</CardTitle>
              <p className="text-gray-600">Des perspectives d'évolution motivantes</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-fidelem mb-6">Postes à pourvoir</h2>
          <div className="grid gap-6">
            {jobs.map((job, index) => (
              <Card key={index}>
                <CardContent className="flex flex-col md:flex-row justify-between items-center p-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                    <div className="text-gray-600">
                      <p>{job.department} · {job.location} · {job.type}</p>
                    </div>
                  </div>
                  <Button className="mt-4 md:mt-0 bg-fidelem hover:bg-fidelem/90">
                    Postuler
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers;
