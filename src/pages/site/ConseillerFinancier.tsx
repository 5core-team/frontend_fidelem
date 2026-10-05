import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import Gabarit from "@/components/site/Gabarit";
import { MotBarres, TitreLignes } from "@/components/site/Mouvement";
import { ENGAGEMENTS, FAQ, FORMATIONS, FRAIS, PARCOURS_CONSEILLER, CONTACT, formatFcfa } from "@/donnees/fidelem";

const ATOUTS = [
  "Approche duale : personnes physiques et personnes morales",
  "Spécialisation selon le niveau de revenu du client",
  "Pédagogie pratique avec des cas réels béninois",
  "Conformité au SYSCOHADA révisé",
];

export default function ConseillerFinancier() {
  return (
    <Gabarit>
      {/* Hero */}
      <section className="f-cf-hero">
        <div className="f-conteneur f-cf-hero__grille">
          <div className="f-cf-hero__texte">
            <p className="f-label f-label--doux" data-revele>Conseiller Financier Autonome · FIDELEM 2026</p>
            <TitreLignes as="h1" auChargement className="f-titre-xxl" lignes={["Aider à", "vivre mieux.", <em key="e">Devenez conseiller.</em>]} />
            <p className="f-chapo" data-revele="250">Une formation unique au Bénin pour devenir un conseiller financier opérationnel, capable d'accompagner tous les profils, du petit entrepreneur aux grandes fortunes.</p>
            <div className="f-hero__actions" data-revele="400">
              <div className="f-guide f-guide--serre"><Link className="f-btn f-btn--or f-btn--grand" to="/conseiller-financier/candidature">Devenir conseiller financier <ArrowRight /></Link></div>
              <Link className="f-btn f-btn--encre f-btn--grand" to="/espace-conseiller/connexion">Espace Conseiller</Link>
            </div>
          </div>
          <div className="f-cf-hero__visuels">
            <div className="f-guide f-cf-hero__photo1" data-revele="200"><img className="f-photo" src="/images/diplome.jpg" alt="Un jeune diplômé en toge tient son certificat" /></div>
            <div className="f-guide f-cf-hero__photo2" data-revele="350"><img className="f-photo" src="/images/analyse.jpg" alt="Analyse de tableaux financiers sur une tablette" /></div>
          </div>
        </div>
      </section>

      {/* Le métier */}
      <section className="f-section f-section--serree">
        <div className="f-conteneur f-metier">
          <div>
            <p className="f-label f-label--doux">Le métier</p>
            <TitreLignes className="f-titre-l" lignes={["Un conseiller de proximité,", <em key="e">pour une vie financière plus saine.</em>]} />
          </div>
          <div className="f-metier__texte" data-revele>
            <p className="f-texte">Le Conseiller Financier FIDELEM accompagne les particuliers et les entreprises de sa zone : il analyse leur situation, les aide à épargner, à se financer et à structurer leurs projets, puis suit leurs demandes sur la plateforme FIDELEM.</p>
            <p className="f-texte">Il travaille sur une <strong>zone de gestion</strong> qui lui est attribuée, avec une <strong>équipe commerciale</strong>, et reçoit directement les demandes des usagers de cette zone.</p>
            <ul className="f-coches">{ATOUTS.map((a) => <li key={a}><Check aria-hidden="true" />{a}</li>)}</ul>
          </div>
        </div>
      </section>

      {/* Formations */}
      <section className="f-section" id="formations">
        <div className="f-conteneur">
          <div className="f-entete">
            <MotBarres mot="Niveaux" variante="or" />
            <div className="f-guide" data-revele><p className="f-label">Trois niveaux, pour trois profils de clientèle. Chaque formation : 3 séances de 2 h 30 par semaine. Le niveau définitif est fixé après un test.</p></div>
          </div>
          <div className="f-formations">
            {FORMATIONS.map((f, i) => (
              <article key={f.id} id={f.id} className={`f-formation ${i === 1 ? "f-formation--mise" : ""}`} data-revele={i * 120}>
                <header className="f-formation__tete">
                  <span className="f-mono">Niveau {f.niveau}</span>
                  <h3 className="f-titre-l">CF {f.nom}</h3>
                  <p className="f-label f-label--doux">{f.clientele}</p>
                </header>
                <div className="f-formation__prix">
                  <strong>{formatFcfa(f.prix)}</strong>
                  <span>{f.duree} · payable en 3 fois</span>
                </div>
                <div>
                  <p className="f-label f-label--doux">Compétences</p>
                  <ul className="f-liste">{f.competences.map((c) => <li key={c}>{c}</li>)}</ul>
                </div>
                <div>
                  <p className="f-label f-label--doux">Débouchés</p>
                  <ul className="f-liste">{f.debouches.map((c) => <li key={c}>{c}</li>)}</ul>
                </div>
                <div className="f-formation__revenu">
                  <span className="f-label f-label--doux">Revenu moyen indicatif</span>
                  <strong>{formatFcfa(f.revenu)} / mois</strong>
                </div>
                <Link className={`f-btn ${i === 1 ? "f-btn--or" : "f-btn--encre"}`} to={`/conseiller-financier/candidature?niveau=${f.id}`}>Choisir ce parcours <ArrowRight /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça se passe */}
      <section className="f-section f-section--serree" style={{ background: "var(--f-papier-2)" }}>
        <div className="f-conteneur">
          <TitreLignes className="f-titre-l" lignes={["Comment", "ça se passe."]} />
          <ol className="f-frise">
            {PARCOURS_CONSEILLER.map((e, i) => (
              <li key={e.titre} data-revele={i * 100}>
                <span className="f-numero">0{i + 1}</span>
                <h3 className="f-titre-m">{e.titre}</h3>
                <p className="f-texte">{e.texte}</p>
              </li>
            ))}
          </ol>
          <div className="f-frais">
            <div className="f-frais__bloc f-frais__bloc--or" data-revele>
              <p className="f-label">Inscription</p>
              <strong>{formatFcfa(FRAIS.inscription)}</strong>
              <p>Non remboursables.</p>
            </div>
            <div className="f-frais__bloc" data-revele="120">
              <p className="f-label">Formation</p>
              <strong>Selon le niveau retenu</strong>
              <p>Payable en 3 fois, au début de chaque mois.</p>
            </div>
            <div className="f-frais__bloc f-frais__bloc--encre" data-revele="240">
              <p className="f-label">Remboursement</p>
              <strong>100 % remboursée</strong>
              <p>Les frais de formation sont entièrement remboursés à la signature du contrat, après validation de la formation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Engagements */}
      <section className="f-section">
        <div className="f-conteneur f-engagements">
          <div className="f-engagements__titre">
            <TitreLignes className="f-titre-l" lignes={["L'engagement", "du cabinet."]} />
            <div className="f-guide" data-revele style={{ aspectRatio: "4 / 3" }}><img className="f-photo" src="/images/plan-formation.jpg" alt="Bureau avec un plan de formation : comprendre, apprendre, pratiquer" loading="lazy" /></div>
          </div>
          <ul className="f-engagements__liste">
            {ENGAGEMENTS.map((e, i) => (
              <li key={e.titre} data-revele={i * 90}>
                <span className="f-numero">0{i + 1}</span>
                <h3 className="f-titre-m">{e.titre}</h3>
                <p className="f-texte">{e.texte}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Espace Conseiller */}
      <section className="f-section f-section--serree">
        <div className="f-conteneur f-apercu">
          <div className="f-apercu__texte">
            <p className="f-label f-label--doux">Espace Conseiller</p>
            <TitreLignes className="f-titre-l" lignes={["Les demandes de votre zone,", <em key="e">au même endroit.</em>]} />
            <p className="f-texte" data-revele>Avec votre licence, vous recevez les demandes des usagers de votre zone, fixez les rendez-vous et suivez chaque dossier depuis votre espace.</p>
            <div className="f-guide f-guide--serre" style={{ width: "fit-content" }} data-revele><Link className="f-btn f-btn--encre f-btn--grand" to="/espace-conseiller/connexion">Accéder à mon espace <ArrowUpRight /></Link></div>
          </div>
          <div className="f-apercu__ecran f-guide" aria-hidden="true" data-revele="150">
            <div className="f-apercu__fenetre">
              <div className="f-apercu__stats">
                {[["Nouvelles", "12", true], ["En cours", "8", false], ["Rendez-vous", "5", false]].map(([l, v, or]) => <div key={String(l)} className={or ? "est-or" : ""}><span className="f-mono">{l}</span><strong>{v}</strong></div>)}
              </div>
              {[["A. Houngbo", "Immobilier · Cotonou", "Nouvelle"], ["F. Dossou", "Transport · Abomey-Calavi", "Rendez-vous fixé"], ["S. Agbo", "Affaires · Porto-Novo", "Dossier en cours"]].map(([n, t, st]) => (
                <div key={n} className="f-apercu__ligne"><span><strong>{n}</strong><small>{t}</small></span><span className="f-pastille" style={{ background: "var(--f-or-clair)", color: "var(--f-encre)" }}>{st}</span></div>
              ))}
            </div>
            <p className="f-mono">Aperçu illustratif</p>
          </div>
        </div>
      </section>

      {/* FAQ conseiller */}
      <section className="f-section f-section--serree">
        <div className="f-conteneur f-faq-grille">
          <div>
            <TitreLignes className="f-titre-l" lignes={["Questions", "des futurs conseillers."]} />
            <p className="f-texte" style={{ marginTop: 20 }}>Une autre question ? Appelez le <a href={`tel:${CONTACT.telephoneLien}`} style={{ textDecoration: "underline" }}>{CONTACT.telephone}</a>.</p>
          </div>
          <div className="f-faq">
            {FAQ[1].questions.map((q, i) => <details key={q.q} open={i === 0}><summary>{q.q}<i aria-hidden="true">+</i></summary><p className="f-faq__reponse">{q.r}</p></details>)}
          </div>
        </div>
      </section>

      <section className="f-section f-final">
        <div className="f-conteneur f-final__grille">
          <TitreLignes className="f-titre-xxl" lignes={["Votre carrière", "commence ici."]} />
          <div className="f-final__actions" data-revele>
            <p className="f-chapo">Candidature en ligne en 5 minutes. On vous rappelle pour l'échange et le test de niveau.</p>
            <div className="f-guide f-guide--serre" style={{ width: "fit-content" }}><Link className="f-btn f-btn--or f-btn--grand" to="/conseiller-financier/candidature">Devenir conseiller financier <ArrowRight /></Link></div>
          </div>
        </div>
      </section>
    </Gabarit>
  );
}
