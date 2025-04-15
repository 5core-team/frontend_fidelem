
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import Navbar from "../components/Navbar";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Comment fonctionne le processus de demande de crédit ?",
      answer: "Le processus se déroule en plusieurs étapes : inscription sur la plateforme, simulation de crédit, soumission de votre dossier, étude par un conseiller, et validation finale. Chaque étape est accompagnée par nos experts."
    },
    {
      question: "Quels sont les taux d'intérêt proposés ?",
      answer: "Nous proposons actuellement deux taux fixes : 5% et 7%, selon votre profil et le type de crédit demandé. Ces taux sont parmi les plus compétitifs du marché."
    },
    {
      question: "Quels documents sont nécessaires pour une demande de crédit ?",
      answer: "Les documents requis incluent généralement : pièce d'identité, justificatifs de revenus des 3 derniers mois, derniers avis d'imposition, et justificatif de domicile récent."
    },
    {
      question: "Combien de temps prend le processus d'approbation ?",
      answer: "Le délai moyen de traitement est de 48 à 72 heures après réception de votre dossier complet. Certaines demandes peuvent être traitées plus rapidement."
    },
    {
      question: "Est-il possible de rembourser mon crédit par anticipation ?",
      answer: "Oui, le remboursement anticipé est possible à tout moment. Nous n'appliquons aucune pénalité de remboursement anticipé sur nos crédits."
    }
  ];

  return (
    <div className="min-h-screen bg-fidelem-light">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-fidelem mb-12">Questions Fréquentes</h1>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <CardHeader className="py-4">
                <CardTitle className="flex justify-between items-center text-lg">
                  {faq.question}
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-fidelem" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-fidelem" />
                  )}
                </CardTitle>
              </CardHeader>
              {openIndex === index && (
                <CardContent className="pt-0 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
