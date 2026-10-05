import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Gabarit from "@/components/site/Gabarit";
import LivingDefilant from "@/components/site/LivingDefilant";
import EtapesPile from "@/components/site/EtapesPile";
import { MotBarres, TitreLignes, mouvementReduit } from "@/components/site/Mouvement";
import { FAQ, FINANCEMENTS, FORMATIONS, formatFcfa } from "@/donnees/fidelem";

const ETAPES = [
  { titre: "Je fais ma demande", texte: "Je décris mon projet et je choisis un créneau de rendez-vous. C'est gratuit et sans engagement.", puces: ["En ligne", "2 minutes", "Ma zone"], image: "/images/bureau.jpg" },
  { titre: "Un conseiller m'appelle", texte: "Un conseiller FIDELEM de ma commune prend ma demande en charge et confirme le rendez-vous.", puces: ["Agence", "Téléphone", "Visio", "WhatsApp"], image: "/images/diplome.jpg" },
  { titre: "On monte le dossier", texte: "Il m'aide à réunir les pièces et présente un dossier solide aux partenaires financiers.", puces: ["Pièces", "Analyse", "Partenaires"], image: "/images/documents.jpg" },
  { titre: "Je suis la réponse", texte: "Je vois l'avancement de ma demande depuis mon espace, jusqu'à la décision et au déblocage.", puces: ["Suivi", "Décision", "Déblocage"], image: "/images/analyse.jpg" },
];

