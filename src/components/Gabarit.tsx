import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

/** Cadre commun des pages du site : barre de navigation, contenu, pied de page. */
export default function Gabarit({ children, fond = "bg-fidelem-light" }: { children: ReactNode; fond?: string }) {
  const { pathname, hash } = useLocation();
  // Chaque nouvelle page s'ouvre en haut ; un lien vers une ancre (#demande)
  // descend jusqu'a elle.
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return; }
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" }), 50);
    return () => clearTimeout(t);
  }, [pathname, hash]);
  return (
    <div className={`min-h-screen flex flex-col ${fond}`}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

/** Titre de page dans le style du site : titre bleu centré et sous-titre. */
export function EnTetePage({ titre, sousTitre, children }: { titre: ReactNode; sousTitre?: ReactNode; children?: ReactNode }) {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-fidelem mb-4">{titre}</h1>
      {sousTitre && <p className="text-xl text-gray-600 max-w-3xl mx-auto">{sousTitre}</p>}
      {children}
    </div>
  );
}

/** Bandeau dégradé des pages principales (comme l'accueil). */
export function Bandeau({ titre, texte, children }: { titre: ReactNode; texte?: ReactNode; children?: ReactNode }) {
  return (
    <section className="bg-gradient-to-r from-fidelem to-fidelem-dark text-white py-16 lg:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">{titre}</h1>
          {texte && <p className="text-xl opacity-90">{texte}</p>}
          {children && <div className="flex flex-wrap gap-4 pt-2">{children}</div>}
        </div>
      </div>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 transform skew-x-12" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-white/5 rounded-tr-full" />
    </section>
  );
}
