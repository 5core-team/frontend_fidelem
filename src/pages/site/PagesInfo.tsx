import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Phone, Mail, MapPin, Clock, Search } from "lucide-react";
import Gabarit from "@/components/site/Gabarit";
import EnTetePage from "@/components/site/EnTetePage";
import { MotBarres, TitreLignes } from "@/components/site/Mouvement";
import { CONTACT, FAQ as QUESTIONS, EASYLIFE } from "@/donnees/fidelem";
import { envoyerMessageContact } from "@/config/apiPublic";
import {
  BlocCoordonnees, BlocRendezVous, BoutonEnvoi, Champ, Confirmation, MessageErreurEnvoi,
  coordonneesVides, rendezVousVide, useEnvoi, validerCoordonnees, validerRendezVous,
} from "@/components/site/Formulaires";

/* ------------------------------ À propos ------------------------------ */

const VALEURS = [
  { nom: "Proximité", texte: "Un conseiller dans votre commune, qui connaît votre réalité." },
  { nom: "Réactivité", texte: "Des réponses rapides et un suivi de chaque demande." },
  { nom: "Excellence", texte: "Des conseillers formés aux standards OHADA et au SYSCOHADA révisé." },
];

export function APropos() {
  return (
    <Gabarit>
      <EnTetePage label="À propos" lignes={["À propos", <em key="e">de FIDELEM.</em>]} chapo="Un cabinet de finance qui facilite l'accès au financement et forme les conseillers financiers de demain, au plus près des usagers." note="Financial Debt and Leasing Management" />

      <div className="f-conteneur"><div className="f-guide" style={{ aspectRatio: "21 / 8" }} data-revele><img className="f-photo" src="/images/analyse.jpg" alt="Analyse de documents financiers" /></div></div>

      <section className="f-section">
        <div className="f-conteneur f-metier">
          <div>
            <p className="f-label f-label--doux">Notre histoire</p>
            <TitreLignes className="f-titre-l" lignes={["Rendre le financement", <em key="e">accessible à tous.</em>]} />
          </div>
          <div className="f-metier__texte" data-revele>
            <p className="f-texte">FIDELEM est née d'un constat simple : trop de projets s'arrêtent faute d'accompagnement, pas faute d'idées. Notre plateforme met en relation les usagers avec des conseillers financiers qualifiés, qui montent leur dossier et le défendent auprès des partenaires financiers.</p>
            <p className="f-texte"><strong>Notre mission :</strong> faciliter l'accès au financement grâce à un service personnalisé et transparent, et aider chacun à vivre mieux avec une vie financière plus saine.</p>
          </div>
        </div>
      </section>

      <section className="f-section f-section--serree" style={{ paddingTop: 0 }}>
        <div className="f-conteneur">
          <ul className="f-valeurs">
            {VALEURS.map((v) => <li key={v.nom} data-revele><span className="f-valeurs__nom">{v.nom}</span><span className="f-texte">{v.texte}</span></li>)}
          </ul>
        </div>
      </section>

      <section className="f-section f-section--serree">
        <div className="f-conteneur">
          <ul className="f-reseau">
            <li data-revele>
              <span className="f-numero">01</span>
              <p className="f-label f-label--doux">Le réseau</p>
              <h2 className="f-titre-m">Des conseillers formés, dans chaque zone.</h2>
              <p className="f-texte">Trois niveaux de formation, une licence et une zone de gestion pour chaque conseiller.</p>
              <Link className="f-lien" to="/conseiller-financier">Le métier <ArrowUpRight /></Link>
            </li>
            <li data-revele="120">
              <span className="f-numero">02</span>
              <p className="f-label f-label--doux">L'écosystème</p>
              <h2 className="f-titre-m">EasyLife, pour mieux vivre au quotidien.</h2>
              <p className="f-texte">{EASYLIFE.presentation}</p>
              <Link className="f-lien" to="/easylife">Découvrir EasyLife <ArrowUpRight /></Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="f-section f-final">
        <div className="f-conteneur f-final__grille">
          <TitreLignes className="f-titre-xxl" lignes={["Parlons-en", "ensemble."]} />
          <div className="f-final__actions" data-revele>
            <div className="f-guide f-guide--serre" style={{ width: "fit-content" }}><Link className="f-btn f-btn--or f-btn--grand" to="/contact">Nous contacter <ArrowRight /></Link></div>
          </div>
        </div>
      </section>
    </Gabarit>
  );
}

/* ------------------------------ Contact ------------------------------ */

const OBJETS = ["Demande de financement", "EasyLife", "Devenir conseiller", "Autre"];

