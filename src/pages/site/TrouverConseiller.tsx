import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, ArrowRight, X, Loader2 } from "lucide-react";
import Gabarit from "@/components/site/Gabarit";
import EnTetePage from "@/components/site/EnTetePage";
import { FINANCEMENTS, FORMATIONS, ZONES } from "@/donnees/fidelem";
import { envoyerDemandeFinancement, rechercherConseillers, type ConseillerPublic } from "@/config/apiPublic";
import {
  BlocCoordonnees, BlocRendezVous, BoutonEnvoi, Champ, Confirmation, MessageErreurEnvoi,
  coordonneesVides, rendezVousVide, useEnvoi, validerCoordonnees, validerRendezVous,
} from "@/components/site/Formulaires";

type Recherche = "repos" | "chargement" | "resultats" | "vide" | "erreur";

function DemandeRendezVous({ zone, conseiller, onFermer }: { zone: string; conseiller?: ConseillerPublic; onFermer?: () => void }) {
  const [coord, setCoord] = useState(coordonneesVides());
  const [rdv, setRdv] = useState(rendezVousVide(zone));
  const [financement, setFinancement] = useState<string>(FINANCEMENTS[0].slug);
  const message = "";
  const { etat, erreurs, envoyer } = useEnvoi();
  if (etat === "succes") return (
    <Confirmation titre="Demande envoyée.">
      {conseiller ? `${conseiller.prenom} vous recontacte` : "Un responsable FIDELEM attribue votre demande à un conseiller et vous recontacte"} pour confirmer votre rendez-vous du {rdv.date}.
    </Confirmation>
  );
  return (
    <form className="f-form" noValidate onSubmit={(e) => { e.preventDefault(); envoyer({ ...validerCoordonnees(coord), ...validerRendezVous(rdv) }, () => envoyerDemandeFinancement({ ...coord, financement, montant: 0, duree: 0, objet: "Prise de rendez-vous", message, conseillerId: conseiller?.id, rendezVous: rdv })); }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start" }}>
        <div>
          <p className="f-label f-label--doux">{conseiller ? "Rendez-vous avec" : "Demande transmise au responsable de zone"}</p>
          <p className="f-titre-m">{conseiller ? `${conseiller.prenom} ${conseiller.nom.charAt(0)}.` : zone}</p>
        </div>
        {onFermer && <button type="button" className="f-btn f-btn--gris f-dock__plus" onClick={onFermer} aria-label="Fermer"><X /></button>}
      </div>
      <Champ libelle="Votre besoin">
        <select id="f-besoin" value={financement} onChange={(e) => setFinancement(e.target.value)}>
          {FINANCEMENTS.map((f) => <option key={f.slug} value={f.slug}>{f.nom}</option>)}
          <option value="conseil">Conseil financier, épargne</option>
        </select>
      </Champ>
      <BlocCoordonnees valeur={coord} onChange={setCoord} erreurs={erreurs} />
      <BlocRendezVous valeur={rdv} onChange={setRdv} erreurs={erreurs} />
      {etat === "erreur" && <MessageErreurEnvoi />}
      <BoutonEnvoi etat={etat}>Demander le rendez-vous</BoutonEnvoi>
    </form>
  );
}

export default function TrouverConseiller() {
  const [saisie, setSaisie] = useState("");
  const [zone, setZone] = useState("");
  const [etat, setEtat] = useState<Recherche>("repos");
  const [conseillers, setConseillers] = useState<ConseillerPublic[]>([]);
  const [choisi, setChoisi] = useState<ConseillerPublic | null>(null);
  const suggestions = saisie.length > 0 ? ZONES.filter((z) => z.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").includes(saisie.toLowerCase().normalize("NFD").replace(/\p{M}/gu, ""))).slice(0, 6) : [];

  const chercher = async (z: string) => {
    setZone(z); setSaisie(z); setChoisi(null); setEtat("chargement");
    try {
      const r = await rechercherConseillers(z);
      setConseillers(r);
      setEtat(r.length ? "resultats" : "vide");
    } catch { setEtat("erreur"); }
  };

  return (
    <Gabarit>
      <EnTetePage label="Conseiller Financier · près de chez vous" lignes={["Trouver", <em key="e">un conseiller.</em>]} chapo="Indiquez votre commune." />

      <section className="f-section" style={{ paddingTop: 0 }}>
        <div className="f-conteneur">
          <form className="f-recherche f-guide" role="search" onSubmit={(e) => { e.preventDefault(); const z = ZONES.find((x) => x.toLowerCase() === saisie.toLowerCase()) ?? suggestions[0]; if (z) chercher(z); }}>
            <label className="f-recherche__champ">
              <span className="f-sr">Votre commune</span>
              <MapPin aria-hidden="true" />
              <input id="f-recherche" list="f-zones" placeholder="Votre commune, ex. Abomey-Calavi" value={saisie} onChange={(e) => setSaisie(e.target.value)} autoComplete="off" />
              <datalist id="f-zones">{ZONES.map((z) => <option key={z} value={z} />)}</datalist>
            </label>
            <button className="f-btn f-btn--or f-btn--grand" type="submit"><Search /> Rechercher</button>
          </form>
          <div className="f-zones-rapides">
            <span className="f-label f-label--doux">Communes fréquentes</span>
            {ZONES.slice(0, 8).map((z) => <button key={z} type="button" className={`f-puce ${zone === z ? "f-puce--encre" : ""}`} onClick={() => chercher(z)}>{z}</button>)}
          </div>

          <div className="f-resultats" aria-live="polite">
            {etat === "repos" && (
              <div className="f-vide f-guide">
                <p className="f-titre-m">Choisissez votre commune pour commencer.</p>
                
              </div>
            )}
            {etat === "chargement" && <p className="f-texte" style={{ display: "flex", gap: 10, alignItems: "center" }}><Loader2 className="animate-spin" /> Recherche des conseillers de {zone}…</p>}
            {etat === "resultats" && (
              <>
                <p className="f-label">{conseillers.length} conseiller{conseillers.length > 1 ? "s" : ""} à {zone}</p>
                <div className="f-conseillers">
                  {conseillers.map((c) => {
                    const niveau = FORMATIONS.find((f) => f.id === c.niveau);
                    return (
                      <article key={c.id} className="f-conseiller f-carte f-carte--blanche">
                        <div className="f-conseiller__avatar" aria-hidden="true">{c.photo ? <img src={c.photo} alt="" /> : `${c.prenom[0]}${c.nom[0]}`}</div>
                        <div>
                          <h3 className="f-titre-m">{c.prenom} {c.nom.charAt(0)}.</h3>
                          <p className="f-label f-label--doux">{c.zone}{niveau ? ` · CF ${niveau.nom}` : ""}</p>
                        </div>
                        <ul className="f-puces">{c.financements.map((f) => <li key={f} className="f-puce f-puce--or">{f}</li>)}</ul>
                        <button type="button" className="f-btn f-btn--encre" onClick={() => setChoisi(c)}>Prendre rendez-vous <ArrowRight /></button>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
            {(etat === "vide" || etat === "erreur") && (
              <div className="f-demande">
                <div className="f-demande__cote">
                  <p className="f-titre-m">{etat === "vide" ? `Pas encore de conseiller disponible à ${zone}.` : "La recherche n'est pas disponible pour le moment."}</p>
                  <p className="f-texte">Laissez votre demande : un responsable FIDELEM l'attribue au conseiller le plus proche et vous recontacte.</p>
                </div>
                <div className="f-carte"><DemandeRendezVous zone={zone} /></div>
              </div>
            )}
            {choisi && (
              <div className="f-carte" style={{ marginTop: 24 }}>
                <DemandeRendezVous zone={zone} conseiller={choisi} onFermer={() => setChoisi(null)} />
              </div>
            )}
          </div>
          <p className="f-note" style={{ marginTop: 40 }}>Vous êtes conseiller ? <Link to="/espace-conseiller/connexion" style={{ textDecoration: "underline" }}>Accédez à votre espace</Link>.</p>
        </div>
      </section>
    </Gabarit>
  );
}
