import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Gabarit, { EnTetePage } from "@/components/Gabarit";
import { CONTACT } from "@/donnees/fidelem";

const LEGAL: Record<string, { titre: string; sections: { t: string; p: string }[] }> = {
  "mentions-legales": {
    titre: "Mentions légales",
    sections: [
      { t: "Éditeur du site", p: `FIDELEM, ${CONTACT.adresse}, ${CONTACT.pays}. Téléphone : ${CONTACT.telephone}. Site : ${CONTACT.site}. Forme juridique, capital, numéro RCCM et IFU : à compléter.` },
      { t: "Directeur de la publication", p: "À compléter." },
      { t: "Hébergement", p: "Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis." },
      { t: "Propriété intellectuelle", p: "Les contenus de ce site (textes, visuels, logo) sont la propriété de FIDELEM ou de leurs auteurs. Toute reproduction sans autorisation est interdite." },
    ],
  },
  confidentialite: {
    titre: "Confidentialité",
    sections: [
      { t: "Données collectées", p: "Lorsque vous remplissez un formulaire, nous collectons vos coordonnées, votre zone, vos disponibilités et les informations sur votre projet." },
      { t: "Utilisation", p: "Ces données servent uniquement à traiter votre demande et à organiser votre rendez-vous. Elles sont transmises au conseiller FIDELEM de votre zone et, avec votre accord, aux partenaires financiers concernés par votre dossier." },
      { t: "Conservation et droits", p: `Vous pouvez demander l'accès, la rectification ou la suppression de vos données en écrivant à ${CONTACT.email}. Durée de conservation et références légales : à compléter.` },
    ],
  },
  conditions: {
    titre: "Conditions d'utilisation",
    sections: [
      { t: "Objet", p: "Ces conditions encadrent l'utilisation du site FIDELEM, des espaces client et conseiller et des formulaires de demande." },
      { t: "Simulations", p: "Les simulations de financement sont indicatives. Elles ne constituent ni une offre ni un engagement de financement." },
      { t: "Formation de conseiller", p: "Les frais d'inscription ne sont pas remboursables. Les frais de formation sont payables en 3 fois et remboursés à la signature du contrat après validation de la formation." },
      { t: "Compte", p: "Vous êtes responsable de la confidentialité de vos identifiants. Le texte complet est à compléter par FIDELEM." },
    ],
  },
};

export function Legal({ page }: { page: keyof typeof LEGAL }) {
  const d = LEGAL[page];
  return (
    <Gabarit>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <EnTetePage titre={d.titre} />
        <div className="space-y-6">
          {d.sections.map((s) => (
            <Card key={s.t}>
              <CardHeader><CardTitle className="text-xl">{s.t}</CardTitle></CardHeader>
              <CardContent><p className="text-gray-600">{s.p}</p></CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Gabarit>
  );
}

export function PageIntrouvable() {
  return (
    <Gabarit>
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-6xl font-bold text-fidelem mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Cette page n'existe pas. Le lien est peut-être ancien.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/"><Button className="bg-fidelem hover:bg-fidelem/90">Accueil</Button></Link>
          <Link to="/services"><Button variant="outline">Services</Button></Link>
          <Link to="/contact"><Button variant="outline">Contact</Button></Link>
        </div>
      </div>
    </Gabarit>
  );
}
