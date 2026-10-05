import { ReactNode, useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const mouvementReduit = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenis: Lenis | null = null;
export const defilerVers = (cible: number | string | HTMLElement) => {
  if (lenis) lenis.scrollTo(cible as never, { offset: typeof cible === "number" ? 0 : -20 });
  else if (typeof cible === "number") window.scrollTo({ top: cible, behavior: mouvementReduit() ? "auto" : "smooth" });
  else (typeof cible === "string" ? document.querySelector(cible) : cible)?.scrollIntoView({ behavior: "smooth" });
};

/** Défilement fluide (Lenis) synchronisé avec ScrollTrigger, et retour en haut à chaque changement de page. */
export function DefilementFluide() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    document.documentElement.classList.add("f-js");
    if (mouvementReduit()) return;
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  useLayoutEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) { setTimeout(() => defilerVers(el as HTMLElement), 60); return; }
    }
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname, hash]);

  return null;
}

/** Fait apparaître les éléments marqués data-revele quand ils entrent à l'écran. */
export function useRevele(dependances: unknown[] = []) {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-revele]:not(.est-visible)"));
    if (mouvementReduit() || !("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("est-visible"));
      return;
    }
    const obs = new IntersectionObserver(
      (entrees) => entrees.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        const delai = Number(el.dataset.revele || 0);
        el.style.transitionDelay = `${delai}ms`;
        el.classList.add("est-visible");
        obs.unobserve(el);
      }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    elements.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependances);
}

/** Titre dont chaque ligne monte depuis un masque, au chargement ou à l'entrée à l'écran. */
export function TitreLignes({ lignes, className, as: Balise = "h2", auChargement = false, delai = 0 }: {
  lignes: ReactNode[]; className?: string; as?: "h1" | "h2" | "h3" | "p"; auChargement?: boolean; delai?: number;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  useLayoutEffect(() => {
    if (!ref.current || mouvementReduit()) return;
    const ctx = gsap.context(() => {
      const spans = ref.current!.querySelectorAll(".f-ligne-masque > span");
      gsap.fromTo(spans, { yPercent: 110 }, {
        yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.09, delay: delai,
        ...(auChargement ? {} : { scrollTrigger: { trigger: ref.current, start: "top 88%", once: true } }),
      });
    }, ref);
    return () => ctx.revert();
  }, [auChargement, delai]);
  return (
    <Balise ref={ref} className={className}>
      {lignes.map((l, i) => <span key={i} className="f-ligne-masque"><span>{l}</span></span>)}
    </Balise>
  );
}

/** Mot géant en barres qui se dessine de gauche à droite à l'entrée à l'écran. */
export function MotBarres({ mot, variante = "", className = "" }: { mot: string; variante?: "" | "or" | "pale" | "blanc"; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    if (!ref.current || mouvementReduit()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, { clipPath: "inset(0 100% 0 0)" }, {
        clipPath: "inset(0 0% 0 0)", ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top 95%", end: "top 65%", scrub: 0.4 },
      });
    }, ref);
    return () => ctx.revert();
  }, []);
  return <span ref={ref} aria-hidden="true" className={`f-barres ${variante ? `f-barres--${variante}` : ""} ${className}`}>{mot}</span>;
}
