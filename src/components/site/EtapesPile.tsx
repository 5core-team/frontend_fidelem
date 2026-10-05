import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mouvementReduit } from "./Mouvement";

gsap.registerPlugin(ScrollTrigger);

type Etape = { titre: string; texte: string; puces: string[]; image?: string; lien?: string; demande?: string };

/**
 * Portage de initProcessSection() de a-lign : chaque étape est une fine barre grise (2rem),
 * les barres sont empilées en bas de la section figée. Au défilement, la barre active se déplie
 * vers le haut (clip-path qui s'ouvre, coins arrondis, contenu en fondu) et la précédente se replie.
 * Les autres barres glissent à leur nouvelle place (technique FLIP sur y).
 */
export default function EtapesPile({ etapes, intro, mot = "Étapes", titre = "Comment ça marche", bouton = { libelle: "Voir les financements", vers: "/services" } }: {
  etapes: Etape[]; intro: string; mot?: string; titre?: string; bouton?: { libelle: string; vers: string };
}) {
  const section = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const wrap = section.current;
    if (!wrap || mouvementReduit()) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1040px)", () => {
        const boxes = gsap.utils.toArray<HTMLElement>(".f-process__box", wrap);
        const contenus = (b: HTMLElement) => b.querySelectorAll(".f-process__texte, .f-process__image");
        let collapsedParentH: number[] = [], expandedParentH: number[] = [], collapsedClips: string[] = [];
        let activeTl: gsap.core.Timeline | null = null;
        let activeIndex = -1;

        const measure = () => {
          collapsedParentH = boxes.map((b) => b.parentElement!.getBoundingClientRect().height);
          const collapsedW = boxes.map((b) => b.getBoundingClientRect().width);
          const collapsedH = boxes.map((b) => b.getBoundingClientRect().height);
          const parentW = boxes.map((b) => b.parentElement!.getBoundingClientRect().width);
          const expandedH = boxes.map((b, i) => {
            const saved = b.style.cssText;
            b.style.cssText = `position:static;height:auto;width:${parentW[i]}px;overflow:visible;`;
            const h = b.getBoundingClientRect().height;
            b.style.cssText = saved;
            return h;
          });
          expandedParentH = boxes.map((b, i) => {
            const p = b.parentElement!; const saved = b.style.cssText; const savedP = p.style.cssText;
            b.style.cssText = `height:auto;width:${parentW[i]}px;overflow:visible;`;
            p.style.height = "";
            const h = p.getBoundingClientRect().height;
            b.style.cssText = saved; p.style.cssText = savedP;
            return h;
          });
          collapsedClips = boxes.map((_, i) => `inset(${expandedH[i] - collapsedH[i]}px 0px 0px ${parentW[i] - collapsedW[i]}px)`);
          return { parentW, expandedH };
        };

        const applyInitialState = (d: { parentW: number[]; expandedH: number[] }) => {
          boxes.forEach((b, i) => {
            const p = b.parentElement!;
            p.style.position = "relative"; p.style.overflow = "visible"; p.style.height = `${collapsedParentH[i]}px`;
            gsap.set(b, { position: "absolute", bottom: 0, right: 0, width: d.parentW[i], height: d.expandedH[i], overflow: "hidden", zIndex: 1, clipPath: collapsedClips[i] });
            gsap.set(contenus(b), { opacity: 0 });
          });
        };

        const snapToState = (index: number) => boxes.forEach((b, i) => {
          const actif = i === index;
          b.parentElement!.style.height = `${actif ? expandedParentH[i] : collapsedParentH[i]}px`;
          gsap.set(b, { y: 0, clipPath: actif ? "inset(0px 0px 0px 0px)" : collapsedClips[i], borderRadius: actif ? 8 : 0, zIndex: actif ? 10 : 1 });
          gsap.set(contenus(b), { opacity: actif ? 1 : 0 });
        });

        const transitionTo = (index: number) => {
          if (index === activeIndex) return;
          const prev = activeIndex; activeIndex = index;
          if (activeTl) { activeTl.kill(); activeTl = null; boxes.forEach((b) => gsap.set(b, { y: 0 })); }
          boxes.forEach((b, i) => {
            if (i !== index && i !== prev) {
              b.parentElement!.style.height = `${collapsedParentH[i]}px`;
              gsap.set(b, { clipPath: collapsedClips[i], zIndex: 1 });
              gsap.set(contenus(b), { opacity: 0 });
            }
          });
          const avant = boxes.map((b) => b.getBoundingClientRect().top);
          boxes.forEach((b, i) => { b.parentElement!.style.height = `${i === index ? expandedParentH[i] : collapsedParentH[i]}px`; });
          const apres = boxes.map((b) => b.getBoundingClientRect().top);
          boxes.forEach((b, i) => gsap.set(b, { y: avant[i] - apres[i] }));

          activeTl = gsap.timeline({ onComplete() { activeTl = null; } });
          boxes.forEach((b) => activeTl!.to(b, { y: 0, duration: 0.6, ease: "power2.inOut" }, 0));
          if (index >= 0) {
            activeTl.to(boxes[index], { clipPath: "inset(0px 0px 0px 0px)", borderRadius: 8, duration: 0.6, ease: "power2.inOut", onStart() { boxes[index].style.zIndex = "10"; } }, 0)
              .to(contenus(boxes[index]), { opacity: 1, duration: 0.6, ease: "power2.inOut" }, 0);
          }
          if (prev >= 0 && prev !== index) {
            activeTl.to(boxes[prev], { clipPath: collapsedClips[prev], borderRadius: 0, duration: 0.6, ease: "power2.inOut", onComplete() { boxes[prev].style.zIndex = "1"; } }, 0)
              .to(contenus(boxes[prev]), { opacity: 0, duration: 0.6, ease: "power2.inOut" }, 0);
          }
        };

        applyInitialState(measure());
        const n = boxes.length;
        ScrollTrigger.create({
          trigger: wrap, start: "top top", end: () => `+=${wrap.offsetHeight - window.innerHeight}px`,
          onUpdate(self) { transitionTo(Math.min(n - 1, Math.floor(self.progress * n))); },
          onLeave() { activeTl?.kill(); activeTl = null; snapToState(n - 1); activeIndex = n - 1; },
          onLeaveBack() { transitionTo(-1); },
        });
        // Le mot vertical se remplit d'or de haut en bas, comme le titre de Process.
        gsap.fromTo(".f-pile__fill", { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", ease: "none", scrollTrigger: { trigger: wrap, start: "top top", end: "bottom bottom", scrub: true } });

        return () => {
          activeTl?.kill();
          boxes.forEach((b) => { gsap.set(b, { clearProps: "all" }); gsap.set(contenus(b), { clearProps: "all" }); const p = b.parentElement!; p.style.height = ""; p.style.position = ""; p.style.overflow = ""; });
        };
      });
    }, wrap);
    return () => ctx.revert();
  }, [etapes.length]);

  return (
    <section ref={section} className="f-pile" style={{ "--n": etapes.length } as React.CSSProperties} aria-labelledby="etapes-titre">
      <div className="f-pile__cadre f-conteneur">
        <div className="f-pile__mot" aria-hidden="true">
          <span className="f-barres f-barres--pale f-barres--vertical">{mot}</span>
          <span className="f-barres f-barres--or f-barres--vertical f-pile__fill">{mot}</span>
        </div>
        <div className="f-pile__droite">
          <h2 id="etapes-titre" className="f-sr">{titre}</h2>
          <div className="f-guide f-pile__intro"><p className="f-label">{intro}</p></div>
          <ol className="f-process">
            {etapes.map((e, i) => (
              <li key={e.titre} className="f-process__place">
                <div className="f-process__box">
                  <div className="f-process__texte">
                    <div className="f-pile__tete"><h3 className="f-titre-l">{e.titre}</h3><span className="f-numero">0{i + 1} / 0{etapes.length}</span></div>
                    <div className="f-pile__bas">
                      <ul className="f-puces">{e.puces.map((p) => <li key={p} className="f-puce">{p}</li>)}</ul>
                      <p className="f-texte">{e.texte}</p>
                      {(e.lien || e.demande) && (
                        <div className="f-pile__actions">
                          {e.lien && <Link className="f-btn f-btn--encre" to={e.lien}>En savoir plus</Link>}
                          {e.demande && <Link className="f-lien" to={e.demande}>Faire ma demande</Link>}
                        </div>
                      )}
                    </div>
                  </div>
                  {e.image && <div className="f-process__image"><img className="f-photo" src={e.image} alt="" loading="lazy" /></div>}
                </div>
              </li>
            ))}
          </ol>
          <div className="f-guide f-guide--serre f-pile__bouton"><Link className="f-btn f-btn--gris" to={bouton.vers}>{bouton.libelle}</Link></div>
        </div>
      </div>
    </section>
  );
}