/** La phrase manifeste : chaque mot s'éclaire au défilement. */
function Manifeste() {
  const ref = useRef<HTMLParagraphElement>(null);
  useLayoutEffect(() => {
    if (!ref.current || mouvementReduit()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current!.querySelectorAll(".f-mot"), { color: "rgba(18,26,46,.16)" }, {
        color: "rgba(18,26,46,1)", stagger: 0.08, ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top 78%", end: "bottom 45%", scrub: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);
  const texte = "Un projet mérite mieux qu'un formulaire. Il mérite un conseiller formé, dans votre commune, qui monte le dossier avec vous et vous suit jusqu'à la réponse.";
  return (
    <p ref={ref} className="f-manifeste">
      <span className="f-manifeste__guillemet" aria-hidden="true">“</span>
      {texte.split(" ").map((m, i) => <span key={i} className="f-mot">{m} </span>)}
      <span className="f-manifeste__guillemet" aria-hidden="true">”</span>
    </p>
  );
}

/** Les trois niveaux de conseiller en très grand, la fiche apparaît au survol. */
function Niveaux() {
  return (
    <ul className="f-niveaux">
      {FORMATIONS.map((f) => (
        <li key={f.id}>
          <Link to={`/conseiller-financier#${f.id}`} className="f-niveaux__lien">
            <span className="f-niveaux__nom">{f.nom}</span>
            <span className="f-niveaux__fiche">
              <span className="f-mono">Niveau {f.niveau}</span>
              <strong>{formatFcfa(f.prix)}</strong>
              <span>{f.duree} · {f.clientele.replace("Clients au revenu mensuel ", "revenu ")}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Accueil() {
  return (
    <Gabarit>
      {/* Hero */}
      <section className="f-hero">
        <div className="f-conteneur f-hero__grille">
          <div className="f-hero__texte">
            <p className="f-label f-hero__sur" data-revele>Financement immobilier, transport et d'affaires · Bénin</p>
            <TitreLignes as="h1" auChargement className="f-titre-xxl" lignes={["Vos projets,", <>enfin <em>financés.</em></>]} />
            <p className="f-chapo" data-revele="250">Un conseiller financier de votre commune monte votre dossier avec vous.</p>
            <div className="f-hero__actions" data-revele="400">
              <div className="f-guide f-guide--serre"><Link className="f-btn f-btn--or f-btn--grand" to="/services">Demander un financement <ArrowRight /></Link></div>
              <Link className="f-btn f-btn--gris f-btn--grand" to="/trouver-un-conseiller">Trouver un conseiller</Link>
            </div>
          </div>
          <div className="f-hero__visuels" aria-hidden="true">
            <div className="f-guide f-hero__photo f-hero__photo--1" data-revele="200"><img className="f-photo" src="/images/bureau.jpg" alt="" /></div>
            <div className="f-guide f-hero__photo f-hero__photo--2" data-revele="320"><img className="f-photo" src="/images/diplome.jpg" alt="" /></div>
            <div className="f-guide f-hero__photo f-hero__photo--3" data-revele="440"><img className="f-photo" src="/images/analyse.jpg" alt="" /></div>
          </div>
        </div>
      </section>

      {/* Manifeste */}
      <section className="f-section f-section--serree">
        <div className="f-conteneur"><Manifeste /></div>
      </section>

      {/* Financements */}
      <section className="f-section" id="financements">
        <div className="f-conteneur">
          <div className="f-entete">
            <MotBarres mot="Financer" variante="or" />
            <div className="f-guide" data-revele><p className="f-label">Trois financements, un même accompagnement.</p></div>
          </div>
          <div className="f-financements">
            {FINANCEMENTS.map((f, i) => (
              <Link key={f.slug} to={`/services/${f.slug}`} className="f-financement f-guide" data-revele={i * 120}>
                <div className="f-financement__pied">
                  <h3 className="f-label">{f.nom}</h3>
                  <span className="f-numero">0{i + 1} / 03</span>
                </div>
                <p className="f-financement__accroche">{f.accroche}</p>
                <span className="f-lien">En savoir plus <ArrowUpRight /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche : pile de cartes figée, sur le modèle de « Process » de a-lign */}
      <EtapesPile etapes={ETAPES} intro="Pas de file d'attente, pas de dossier perdu. Votre demande arrive directement chez un conseiller de votre zone." />

      {/* EasyLife Living : section figée, sur le modèle de « Work » de a-lign */}
      <LivingDefilant />

      {/* Conseillers */}
      <section className="f-section">
        <div className="f-conteneur">
          <div className="f-entete">
            <TitreLignes className="f-titre-xl" lignes={["Devenez", "conseiller financier."]} />
            <div className="f-guide" data-revele><p className="f-label">Trois niveaux de formation, de 3 à 7 mois. Frais remboursés à la signature.</p></div>
          </div>
          <Niveaux />
          <div className="f-guide f-guide--serre" style={{ width: "fit-content", marginTop: 40 }} data-revele>
            <Link className="f-btn f-btn--encre f-btn--grand" to="/conseiller-financier">Devenir conseiller financier <ArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="f-section f-section--serree">
        <div className="f-conteneur f-faq-grille">
          <div>
            <TitreLignes className="f-titre-l" lignes={["Vos questions,", "nos réponses."]} />
            <Link className="f-lien" style={{ marginTop: 28 }} to="/faq">Toutes les questions <ArrowUpRight /></Link>
          </div>
          <div className="f-faq">
            {[FAQ[0].questions[0], FAQ[1].questions[0], FAQ[2].questions[0]].map((q) => (
              <details key={q.q}><summary>{q.q}<i aria-hidden="true">+</i></summary><p className="f-faq__reponse">{q.r}</p></details>
            ))}
          </div>
        </div>
      </section>

      {/* Appel final */}
      <section className="f-section f-final">
        <div className="f-conteneur f-final__grille">
          <TitreLignes className="f-titre-xxl" lignes={["Parlons de", "votre projet."]} />
          <div className="f-final__actions" data-revele>
            
            <div className="f-guide f-guide--serre" style={{ width: "fit-content" }}><Link className="f-btn f-btn--or f-btn--grand" to="/contact">Prendre rendez-vous <ArrowRight /></Link></div>
          </div>
        </div>
      </section>
    </Gabarit>
  );
}
