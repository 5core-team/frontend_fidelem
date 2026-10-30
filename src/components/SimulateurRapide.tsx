import { useState } from "react";
import { Link } from "react-router-dom";
import { Wallet } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { FINANCEMENTS, TAUX, formatFcfa, type Financement } from "@/donnees/fidelem";

const mensualite = (capital: number, tauxAnnuel: number, mois: number) => {
  const t = tauxAnnuel / 100 / 12;
  return t === 0 ? capital / mois : (capital * t) / (1 - Math.pow(1 + t, -mois));
};

const dureeTexte = (mois: number) => (mois < 24 ? `${mois} mois` : `${mois} mois (${+(mois / 12).toFixed(1)} ans)`);

/** Simulation indicative d'un financement (immobilier, transport, affaires). */
export function SimulateurRapide({ initial = "immobilier" }: { initial?: Financement["slug"] }) {
  const [slug, setSlug] = useState<Financement["slug"]>(initial);
  const f = FINANCEMENTS.find((x) => x.slug === slug)!;
  const [montant, setMontant] = useState(f.simulateur.defaut);
  const [duree, setDuree] = useState(f.simulateur.dureeDefaut);
  const [taux, setTaux] = useState(TAUX[0].valeur);

  const choisir = (s: Financement["slug"]) => {
    const n = FINANCEMENTS.find((x) => x.slug === s)!;
    setSlug(s); setMontant(n.simulateur.defaut); setDuree(n.simulateur.dureeDefaut);
  };

  return (
    <div className="relative">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
        <div className="bg-white/90 backdrop-blur-lg rounded-xl p-6 text-gray-900">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-semibold text-fidelem text-lg">Simulation de financement</h3>
            <div className="bg-fidelem text-white p-1 rounded-full"><Wallet size={20} /></div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Type de financement">
              {FINANCEMENTS.map((x) => (
                <button key={x.slug} type="button" role="radio" aria-checked={slug === x.slug} onClick={() => choisir(x.slug)}
                  className={`px-2 py-1.5 rounded-md text-sm transition-colors ${slug === x.slug ? "bg-fidelem text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {x.court}
                </button>
              ))}
            </div>
            <div>
              <p className="text-sm text-gray-500">Montant à financer</p>
              <p className="text-lg font-semibold">{formatFcfa(montant)}</p>
              <Slider key={`m-${slug}`} value={[montant]} min={f.simulateur.min} max={f.simulateur.max} step={f.simulateur.pas}
                onValueChange={(v) => setMontant(v[0])} className="mt-2" aria-label="Montant à financer" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Durée de remboursement</p>
              <p className="text-lg font-semibold">{dureeTexte(duree)}</p>
              <Slider key={`d-${slug}`} value={[duree]} min={f.simulateur.dureeMin} max={f.simulateur.dureeMax} step={6}
                onValueChange={(v) => setDuree(v[0])} className="mt-2" aria-label="Durée de remboursement" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Taux indicatif</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {TAUX.map((t) => (
                  <button key={t.valeur} type="button" onClick={() => setTaux(t.valeur)}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${taux === t.valeur ? "bg-fidelem text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                    {t.libelle} - {t.valeur}%
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm text-gray-500">Mensualité estimée</p>
              <p className="text-2xl font-bold text-fidelem">{formatFcfa(mensualite(montant, taux, duree))}</p>
              <p className="text-xs text-gray-500 mt-1">Simulation indicative, sans engagement.</p>
            </div>
            <Link to={`/services/${slug}?montant=${montant}&duree=${duree}#demande`}
              className="block text-center rounded-md bg-fidelem-secondary text-fidelem font-semibold py-2.5 hover:brightness-95 transition">
              Faire ma demande de financement
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute -top-4 -right-4 bg-fidelem-secondary text-fidelem p-2 rounded-lg shadow-lg transform rotate-12">
        <div className="text-sm font-medium">Réponse rapide</div>
      </div>
    </div>
  );
}
