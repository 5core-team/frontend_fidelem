import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { EASYLIFE } from "@/donnees/fidelem";
import { ICONES_LIVING } from "./icones";
import { mouvementReduit } from "./Mouvement";

gsap.registerPlugin(Flip, ScrollTrigger);

/** Les 8 composantes d'EasyLife Living, regroupées en 4 cartes thématiques. */
const CARTES = [
  { titre: "Se loger", texte: "Un logement meublé, avec l'eau, l'électricité et le gaz compris.", items: [0, 1], teinte: "or" },
  { titre: "Se déplacer", texte: "Le trajet domicile-travail pris en charge, et un forfait pour rester joignable.", items: [2, 4], teinte: "encre" },
  { titre: "Être protégé", texte: "Une assurance maladie et une équipe qui vous accompagne au quotidien.", items: [3, 7], teinte: "blanc" },
  { titre: "Mieux vivre", texte: "Un panier alimentaire et un programme d'épargne pour préparer ses projets.", items: [5, 6], teinte: "marine" },
] as const;

/**
 * « Le confort de vie tout-en-un », construite comme la section Work de a-lign :
 * le bloc reste figé pendant le défilement, le mot « Living » se remplit d'or de gauche à droite,
 * et les 4 cartes tournent d'un emplacement à l'autre (animation FLIP) à chaque palier.
 * Aucune carte ne sort de l'écran : on suit facilement chaque carte d'une place à l'autre.
 */
export default function LivingDefilant() {
  const section = useRef<HTMLElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const [etape, setEtape] = useState(0);
  const etapeRef = useRef(0);
  const anim = useRef<gsap.core.Timeline | null>(null);
  const n = CARTES.length;

  useLayoutEffect(() => {
    const el = section.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(min-width: 1040px)", () => {
        ScrollTrigger.create({
          trigger: el, start: "top top", end: "bottom bottom",
          onUpdate: (self) => {
            if (fill.current) fill.current.style.clipPath = `inset(0 ${(1 - self.progress) * 100}% 0 0)`;
            const e = Math.min(n - 1, Math.floor(self.progress * n * 0.999));
            if (e === etapeRef.current) return;
            const cartes = gsap.utils.toArray<HTMLElement>(".f-work-carte", el);
            anim.current?.progress(1);
            const etat = mouvementReduit() ? null : Flip.getState(cartes);
            etapeRef.current = e;
            setEtape(e);
            if (etat) requestAnimationFrame(() => { anim.current = Flip.from(etat, { duration: 1.1, ease: "expo.inOut", stagger: 0.04 }); });
          },
        });
      });
    }, el);
    return () => ctx.revert();
  }, [n]);

  return (
    <section ref={section} className="f-work" aria-labelledby="living-titre">
      <div className="f-work__cadre f-conteneur">
        <div className="f-work__grille">
          <div className="f-work__titre">
            <span className="f-work__mot" aria-hidden="true">
              <span className="f-barres f-barres--pale">Living</span>
              <span ref={fill} className="f-barres f-barres--or f-work__fill">Living</span>
            </span>
            <h2 id="living-titre" className="f-titre-m">EasyLife Living, le confort de vie tout-en-un.</h2>
          </div>
          <div className="f-work__desc f-guide">
            <p className="f-label">Pour les travailleurs : logement, charges, transport, santé, communication, alimentation et épargne, réunis dans une seule offre.</p>
          </div>
          {CARTES.map((c, i) => {
            const place = (i - etape + n) % n;
            return (
              <article key={c.titre} data-flip-id={c.titre} className={`f-work-carte f-guide place-${place}`}>
                <div className={`f-work-carte__visuel teinte-${c.teinte}`}>
                  <ul className="f-work-carte__items">
                    {c.items.map((k) => {
                      const o = EASYLIFE.living.offre[k];
                      const Icone = ICONES_LIVING[o.icone as keyof typeof ICONES_LIVING];
                      return <li key={o.titre}><Icone aria-hidden="true" />{o.titre}</li>;
                    })}
                  </ul>
                  <p>{c.texte}</p>
                </div>
                <div className="f-work-carte__pied">
                  <h3 className="f-label">{c.titre}</h3>
                  <span className="f-numero">0{i + 1} / 0{n}</span>
                </div>
              </article>
            );
          })}
          <div className="f-work__bouton f-guide f-guide--serre">
            <Link className="f-btn f-btn--gris" to="/easylife">Découvrir EasyLife <ArrowRight /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
