import { ArrowRight, Briefcase, User, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Gabarit, { EnTetePage } from "@/components/Gabarit";
import { activerDemo, COMPTES_DEMO } from "@/config/demoDonnees";

const ESPACES = [
  { role: "advisor" as const, titre: "Espace conseiller", texte: "Demandes de la zone de Cotonou, fiche d'une demande, rendez-vous, clients.", chemin: "/espace-conseiller", icone: Briefcase },
  { role: "user" as const, titre: "Espace client", texte: "Suivi des demandes de financement et du conseiller attribué.", chemin: "/mon-espace", icone: User },
  { role: "manager" as const, titre: "Back-office", texte: "Candidatures, conseillers, zones, demandes et intérêts EasyLife.", chemin: "/responsable", icone: ShieldCheck },
];

/** Entrée du mode démonstration : des données d'exemple remplacent le serveur. */
export default function Demo() {
  const entrer = (role: keyof typeof COMPTES_DEMO, chemin: string) => { activerDemo(role); window.location.href = chemin; };
  return (
    <Gabarit>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <EnTetePage titre="Visiter les espaces" sousTitre="Des données d'exemple, sans serveur. Les actions sont simulées et ne sont pas enregistrées." />
        <div className="grid md:grid-cols-3 gap-8">
          {ESPACES.map(({ role, titre, texte, chemin, icone: Icone }) => (
            <Card key={role} className="flex flex-col">
              <CardHeader>
                <Icone className="h-10 w-10 text-fidelem mb-2" />
                <CardTitle>{titre}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 gap-4">
                <p className="text-gray-600 flex-1">{texte}</p>
                <p className="text-sm text-gray-500">Connecté en tant que {COMPTES_DEMO[role].name} {COMPTES_DEMO[role].last_name}</p>
                <Button className="bg-fidelem hover:bg-fidelem/90" onClick={() => entrer(role, chemin)}>Entrer <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Gabarit>
  );
}