export function Contact() {
  const [coord, setCoord] = useState(coordonneesVides());
  const [rdv, setRdv] = useState(rendezVousVide());
  const [objet, setObjet] = useState(OBJETS[0]);
  const [message, setMessage] = useState("");
  const { etat, erreurs, envoyer, messageErreur } = useEnvoi();

  const infos = [
    { icone: Phone, libelle: "Téléphone", valeur: CONTACT.telephone, lien: `tel:${CONTACT.telephoneLien}` },
    { icone: Mail, libelle: "E-mail", valeur: CONTACT.email, lien: `mailto:${CONTACT.email}` },
    { icone: MapPin, libelle: "Adresse", valeur: `${CONTACT.adresse}, ${CONTACT.pays}` },
    { icone: Clock, libelle: "Horaires", valeur: CONTACT.horaires },
  ];

  return (
    <Gabarit>
      <EnTetePage label="Contact" lignes={["Prenons", <em key="e">rendez-vous.</em>]} chapo="Un conseiller de votre zone vous rappelle." />
      <section className="f-section" style={{ paddingTop: 0 }}>
        <div className="f-conteneur f-demande">
          <aside className="f-demande__cote">
            <ul className="f-infos">
              {infos.map(({ icone: Icone, libelle, valeur, lien }) => (
                <li key={libelle} className="f-guide">
                  <Icone aria-hidden="true" />
                  <span className="f-label f-label--doux">{libelle}</span>
                  {lien ? <a href={lien}>{valeur}</a> : <span>{valeur}</span>}
                </li>
              ))}
            </ul>
          </aside>
          <div className="f-carte">
            {etat === "succes" ? (
              <Confirmation titre="Message envoyé.">Merci {coord.prenom}. Nous vous recontactons pour confirmer votre rendez-vous du {rdv.date}.</Confirmation>
            ) : (
              <form className="f-form" noValidate onSubmit={(e) => {
                e.preventDefault();
                const v = { ...validerCoordonnees(coord), ...validerRendezVous(rdv) };
                if (!message.trim()) v.message = "Écrivez votre message.";
                envoyer(v, () => envoyerMessageContact({ ...coord, objet, message, rendezVous: rdv }));
              }}>
                <div className="f-grille-2">
                  <Champ libelle="Votre demande">
                    <select id="f-objet-contact" value={objet} onChange={(e) => setObjet(e.target.value)}>{OBJETS.map((o) => <option key={o}>{o}</option>)}</select>
                  </Champ>
                </div>
                <Champ libelle="Message" erreur={erreurs.message}><textarea id="f-message-contact" rows={3} style={{ minHeight: 96 }} value={message} onChange={(e) => setMessage(e.target.value)} aria-invalid={!!erreurs.message} placeholder="En quelques mots, ce que vous souhaitez." /></Champ>
                <BlocCoordonnees valeur={coord} onChange={setCoord} erreurs={erreurs} />
                <BlocRendezVous valeur={rdv} onChange={setRdv} erreurs={erreurs} />
                {etat === "erreur" && <MessageErreurEnvoi message={messageErreur} />}
                <BoutonEnvoi etat={etat}>Envoyer</BoutonEnvoi>
              </form>
            )}
          </div>
        </div>
      </section>
    </Gabarit>
  );
}

/* ------------------------------ FAQ ------------------------------ */

const sansAccent = (s: string) => s.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");

