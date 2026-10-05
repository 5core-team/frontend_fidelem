import { ComponentProps, useRef } from "react";
import { NavLink } from "react-router-dom";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { mouvementReduit } from "./Mouvement";

gsap.registerPlugin(ScrambleTextPlugin);

// Mêmes réglages que les liens du footer de a-lign : caractères, durée 0,6 s, vitesse 1, révélation à 0,1.
const CARACTERES = '!"#$%&()*+,-./:;<=>?@[\\]^_`{|}~ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Au survol, le libellé se brouille puis se recompose lettre par lettre. */
export function brouiller(el: HTMLElement | null, texte: string) {
  if (!el || mouvementReduit() || !window.matchMedia("(hover: hover)").matches) return;
  gsap.to(el, { duration: 0.6, ease: "none", overwrite: true, scrambleText: { text: texte, chars: CARACTERES, speed: 1, revealDelay: 0.1 }, onComplete: () => { el.textContent = texte; } });
}

export default function LienBrouille({ children, ...props }: Omit<ComponentProps<typeof NavLink>, "children"> & { children: string }) {
  const texte = useRef<HTMLSpanElement>(null);
  return (
    <NavLink {...props} aria-label={children} onMouseEnter={() => brouiller(texte.current, children)} onFocus={() => brouiller(texte.current, children)}>
      <span ref={texte} aria-hidden="true">{children}</span>
    </NavLink>
  );
}
