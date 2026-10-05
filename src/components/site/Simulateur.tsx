import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { FINANCEMENTS, formatFcfa } from "@/donnees/fidelem";

type Slug = (typeof FINANCEMENTS)[number]["slug"];

const TAUX = [
  { valeur: 5, libelle: "Taux standard", court: "5 %" },
  { valeur: 7, libelle: "Taux majoré", court: "7 %" },
];
const DUREES = [6, 12, 18, 24, 36, 48, 60, 72, 84, 120, 180, 240];
const libelleDuree = (d: number) => (d < 24 || d % 12 ? `${d} mois` : `${d / 12} ans`);

/** Mensualité d'un prêt amortissable à taux fixe. */
export function mensualite(montant: number, tauxAnnuel: number, mois: number) {
  const t = tauxAnnuel / 100 / 12;
  return t ? (montant * t) / (1 - Math.pow(1 + t, -mois)) : montant / mois;
}

/**
 * Simulateur de financement. Sans `slug`, l'usager choisit le type de financement.
 * `onUtiliser` reçoit le montant et la durée pour pré-remplir la demande.
 */
export default function Simulateur({ slug, onUtiliser }: { slug?: Slug; onUtiliser: (choix: { slug: Slug; montant: number; duree: number }) => void }) {
  const [type, setType] = useState<Slug>(slug ?? FINANCEMENTS[0].slug);
  const f = FINANCEMENTS.find((x) => x.slug === type)!;
  const s = f.simulateur;
  const durees = DUREES.filter((d) => d >= s.dureeMin && d <= s.dureeMax);
  const [montant, setMontant] = useState(s.defaut);
  const [iDuree, setIDuree] = useState(Math.max(0, durees.indexOf(s.dureeDefaut)));
  const [taux, setTaux] = useState(TAUX[0].valeur);

  const changerType = (nouveau: Slug) => {
    const g = FINANCEMENTS.find((x) => x.slug === nouveau)!.simulateur;
    const ds = DUREES.filter((d) => d >= g.dureeMin && d <= g.dureeMax);
    setType(nouveau); setMontant(g.defaut); setIDuree(Math.max(0, ds.indexOf(g.dureeDefaut)));
  };

  const duree = durees[Math.min(iDuree, durees.length - 1)];
  const parMois = mensualite(montant, taux, duree);
  const total = parMois * duree;
  const remplissage = (v: number, min: number, max: number) => ({ "--f-rempli": `${((v - min) / (max - min)) * 100}%` }) as React.CSSProperties;

  return (
    <div className="f-simu">
      <div className="f-simu__reglages">
        {!slug && (
          <div className="f-simu__types" role="radiogroup" aria-label="Type de financement">
            {FINANCEMENTS.map((x) => (
              <button key={x.slug} type="button" role="radio" aria-checked={x.slug === type} onClick={() => changerType(x.slug)}>{x.court}</button>
            ))}
          </div>
        )}

        <label className="f-simu__curseur">
          <span className="f-simu__ligne"><span className="f-label f-label--doux">Montant du financement</span><strong>{formatFcfa(montant)}</strong></span>
          <input type="range" min={s.min} max={s.max} step={s.pas} value={montant} onChange={(e) => setMontant(Number(e.target.value))} style={remplissage(montant, s.min, s.max)} />
          <span className="f-simu__bornes"><span>{formatFcfa(s.min)}</span><span>{formatFcfa(s.max)}</span></span>
        </label>

        <label className="f-simu__curseur">
          <span className="f-simu__ligne"><span className="f-label f-label--doux">Durée du financement</span><strong>{libelleDuree(duree)}</strong></span>
          <input type="range" min={0} max={durees.length - 1} step={1} value={iDuree} onChange={(e) => setIDuree(Number(e.target.value))} style={remplissage(iDuree, 0, durees.length - 1)} aria-valuetext={libelleDuree(duree)} />
          <span className="f-simu__bornes"><span>{libelleDuree(durees[0])}</span><span>{libelleDuree(durees[durees.length - 1])}</span></span>
        </label>

        <fieldset className="f-simu__taux">
          <legend className="f-label f-label--doux">Taux d'intérêt</legend>
          <div>
            {TAUX.map((t) => (
              <button key={t.valeur} type="button" aria-pressed={taux === t.valeur} onClick={() => setTaux(t.valeur)}>
                <strong>{t.court}</strong><span>{t.libelle}</span>
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="f-simu__resultat" aria-live="polite">
        <span className="f-label">Mensualité estimée</span>
        <strong className="f-simu__montant">{formatFcfa(Math.round(parMois))}</strong>
        <span className="f-simu__par">par mois pendant {libelleDuree(duree)}</span>
        <dl>
          <div><dt>Montant financé</dt><dd>{formatFcfa(montant)}</dd></div>
          <div><dt>Coût des intérêts</dt><dd>{formatFcfa(Math.round(total - montant))}</dd></div>
          <div><dt>Total remboursé</dt><dd>{formatFcfa(Math.round(total))}</dd></div>
        </dl>
        <button type="button" className="f-btn f-btn--or" onClick={() => onUtiliser({ slug: type, montant, duree })}>Faire ma demande <ArrowRight /></button>
        <p className="f-simu__note">Estimation indicative à taux fixe. Le taux final dépend de votre dossier et vous est confirmé par votre conseiller.</p>
      </div>
    </div>
  );
}
