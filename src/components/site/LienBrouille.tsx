import { ComponentProps, useRef } from "react";
import { NavLink } from "react-router-dom";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { mouvementReduit } from "./Mouvement";

gsap.registerPlugin(ScrambleTextPlugin);


/** Au survol, le libellé se brouille puis se recompose lettre par lettre. */
export function brouiller(el: HTMLElement | null, texte: string) {
  if (!el || mouvementReduit() || !window.matchMedia("(hover: hover)").matches) return;
  // Version douce : seules les lettres du mot défilent (pas de symboles), lentement et brièvement.
  const lettres = Array.from(new Set(texte.replace(/\s/g, "").toUpperCase())).join("");
  gsap.to(el, { duration: 0.45, ease: "power1.out", overwrite: true, scrambleText: { text: texte, chars: lettres, speed: 0.35, revealDelay: 0.05 }, onComplete: () => { el.textContent = texte; } });
}

export default function LienBrouille({ children, ...props }: Omit<ComponentProps<typeof NavLink>, "children"> & { children: string }) {
  const texte = useRef<HTMLSpanElement>(null);
  return (
    <NavLink {...props} aria-label={children} onMouseEnter={() => brouiller(texte.current, children)} onFocus={() => brouiller(texte.current, children)}>
      <span ref={texte} aria-hidden="true">{children}</span>
    </NavLink>
  );
}
