import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Gabarit, { EnTetePage } from "@/components/Gabarit";
import { FAQ as QUESTIONS } from "@/donnees/fidelem";

const FAQ = () => {
  const [ouverte, setOuverte] = useState<string | null>(null);

  return (
    <Gabarit>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <EnTetePage titre="Questions Fréquentes" />
        <div className="space-y-10">
          {QUESTIONS.map((g) => (
            <div key={g.theme}>
              <h2 className="text-xl font-semibold text-fidelem mb-4">{g.theme}</h2>
              <div className="space-y-4">
                {g.questions.map((faq) => {
                  const ouvert = ouverte === faq.q;
                  return (
                    <Card key={faq.q} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setOuverte(ouvert ? null : faq.q)}>
                      <CardHeader className="py-4">
                        <CardTitle className="flex justify-between items-center gap-4 text-lg">
                          <button type="button" className="text-left" aria-expanded={ouvert}>{faq.q}</button>
                          {ouvert ? <ChevronUp className="h-5 w-5 text-fidelem shrink-0" /> : <ChevronDown className="h-5 w-5 text-fidelem shrink-0" />}
                        </CardTitle>
                      </CardHeader>
                      {ouvert && (
                        <CardContent className="pt-0 pb-4">
                          <p className="text-gray-600">{faq.r}</p>
                          {faq.q === "Comment devenir Conseiller Financier ?" && (
                            <Link to="/conseiller-financier" className="inline-block mt-3 text-fidelem font-medium underline" onClick={(e) => e.stopPropagation()}>
                              Voir les formations et candidater
                            </Link>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Gabarit>
  );
};

export default FAQ;
