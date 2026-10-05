import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mouvementReduit } from "./Mouvement";

gsap.registerPlugin(ScrollTrigger);

type Etape = { titre: string; texte: string; puces: string[]; image?: string };

/**
 * Section « Étapes », sur le modèle de la section Process de a-lign :
 * la section reste figée pendant le défilement, le mot vertical « Étapes » se remplit d'or
 * de haut en bas, et les cartes forment une pile : la carte du dessus remonte et s'efface,
 * la suivante prend sa place. L'animation suit le défilement en continu (scrub).
 */
export default function EtapesPile({ etapes, intro }: { etapes: Etape[]; intro: string }) {
  const section = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = section.current;
    if (!el || mouvementReduit()) return;
    const ctx = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add("(min-width: 1040px)", () => {
        const cartes = gsap.utils.toArray<HTMLElement>(".f-pile__carte", el);
        const decalage = 48;
        cartes.forEach((c, i) => gsap.set(c, { y: i * decalage, zIndex: cartes.length - i }));
        // Comme chez a-lign, les cartes en attente ne sont que des bandes grises : leur contenu apparaît à leur tour.
        cartes.forEach((c, i) => gsap.set(c.children, { autoAlpha: i === 0 ? 1 : 0 }));
        const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6 } });
        tl.fromTo(".f-pile__fill", { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: cartes.length }, 0);
        cartes.forEach((c, i) => {
          if (i === cartes.length - 1) return;
          // La carte i quitte la pile vers le haut ; les suivantes remontent d'un cran.
          tl.to(c, { y: -140, autoAlpha: 0, duration: 0.7, ease: "power2.in" }, i + 0.3);
          cartes.slice(i + 1).forEach((s, j) => tl.to(s, { y: j * decalage, duration: 0.7, ease: "power2.inOut" }, i + 0.3));
          tl.to(cartes[i + 1].children, { autoAlpha: 1, duration: 0.4, ease: "power1.out" }, i + 0.65);
        });
        tl.to({}, { duration: 0.4 });
      });
    }, el);
    return () => ctx.revert();
  }, [etapes.length]);

  return (
    <section ref={section} className="f-pile" style={{ "--n": etapes.length } as React.CSSProperties} aria-labelledby="etapes-titre">
      <div className="f-pile__cadre f-conteneur">
        <div className="f-pile__mot" aria-hidden="true">
          <span className="f-barres f-barres--pale f-barres--vertical">Étapes</span>
          <span className="f-barres f-barres--or f-barres--vertical f-pile__fill">Étapes</span>
        </div>
        <div className="f-pile__droite">
          <h2 id="etapes-titre" className="f-sr">Comment ça marche</h2>
          <div className="f-guide f-pile__intro"><p className="f-label">{intro}</p></div>
          <ol className="f-pile__cartes">
            {etapes.map((e, i) => (
              <li key={e.titre} className="f-pile__carte">
                <div className="f-pile__texte">
                  <div className="f-pile__tete"><h3 className="f-titre-l">{e.titre}</h3><span className="f-numero">0{i + 1} / 0{etapes.length}</span></div>
                  <div className="f-pile__bas">
                    <ul className="f-puces">{e.puces.map((p) => <li key={p} className="f-puce">{p}</li>)}</ul>
                    <p className="f-texte">{e.texte}</p>
                  </div>
                </div>
                {e.image && <div className="f-pile__image"><img className="f-photo" src={e.image} alt="" loading="lazy" /></div>}
              </li>
            ))}
          </ol>
          <div className="f-guide f-guide--serre f-pile__bouton"><Link className="f-btn f-btn--gris" to="/services">Voir les financements</Link></div>
        </div>
      </div>
    </section>
  );
}
