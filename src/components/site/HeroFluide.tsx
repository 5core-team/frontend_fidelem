import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { mouvementReduit } from "./Mouvement";

/**
 * Hero composé comme celui de bleibtgleich.dev : une colonne étroite à gauche (logo, petite mention),
 * un filet vertical, une colonne de droite (mentions en haut, grand titre en bas), puis un titre
 * qui repart de la colonne de gauche.
 */
export default function HeroFluide() {
  const section = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = section.current!;
    if (mouvementReduit()) return;
    const ctx = gsap.context(() => {
      gsap.from(".f-bgh__filet", { scaleY: 0, transformOrigin: "top", duration: 1.2, ease: "power3.out", stagger: 0.15 });
      gsap.from(".f-bgh__ligne > span", { yPercent: 105, duration: 1.1, ease: "expo.out", stagger: 0.06, delay: 0.15 });
      gsap.from(".f-bgh__petit, .f-bgh__texte ", { autoAlpha: 0, y: 12, duration: 0.8, ease: "power2.out", stagger: 0.06, delay: 0.4 });
    }, el);
    return () => ctx.revert();
  }, []);

  const Ligne = ({ children, className = "" }: { children: string; className?: string }) => (
    <span className={`f-bgh__ligne ${className}`}><span>{children}</span></span>
  );

  return (
    <section ref={section} className="f-bgh" aria-labelledby="f-bgh-titre">
      <div className="f-bgh__grille">
        <div className="f-bgh__gauche">
          <p className="f-bgh__petit">Financement<br />& Conseil</p>
        </div>
        <span className="f-bgh__filet" aria-hidden="true" />
        <div className="f-bgh__droite">
          <p className="f-bgh__petit">Basé au Bénin<br />Conseillers dans votre commune</p>
          <h1 id="f-bgh-titre" className="f-bgh__titre">
            <Ligne>Vos projets,</Ligne>
            <Ligne>enfin financés.</Ligne>
          </h1>
        </div>

        <p className="f-bgh__titre f-bgh__titre--large">
          <Ligne>Immobilier,</Ligne>
          <Ligne>Transport,</Ligne>
          <Ligne>Affaires,</Ligne>
        </p>

        <span className="f-bgh__filet f-bgh__filet--2" aria-hidden="true" />
        <div className="f-bgh__droite f-bgh__droite--2">
          <p className="f-bgh__titre">
            <Ligne>avec un</Ligne>
            <Ligne>conseiller</Ligne>
            <Ligne className="f-bgh__retrait">près de chez vous.</Ligne>
          </p>
          <p className="f-bgh__texte">Un conseiller financier formé monte votre dossier et le défend auprès des partenaires.</p>
        </div>
      </div>
    </section>
  );
}
