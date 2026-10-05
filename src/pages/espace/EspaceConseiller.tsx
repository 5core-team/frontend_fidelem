import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { LayoutDashboard, Inbox, Users, CalendarDays, UserCircle, Search, ArrowLeft, Phone, MessageCircle, Mail, Loader2, UserPlus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import CadreEspace, { Chiffre, EtatVide, PastilleStatut, TetePage } from "@/components/espace/CadreEspace";
import { FINANCEMENTS, ZONES, formatFcfa } from "@/donnees/fidelem";
import {
  STATUTS, ajouterNote, changerStatut, clientsConseiller, confirmerRendezVous, demandesDeMaZone, mesDemandes, prendreEnCharge,
  type Demande, type Statut,
} from "@/config/apiEspace";
import { AddClientForm } from "@/components/AddClientForm";
import { AddCreditRequestForm } from "@/components/AddCreditRequestForm";
import { EditProfileForm } from "@/components/EditProfileForm";

/* ----------------------------- Données partagées ----------------------------- */

type Donnees = {
  zone: Demande[]; miennes: Demande[]; clients: Record<string, unknown>[];
  chargement: boolean; zoneIndisponible: boolean;
  recharger: () => void; maj: (d: Demande) => void;
};
const Ctx = createContext<Donnees | null>(null);
const useDonnees = () => useContext(Ctx)!;

function Fournisseur({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [zone, setZone] = useState<Demande[]>([]);
  const [miennes, setMiennes] = useState<Demande[]>([]);
  const [clients, setClients] = useState<Record<string, unknown>[]>([]);
  const [chargement, setChargement] = useState(true);
  const [zoneIndisponible, setZoneIndisponible] = useState(false);

  const recharger = useCallback(async () => {
    if (!user) return;
    setChargement(true);
    const [z, m, c] = await Promise.allSettled([demandesDeMaZone(), mesDemandes(user.id), clientsConseiller(user.id)]);
    setZoneIndisponible(z.status === "rejected");
    setZone(z.status === "fulfilled" ? z.value : []);
    setMiennes(m.status === "fulfilled" ? m.value : []);
    setClients(c.status === "fulfilled" ? c.value : []);
    if (m.status === "rejected") toast.error("Impossible de charger vos demandes pour le moment.");
    setChargement(false);
  }, [user]);

  useEffect(() => { recharger(); }, [recharger]);
  const maj = (d: Demande) => {
    setZone((l) => l.map((x) => (x.id === d.id ? d : x)));
    setMiennes((l) => (l.some((x) => x.id === d.id) ? l.map((x) => (x.id === d.id ? d : x)) : [d, ...l]));
  };
  return <Ctx.Provider value={{ zone, miennes, clients, chargement, zoneIndisponible, recharger, maj }}>{children}</Ctx.Provider>;
}

const nomFinancement = (f: string) => FINANCEMENTS.find((x) => x.slug === f)?.court ?? f;
const dateCourte = (s?: string) => (s ? new Date(s).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : "—");
const rdvTexte = (d: Demande) => (d.rendezVous?.date ? `${dateCourte(d.rendezVous.date)} · ${d.rendezVous.creneau?.split(" (")[0] ?? ""}` : "À fixer");

/* ----------------------------- Liste de demandes ----------------------------- */

export function TableDemandes({ demandes, vide, compact = false, base = "/espace-conseiller/demandes" }: { demandes: Demande[]; vide: React.ReactNode; compact?: boolean; base?: string }) {
  const nav = useNavigate();
  if (!demandes.length) return <>{vide}</>;
  const ouvrir = (d: Demande) => nav(`${base}/${d.source}-${d.id}`);
  return (
    <>
      <div className={`f-table-wrap f-defile-x ${compact ? "est-masque" : ""}`}>
        <table className="f-table">
          <thead><tr><th>Usager</th><th>Financement</th><th>Montant</th><th>Zone</th><th>Rendez-vous</th><th>Statut</th><th>Reçue le</th></tr></thead>
          <tbody>
            {demandes.map((d) => (
              <tr key={`${d.source}-${d.id}`} onClick={() => ouvrir(d)} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && ouvrir(d)}>
                <td><span className="f-table__usager"><strong style={{ fontWeight: 500 }}>{d.usager.nom}</strong><small>{d.objet}</small></span></td>
                <td>{nomFinancement(d.financement)}</td>
                <td className="num">{d.montant ? formatFcfa(d.montant) : "—"}</td>
                <td>{d.zone ?? "—"}</td>
                <td>{rdvTexte(d)}</td>
                <td><PastilleStatut statut={d.statut} /></td>
                <td className="num">{dateCourte(d.creeLe)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={`f-cartes-mobile ${compact ? "est-visible" : ""}`}>
        {demandes.map((d) => (
          <button key={`${d.source}-${d.id}`} type="button" className="f-carte-demande" onClick={() => ouvrir(d)}>
            <div><strong style={{ fontWeight: 500 }}>{d.usager.nom}</strong><PastilleStatut statut={d.statut} /></div>
            <div><span>{nomFinancement(d.financement)} · {d.montant ? formatFcfa(d.montant) : "montant à préciser"}</span></div>
            <div><span className="f-note">{d.zone ?? ""} · RDV {rdvTexte(d)}</span></div>
          </button>
        ))}
      </div>
    </>
  );
}

/* ----------------------------- Tableau de bord ----------------------------- */

function TableauDeBord() {
  const { user } = useAuth();
  const { zone, miennes, chargement, zoneIndisponible } = useDonnees();
  const enCours = miennes.filter((d) => !["Acceptée", "Refusée"].includes(d.statut));
  const rdv = miennes.filter((d) => d.statut === "Rendez-vous fixé" || d.rendezVous?.date).filter((d) => !d.rendezVous?.date || new Date(d.rendezVous.date) >= new Date(new Date().toDateString()));
  const finalisees = miennes.filter((d) => d.statut === "Acceptée");
  return (
    <>
      <TetePage sur="Espace Conseiller" titre={`Bonjour ${user?.name ?? ""}.`} texte="Voici les demandes de votre zone et vos prochains rendez-vous." actions={<Link className="f-btn f-btn--icone f-btn--or" to="/espace-conseiller/demandes">Voir les demandes</Link>} />
      {chargement ? <p className="f-texte" style={{ display: "flex", gap: 10 }}><Loader2 className="animate-spin" /> Chargement</p> : (
        <>
          <div className="f-chiffres">
            <Chiffre accent libelle="Nouvelles dans ma zone" valeur={zoneIndisponible ? "—" : zone.length} aide="À prendre en charge" />
            <Chiffre libelle="Mes dossiers en cours" valeur={enCours.length} />
            <Chiffre libelle="Rendez-vous à venir" valeur={rdv.length} />
            <Chiffre libelle="Financements acceptés" valeur={finalisees.length} />
          </div>
          <div className="f-deux-col">
            <section className="f-panel">
              <div className="f-panel__tete"><h2 className="f-titre-m">Nouvelles demandes de ma zone</h2><Link className="f-lien" to="/espace-conseiller/demandes">Tout voir</Link></div>
              <TableDemandes compact demandes={zone.slice(0, 5)} vide={<EtatVide titre={zoneIndisponible ? "Les demandes de zone arrivent bientôt." : "Aucune nouvelle demande."} texte={zoneIndisponible ? "Le service qui transmet les demandes du site à votre zone n'est pas encore activé. Vos dossiers en cours restent accessibles." : "Les nouvelles demandes des usagers de votre zone apparaîtront ici."} />} />
            </section>
            <section className="f-panel">
              <div className="f-panel__tete"><h2 className="f-titre-m">Prochains rendez-vous</h2><Link className="f-lien" to="/espace-conseiller/rendez-vous">Agenda</Link></div>
              {rdv.length ? (
                <div className="f-rdv-jour">
                  {rdv.slice(0, 4).map((d) => (
                    <Link key={d.id} to={`/espace-conseiller/demandes/${d.source}-${d.id}`} className="f-rdv" style={{ background: "var(--f-papier)" }}>
                      <span className="f-rdv__heure">{rdvTexte(d)}</span>
                      <span>{d.usager.nom}<br /><small className="f-note">{d.rendezVous?.mode ?? ""}</small></span>
                      <PastilleStatut statut={d.statut} />
                    </Link>
                  ))}
                </div>
              ) : <EtatVide titre="Aucun rendez-vous." texte="Confirmez un rendez-vous depuis la fiche d'une demande." />}
            </section>
          </div>
        </>
      )}
    </>
  );
}

/* ----------------------------- Liste des demandes ----------------------------- */

function ListeDemandes() {
  const { zone, miennes, chargement, zoneIndisponible, clients, recharger } = useDonnees();
  const [onglet, setOnglet] = useState<"zone" | "miennes" | "toutes">("zone");
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [statut, setStatut] = useState("");
  const [nouveau, setNouveau] = useState(false);
  const base = onglet === "zone" ? zone : onglet === "miennes" ? miennes : [...zone, ...miennes.filter((m) => !zone.some((z) => z.id === m.id))];
  const filtrees = useMemo(() => base.filter((d) =>
    (!q || `${d.usager.nom} ${d.objet} ${d.zone ?? ""}`.toLowerCase().includes(q.toLowerCase())) &&
    (!type || d.financement === type) && (!statut || d.statut === statut),
  ), [base, q, type, statut]);

  return (
    <>
      <TetePage sur="Espace Conseiller" titre="Demandes" texte="Les demandes de votre zone et les dossiers que vous suivez." actions={<button type="button" className="f-btn f-btn--icone f-btn--encre" onClick={() => setNouveau(true)}><Plus /> Nouvelle demande</button>} />
      <section className="f-panel">
        <div className="f-panel__tete">
          <div className="f-onglets" role="tablist">
            {([["zone", "Nouvelles de ma zone", zone.length], ["miennes", "Mes demandes", miennes.length], ["toutes", "Toutes", undefined]] as const).map(([k, l, n]) => (
              <button key={k} type="button" role="tab" aria-selected={onglet === k} onClick={() => setOnglet(k)}>{l}{n !== undefined && <em>{n}</em>}</button>
            ))}
          </div>
        </div>
        <div className="f-filtres">
          <label className="f-recherche__champ"><Search aria-hidden="true" /><span className="f-sr">Rechercher</span><input id="f-q-demandes" placeholder="Usager, projet, quartier" value={q} onChange={(e) => setQ(e.target.value)} /></label>
          <select aria-label="Type de financement" value={type} onChange={(e) => setType(e.target.value)}><option value="">Tous les financements</option>{FINANCEMENTS.map((f) => <option key={f.slug} value={f.slug}>{f.court}</option>)}</select>
          <select aria-label="Statut" value={statut} onChange={(e) => setStatut(e.target.value)}><option value="">Tous les statuts</option>{STATUTS.map((s) => <option key={s}>{s}</option>)}</select>
        </div>
        {chargement ? <p className="f-texte" style={{ display: "flex", gap: 10 }}><Loader2 className="animate-spin" /> Chargement</p> : (
          <TableDemandes demandes={filtrees} vide={<EtatVide titre={onglet === "zone" && zoneIndisponible ? "Les demandes de zone arrivent bientôt." : "Aucune demande."} texte={onglet === "zone" && zoneIndisponible ? "Le service qui transmet les demandes du site à votre zone n'est pas encore activé." : "Aucune demande ne correspond à ces filtres."} />} />
        )}
      </section>
      <AddCreditRequestForm open={nouveau} onOpenChange={setNouveau} isAdvisor clients={clients as { id: string; name?: string; last_name?: string }[]} onCree={recharger} />
    </>
  );
}

/* ----------------------------- Fiche d'une demande ----------------------------- */

function FicheDemande() {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const { zone, miennes, chargement, maj } = useDonnees();
  const [note, setNote] = useState("");
  const [rdvDate, setRdvDate] = useState("");
  const [rdvCreneau, setRdvCreneau] = useState("Matin (8 h – 12 h)");
  const [action, setAction] = useState("");
  const d = [...zone, ...miennes].find((x) => `${x.source}-${x.id}` === id);

  useEffect(() => { if (d?.rendezVous?.date) setRdvDate(d.rendezVous.date); if (d?.rendezVous?.creneau) setRdvCreneau(d.rendezVous.creneau); }, [d?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (chargement) return <p className="f-texte" style={{ display: "flex", gap: 10 }}><Loader2 className="animate-spin" /> Chargement</p>;
  if (!d) return <EtatVide titre="Demande introuvable." texte="Elle a peut-être été prise en charge par un autre conseiller." action={<Link className="f-btn f-btn--gris" to="/espace-conseiller/demandes">Retour aux demandes</Link>} />;

  const executer = async (nom: string, f: () => Promise<unknown>, apres: Demande, ok: string) => {
    setAction(nom);
    try { await f(); maj(apres); toast.success(ok); } catch { toast.error("L'action n'a pas abouti. Réessayez dans un instant."); } finally { setAction(""); }
  };
  const tel = d.usager.telephone?.replace(/\s/g, "");

  return (
    <>
      <Link className="f-lien" to="/espace-conseiller/demandes" style={{ width: "fit-content" }}><ArrowLeft /> Demandes</Link>
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
              <div><dt>Source</dt><dd>{d.source === "site" ? "Formulaire du site" : "Créée dans l'espace"}</dd></div>
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
              {(d.notes ?? []).map((n, i) => <li key={i}><span>{n.texte}</span><small>{dateCourte(n.date)}{n.auteur ? ` · ${n.auteur}` : ""}</small></li>)}
            </ul>
            <form className="f-form" style={{ gap: 10 }} onSubmit={(e) => { e.preventDefault(); if (!note.trim()) return; const n = { texte: note, date: new Date().toISOString(), auteur: `${user?.name} ${user?.last_name}` }; executer("note", () => ajouterNote(d, note), { ...d, notes: [...(d.notes ?? []), n] }, "Note ajoutée."); setNote(""); }}>
              <label className="f-champ"><span>Ajouter une note</span><textarea id="f-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ex. : pièces reçues, en attente du devis." style={{ minHeight: 90, background: "var(--f-papier)" }} /></label>
              <button className="f-btn f-btn--gris" type="submit" disabled={action === "note"} style={{ width: "fit-content" }}>Enregistrer la note</button>
            </form>
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
          {d.statut === "Nouvelle" && (
            <section className="f-panel" style={{ background: "var(--f-or-clair)" }}>
              <h2 className="f-titre-m">Prendre en charge</h2>
              <p className="f-note">La demande sort de la liste de zone et devient votre dossier.</p>
              <button type="button" className="f-btn f-btn--or" disabled={!!action} onClick={() => executer("prise", () => prendreEnCharge(d), { ...d, statut: "Prise en charge", conseillerId: user?.id }, "Demande prise en charge.")}>Prendre en charge</button>
            </section>
          )}
          <section className="f-panel">
            <h2 className="f-titre-m">Rendez-vous</h2>
            <div className="f-grille-2">
              <label className="f-champ"><span>Date</span><input id="f-rdv-date" type="date" value={rdvDate} onChange={(e) => setRdvDate(e.target.value)} style={{ background: "var(--f-papier)" }} /></label>
              <label className="f-champ"><span>Créneau</span><select id="f-rdv-creneau" value={rdvCreneau} onChange={(e) => setRdvCreneau(e.target.value)} style={{ background: "var(--f-papier)" }}>{["Matin (8 h – 12 h)", "Midi (12 h – 14 h)", "Après-midi (14 h – 17 h)", "Fin de journée (17 h – 19 h)"].map((c) => <option key={c}>{c}</option>)}</select></label>
            </div>
            <button type="button" className="f-btn f-btn--encre" disabled={!rdvDate || !!action} onClick={() => executer("rdv", () => confirmerRendezVous(d, { date: rdvDate, creneau: rdvCreneau }), { ...d, statut: "Rendez-vous fixé", rendezVous: { ...d.rendezVous, date: rdvDate, creneau: rdvCreneau } }, "Rendez-vous confirmé, l'usager est notifié.")}>
              {d.rendezVous?.date === rdvDate ? "Confirmer ce rendez-vous" : "Proposer ce créneau"}
            </button>
          </section>
          <section className="f-panel">
            <h2 className="f-titre-m">Statut</h2>
            <div className="f-choix">
              {STATUTS.map((s) => (
                <label key={s}><input type="radio" name="statut" checked={d.statut === s} disabled={!!action} onChange={() => executer("statut", () => changerStatut(d, s as Statut), { ...d, statut: s as Statut }, `Statut : ${s}.`)} /><span>{s}</span></label>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}

/* ----------------------------- Rendez-vous ----------------------------- */

function RendezVousPage() {
  const { miennes, chargement } = useDonnees();
  const avec = miennes.filter((d) => d.rendezVous?.date).sort((a, b) => (a.rendezVous!.date! < b.rendezVous!.date! ? -1 : 1));
  const parJour = avec.reduce<Record<string, Demande[]>>((acc, d) => { (acc[d.rendezVous!.date!] ||= []).push(d); return acc; }, {});
  return (
    <>
      <TetePage sur="Espace Conseiller" titre="Rendez-vous" texte="Vos rendez-vous confirmés et proposés, par jour." />
      {chargement ? <p className="f-texte"><Loader2 className="animate-spin" /></p> : Object.keys(parJour).length ? (
        Object.entries(parJour).map(([jour, liste]) => (
          <section key={jour} className="f-rdv-jour">
            <p className="f-label">{new Date(jour).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</p>
            {liste.map((d) => (
              <Link key={d.id} to={`/espace-conseiller/demandes/${d.source}-${d.id}`} className="f-rdv">
                <span className="f-rdv__heure">{d.rendezVous?.creneau ?? ""}</span>
                <span>{d.usager.nom} · {nomFinancement(d.financement)}<br /><small className="f-note">{d.rendezVous?.mode ?? ""}{d.zone ? ` · ${d.zone}` : ""}</small></span>
                <PastilleStatut statut={d.statut} />
              </Link>
            ))}
          </section>
        ))
      ) : <EtatVide titre="Aucun rendez-vous prévu." texte="Les rendez-vous que vous confirmez depuis la fiche d'une demande apparaissent ici." action={<Link className="f-btn f-btn--icone f-btn--gris" to="/espace-conseiller/demandes">Voir les demandes</Link>} />}
    </>
  );
}

/* ----------------------------- Clients ----------------------------- */

function Clients() {
  const { clients, chargement, recharger } = useDonnees();
  const [ajout, setAjout] = useState(false);
  const [q, setQ] = useState("");
  const liste = clients.filter((c) => `${c.name} ${c.last_name} ${c.email}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <TetePage sur="Espace Conseiller" titre="Mes clients" actions={<button type="button" className="f-btn f-btn--encre" onClick={() => setAjout(true)}><UserPlus /> Ajouter un client</button>} />
      <section className="f-panel">
        <div className="f-filtres"><label className="f-recherche__champ"><Search aria-hidden="true" /><span className="f-sr">Rechercher</span><input id="f-q-clients" placeholder="Nom ou e-mail" value={q} onChange={(e) => setQ(e.target.value)} /></label></div>
        {chargement ? <Loader2 className="animate-spin" /> : liste.length ? (
          <div className="f-defile-x">
            <table className="f-table">
              <thead><tr><th>Client</th><th>Téléphone</th><th>E-mail</th><th>Adresse</th></tr></thead>
              <tbody style={{ cursor: "default" }}>
                {liste.map((c) => (
                  <tr key={String(c.id)} style={{ cursor: "default" }}><td>{String(c.name ?? "")} {String(c.last_name ?? "")}</td><td>{String(c.phone ?? "—")}</td><td>{String(c.email ?? "—")}</td><td>{String(c.address ?? "—")}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <EtatVide titre="Aucun client." texte="Ajoutez un client pour créer son compte et suivre ses demandes." />}
      </section>
      <AddClientForm open={ajout} onOpenChange={(o: boolean) => { setAjout(o); if (!o) recharger(); }} />
    </>
  );
}

/* ----------------------------- Profil ----------------------------- */

function Profil() {
  const { user } = useAuth();
  const [edition, setEdition] = useState(false);
  const u = user as unknown as Record<string, string>;
  return (
    <>
      <TetePage sur="Espace Conseiller" titre="Mon profil" actions={<button type="button" className="f-btn f-btn--encre" onClick={() => setEdition(true)}>Modifier mon profil</button>} />
      <section className="f-panel">
        <dl className="f-dl">
          <div><dt>Nom</dt><dd>{user?.name} {user?.last_name}</dd></div>
          <div><dt>E-mail</dt><dd>{user?.email}</dd></div>
          <div><dt>Téléphone</dt><dd>{user?.phone || "—"}</dd></div>
          <div><dt>Adresse</dt><dd>{user?.address || "—"}</dd></div>
          <div><dt>Zone de gestion</dt><dd>{u?.zone || "Attribuée avec votre licence"}</dd></div>
          <div><dt>Niveau</dt><dd>{u?.niveau ? `CF ${u.niveau}` : "—"}</dd></div>
        </dl>
        <p className="f-note">La zone de gestion est attribuée par FIDELEM avec la licence de travail. Pour la modifier, contactez votre responsable. Zones couvertes : {ZONES.slice(0, 6).join(", ")}…</p>
      </section>
      <EditProfileForm open={edition} onOpenChange={setEdition} />
    </>
  );
}

/* ----------------------------- Espace ----------------------------- */

function Liens() {
  const { zone } = useDonnees();
  return [
    { libelle: "Tableau de bord", chemin: "/espace-conseiller", icone: LayoutDashboard, fin: true },
    { libelle: "Demandes", chemin: "/espace-conseiller/demandes", icone: Inbox, badge: zone.length },
    { libelle: "Rendez-vous", chemin: "/espace-conseiller/rendez-vous", icone: CalendarDays },
    { libelle: "Mes clients", chemin: "/espace-conseiller/clients", icone: Users },
    { libelle: "Mon profil", chemin: "/espace-conseiller/profil", icone: UserCircle },
  ];
}

function Interieur() {
  const liens = Liens();
  return (
    <CadreEspace titreEspace="Espace Conseiller" liens={liens}>
      <Routes>
        <Route index element={<TableauDeBord />} />
        <Route path="demandes" element={<ListeDemandes />} />
        <Route path="demandes/:id" element={<FicheDemande />} />
        <Route path="rendez-vous" element={<RendezVousPage />} />
        <Route path="clients" element={<Clients />} />
        <Route path="profil" element={<Profil />} />
        <Route path="*" element={<Navigate to="/espace-conseiller" replace />} />
      </Routes>
    </CadreEspace>
  );
}

export default function EspaceConseiller() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/espace-conseiller/connexion" replace />;
  if (user.role !== "advisor") return <Navigate to={user.role === "manager" ? "/responsable" : "/mon-espace"} replace />;
  return <Fournisseur><Interieur /></Fournisseur>;
}
