import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { EtatVide, PastilleStatut, TetePage } from "@/components/espace/CadreEspace";
import { formatFcfa } from "@/donnees/fidelem";
import { STATUTS, ajouterNote, changerStatut, confirmerRendezVous, prendreEnCharge, type Demande, type Statut } from "@/config/apiEspace";
import { lireErreur } from "@/config/http";
import { ORIGINES, dateCourte, nomFinancement, rdvTexte } from "./demandesOutils";

const CRENEAUX = ["Matin (8 h – 12 h)", "Midi (12 h – 14 h)", "Après-midi (14 h – 17 h)", "Fin de journée (17 h – 19 h)"];
const aujourdhui = () => new Date().toISOString().slice(0, 10);

/* ----------------------------- Liste ----------------------------- */

export function TableDemandes({ demandes, vide, compact = false, base = "/espace-conseiller/demandes", avecConseiller = false }: {
  demandes: Demande[]; vide: React.ReactNode; compact?: boolean; base?: string; avecConseiller?: boolean;
}) {
  const nav = useNavigate();
  if (!demandes.length) return <>{vide}</>;
  const ouvrir = (d: Demande) => nav(`${base}/${d.id}`);
  return (
    <>
      <div className={`f-table-wrap f-defile-x ${compact ? "est-masque" : ""}`}>
        <table className="f-table">
          <thead><tr><th>Usager</th><th>Financement</th><th>Montant</th><th>Zone</th>{avecConseiller ? <th>Conseiller</th> : <th>Rendez-vous</th>}<th>Statut</th><th>Reçue le</th></tr></thead>
          <tbody>
            {demandes.map((d) => (
              <tr key={d.id} onClick={() => ouvrir(d)} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && ouvrir(d)}>
                <td><span className="f-table__usager"><strong style={{ fontWeight: 500 }}>{d.usager.nom}</strong><small>{d.objet}</small></span></td>
                <td>{nomFinancement(d.financement)}</td>
                <td className="num">{d.montant ? formatFcfa(d.montant) : "—"}</td>
                <td>{d.zone ?? "—"}</td>
                {avecConseiller ? <td>{d.conseiller?.nom ?? "Non attribuée"}</td> : <td>{rdvTexte(d)}</td>}
                <td><PastilleStatut statut={d.statut} /></td>
                <td className="num">{dateCourte(d.creeLe)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={`f-cartes-mobile ${compact ? "est-visible" : ""}`}>
        {demandes.map((d) => (
          <button key={d.id} type="button" className="f-carte-demande" onClick={() => ouvrir(d)}>
            <div><strong style={{ fontWeight: 500 }}>{d.usager.nom}</strong><PastilleStatut statut={d.statut} /></div>
            <div><span>{nomFinancement(d.financement)} · {d.montant ? formatFcfa(d.montant) : "montant à préciser"}</span></div>
            <div><span className="f-note">{d.zone ?? ""} · {avecConseiller ? (d.conseiller?.nom ?? "non attribuée") : `RDV ${rdvTexte(d)}`}</span></div>
          </button>
        ))}
      </div>
    </>
  );
}

/* ----------------------------- Fiche ----------------------------- */

type Droits = {
  /** Le conseiller peut prendre la demande (nouvelle, de sa zone ou adressée à lui). */
  prendreEnCharge?: boolean;
  /** Statut et notes : le conseiller qui suit le dossier, ou le responsable. */
  modifier: boolean;
  /** Rendez-vous : réservé au conseiller qui suit le dossier. */
  fixerRendezVous?: boolean;
};

export function FicheDemande({ demande: d, retour, droits, auteur, conseillerId, onMaj }: {
  demande: Demande;
  retour: { chemin: string; libelle: string };
  droits: Droits;
  /** Nom affiché sur les notes ajoutées. */
  auteur: string;
  /** Identifiant du conseiller connecté, pour la prise en charge. */
  conseillerId?: string;
  onMaj: (d: Demande) => void;
}) {
  const [note, setNote] = useState("");
  const [rdvDate, setRdvDate] = useState(d.rendezVous?.date ?? "");
  const [rdvCreneau, setRdvCreneau] = useState(d.rendezVous?.creneau ?? CRENEAUX[0]);
  const [action, setAction] = useState("");

  useEffect(() => { setRdvDate(d.rendezVous?.date ?? ""); setRdvCreneau(d.rendezVous?.creneau ?? CRENEAUX[0]); }, [d.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const executer = async (nom: string, f: () => Promise<unknown>, apres: Demande, ok: string) => {
    setAction(nom);
    try { await f(); onMaj(apres); toast.success(ok); return true; } catch (e) {
      toast.error(lireErreur(e).message ?? "L'action n'a pas abouti. Réessayez dans un instant.");
      return false;
    } finally { setAction(""); }
  };
  const tel = d.usager.telephone?.replace(/\s/g, "");
  const enAttenteDePrise = d.statut === "Nouvelle" && !droits.modifier;

  return (
    <>
      <Link className="f-lien" to={retour.chemin} style={{ width: "fit-content" }}><ArrowLeft /> {retour.libelle}</Link>
      <TetePage sur={`${nomFinancement(d.financement)} · reçue le ${dateCourte(d.creeLe)}`} titre={d.usager.nom} actions={<PastilleStatut statut={d.statut} />} />
      <div className="f-fiche">
        <div style={{ display: "grid", gap: 16 }}>
          <section className="f-panel">
            <h2 className="f-titre-m">Le projet</h2>
            <dl className="f-dl">
              <div><dt>Financement</dt><dd>{nomFinancement(d.financement)}</dd></div>
              <div><dt>Objet</dt><dd>{d.objet || "—"}</dd></div>
              <div><dt>Montant</dt><dd>{d.montant ? formatFcfa(d.montant) : "À préciser"}</dd></div>
              <div><dt>Durée</dt><dd>{d.duree ? `${d.duree} mois` : "À préciser"}</dd></div>
              <div><dt>Zone</dt><dd>{d.zone ?? "—"}</dd></div>
              <div><dt>Source</dt><dd>{ORIGINES[d.origine]}</dd></div>
              <div><dt>Conseiller</dt><dd>{d.conseiller?.nom ?? "Non attribuée"}</dd></div>
            </dl>
            {d.message && <p className="f-texte" style={{ padding: 16, background: "var(--f-papier)", borderRadius: 8, maxWidth: "none" }}>« {d.message} »</p>}
          </section>
          <section className="f-panel">
            <h2 className="f-titre-m">Disponibilités de l'usager</h2>
            <dl className="f-dl">
              <div><dt>Mode souhaité</dt><dd>{d.rendezVous?.mode ?? "—"}</dd></div>
              <div><dt>Date et créneau</dt><dd>{rdvTexte(d)}</dd></div>
              <div><dt>Autres jours</dt><dd>{d.rendezVous?.autresDisponibilites?.join(", ") || "—"}</dd></div>
              <div><dt>Contact préféré</dt><dd>{d.rendezVous?.contactPrefere ?? "—"}</dd></div>
            </dl>
          </section>
          <section className="f-panel">
            <h2 className="f-titre-m">Historique et notes</h2>
            <ul className="f-historique">
              <li><span>Demande reçue</span><small>{dateCourte(d.creeLe)}</small></li>
              {(d.notes ?? []).map((n, i) => <li key={n.id ?? i}><span>{n.texte}</span><small>{dateCourte(n.date)}{n.auteur ? ` · ${n.auteur}` : ""}</small></li>)}
            </ul>
            {droits.modifier ? (
              <form className="f-form" style={{ gap: 10 }} onSubmit={async (e) => {
                e.preventDefault();
                if (!note.trim()) return;
                const ajoutee = { texte: note.trim(), date: new Date().toISOString(), auteur };
                if (await executer("note", () => ajouterNote(d, ajoutee.texte), { ...d, notes: [...(d.notes ?? []), ajoutee] }, "Note enregistrée.")) setNote("");
              }}>
                <label className="f-champ"><span>Ajouter une note</span><textarea id="f-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ex. : pièces reçues, en attente du devis." style={{ minHeight: 90, background: "var(--f-papier)" }} /></label>
                <button className="f-btn f-btn--gris" type="submit" disabled={action === "note" || !note.trim()} style={{ width: "fit-content" }}>Enregistrer la note</button>
              </form>
            ) : enAttenteDePrise && <p className="f-note">Prenez la demande en charge pour ajouter des notes.</p>}
          </section>
        </div>
        <aside style={{ display: "grid", gap: 16 }}>
          <section className="f-panel">
            <h2 className="f-titre-m">Contacter</h2>
            <div style={{ display: "grid", gap: 8 }}>
              {tel && <a className="f-btn f-btn--icone f-btn--encre" href={`tel:${tel}`}><Phone /> {d.usager.telephone}</a>}
              {tel && <a className="f-btn f-btn--icone f-btn--gris" href={`https://wa.me/229${tel.replace(/^\+?229/, "")}`} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp</a>}
              {d.usager.email && <a className="f-btn f-btn--icone f-btn--gris" href={`mailto:${d.usager.email}`}><Mail /> {d.usager.email}</a>}
              {!tel && !d.usager.email && <p className="f-note">Coordonnées non transmises.</p>}
            </div>
          </section>
          {droits.prendreEnCharge && d.statut === "Nouvelle" && (
            <section className="f-panel" style={{ background: "var(--f-or-clair)" }}>
              <h2 className="f-titre-m">Prendre en charge</h2>
              <p className="f-note">La demande sort de la liste de zone et devient votre dossier. Vous pourrez alors fixer le rendez-vous et suivre son statut.</p>
              <button type="button" className="f-btn f-btn--or" disabled={!!action} onClick={() => executer("prise", () => prendreEnCharge(d), { ...d, statut: "Prise en charge", conseillerId }, "Demande prise en charge.")}>Prendre en charge</button>
            </section>
          )}
          {droits.fixerRendezVous && droits.modifier && (
            <section className="f-panel">
              <h2 className="f-titre-m">Rendez-vous</h2>
              <div className="f-grille-2">
                <label className="f-champ"><span>Date</span><input id="f-rdv-date" type="date" min={aujourdhui()} value={rdvDate} onChange={(e) => setRdvDate(e.target.value)} style={{ background: "var(--f-papier)" }} /></label>
                <label className="f-champ"><span>Créneau</span><select id="f-rdv-creneau" value={rdvCreneau} onChange={(e) => setRdvCreneau(e.target.value)} style={{ background: "var(--f-papier)" }}>{CRENEAUX.map((c) => <option key={c}>{c}</option>)}</select></label>
              </div>
              <button type="button" className="f-btn f-btn--encre" disabled={!rdvDate || !!action} onClick={() => executer("rdv", () => confirmerRendezVous(d, { date: rdvDate, creneau: rdvCreneau }), { ...d, statut: "Rendez-vous fixé", rendezVous: { ...d.rendezVous, date: rdvDate, creneau: rdvCreneau } },
                d.usager.email ? "Rendez-vous fixé. L'usager le reçoit par e-mail." : "Rendez-vous fixé. L'usager n'a pas d'e-mail : appelez-le pour le prévenir.")}>
                Fixer ce rendez-vous
              </button>
            </section>
          )}
          {droits.modifier && (
            <section className="f-panel">
              <h2 className="f-titre-m">Statut</h2>
              <div className="f-choix" role="radiogroup" aria-label="Statut de la demande">
                {STATUTS.map((s) => (
                  <label key={s}><input type="radio" name="statut" checked={d.statut === s} disabled={!!action} onChange={() => executer("statut", () => changerStatut(d, s as Statut), { ...d, statut: s as Statut }, `Statut : ${s}.`)} /><span>{s}</span></label>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </>
  );
}

export function DemandeIntrouvable({ retour }: { retour: { chemin: string; libelle: string } }) {
  return <EtatVide titre="Demande introuvable." texte="Elle a peut-être été prise en charge par un autre conseiller, ou supprimée." action={<Link className="f-btn f-btn--gris" to={retour.chemin}>{retour.libelle}</Link>} />;
}