export function FAQPage() {
  const [q, setQ] = useState("");
  const [theme, setTheme] = useState("Tout");
  const groupes = useMemo(() => QUESTIONS
    .filter((g) => theme === "Tout" || g.theme === theme)
    .map((g) => ({ ...g, questions: g.questions.filter((x) => !q || sansAccent(x.q + x.r).includes(sansAccent(q))) }))
    .filter((g) => g.questions.length), [q, theme]);

  return (
    <Gabarit>
      <EnTetePage label="Questions fréquentes" lignes={["Vos questions,", <em key="e">nos réponses.</em>]} />
      <section className="f-section" style={{ paddingTop: 0 }}>
        <div className="f-conteneur f-faq-page">
          <aside className="f-faq-page__filtres">
            <label className="f-recherche__champ">
              <Search aria-hidden="true" /><span className="f-sr">Rechercher</span>
              <input id="f-faq-q" placeholder="Rechercher" value={q} onChange={(e) => setQ(e.target.value)} />
            </label>
            <div className="f-faq-page__themes">
              {["Tout", ...QUESTIONS.map((g) => g.theme)].map((t) => <button key={t} type="button" className={`f-puce ${theme === t ? "f-puce--encre" : ""}`} onClick={() => setTheme(t)}>{t}</button>)}
            </div>
          </aside>
          <div style={{ display: "grid", gap: 48 }}>
            {groupes.length === 0 && <p className="f-texte">Aucune question ne correspond. Écrivez-nous depuis la page <Link to="/contact" style={{ textDecoration: "underline" }}>Contact</Link>.</p>}
            {groupes.map((g) => (
              <div key={g.theme}>
                <p className="f-label f-label--doux" style={{ marginBottom: 12 }}>{g.theme}</p>
                <div className="f-faq">
                  {g.questions.map((x) => <details key={x.q} open={!!q}><summary>{x.q}<i aria-hidden="true">+</i></summary><p className="f-faq__reponse">{x.r}</p></details>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Gabarit>
  );
}

/* ------------------------------ Légal et 404 ------------------------------ */

const LEGAL: Record<string, { titre: string; sections: { t: string; p: string }[] }> = {
  "mentions-legales": {
    titre: "Mentions légales",
    sections: [
      { t: "Éditeur du site", p: `FIDELEM, ${CONTACT.adresse}, ${CONTACT.pays}. Téléphone : ${CONTACT.telephone}. Site : ${CONTACT.site}. Forme juridique, capital, numéro RCCM et IFU : à compléter.` },
      { t: "Directeur de la publication", p: "À compléter." },
      { t: "Hébergement", p: "Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis." },
      { t: "Propriété intellectuelle", p: "Les contenus de ce site (textes, visuels, logo) sont la propriété de FIDELEM ou de leurs auteurs. Toute reproduction sans autorisation est interdite." },
    ],
  },
  confidentialite: {
    titre: "Confidentialité",
    sections: [
      { t: "Données collectées", p: "Lorsque vous remplissez un formulaire, nous collectons vos coordonnées, votre zone, vos disponibilités et les informations sur votre projet." },
      { t: "Utilisation", p: "Ces données servent uniquement à traiter votre demande et à organiser votre rendez-vous. Elles sont transmises au conseiller FIDELEM de votre zone et, avec votre accord, aux partenaires financiers concernés par votre dossier." },
      { t: "Conservation et droits", p: "Vous pouvez demander l'accès, la rectification ou la suppression de vos données en écrivant à " + CONTACT.email + ". Durée de conservation et références légales : à compléter." },
    ],
  },
  conditions: {
    titre: "Conditions d'utilisation",
    sections: [
      { t: "Objet", p: "Ces conditions encadrent l'utilisation du site FIDELEM, des espaces client et conseiller et des formulaires de demande." },
      { t: "Simulations", p: "Les simulations de financement sont indicatives. Elles ne constituent ni une offre ni un engagement de financement." },
      { t: "Formation de conseiller", p: "Les frais d'inscription ne sont pas remboursables. Les frais de formation sont payables en 3 fois et remboursés à la signature du contrat après validation de la formation." },
      { t: "Compte", p: "Vous êtes responsable de la confidentialité de vos identifiants. Le texte complet est à compléter par FIDELEM." },
    ],
  },
};

export function Legal({ page }: { page: keyof typeof LEGAL }) {
  const d = LEGAL[page];
  return (
    <Gabarit>
      <EnTetePage label="Informations légales" lignes={[d.titre]} />
      <section className="f-section" style={{ paddingTop: 0 }}>
        <div className="f-conteneur" style={{ maxWidth: 820 }}>
          {d.sections.map((s) => (
            <div key={s.t} style={{ padding: "24px 0", borderTop: "1px dashed var(--f-guide)", display: "grid", gap: 10 }}>
              <h2 className="f-titre-m">{s.t}</h2>
              <p className="f-texte">{s.p}</p>
            </div>
          ))}
        </div>
      </section>
    </Gabarit>
  );
}

export function PageIntrouvable() {
  return (
    <Gabarit sansPied>
      <section className="f-page-tete" style={{ minHeight: "100vh" }}>
        <div className="f-conteneur">
          <MotBarres mot="404" variante="or" />
          <h1 className="f-titre-xl" style={{ marginTop: 24 }}>Cette page n'existe pas.</h1>
          <p className="f-chapo" style={{ marginTop: 20 }}>Le lien est peut-être ancien. Voici où aller :</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 32 }}>
            <Link className="f-btn f-btn--or f-btn--grand" to="/">Accueil</Link>
            <Link className="f-btn f-btn--gris f-btn--grand" to="/services">Services</Link>
            <Link className="f-btn f-btn--gris f-btn--grand" to="/contact">Contact</Link>
          </div>
        </div>
      </section>
    </Gabarit>
  );
}
