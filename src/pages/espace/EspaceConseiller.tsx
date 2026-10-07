import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Link, Navigate, Route, Routes, useParams } from "react-router-dom";
import { LayoutDashboard, Inbox, Users, CalendarDays, UserCircle, Search, Loader2, UserPlus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import CadreEspace, { Chiffre, EtatVide, PastilleStatut, TetePage } from "@/components/espace/CadreEspace";
import { DemandeIntrouvable, FicheDemande, TableDemandes } from "@/components/espace/Demandes";
import { idDepuisAdresse, nomFinancement, rdvTexte } from "@/components/espace/demandesOutils";
import { FINANCEMENTS, FORMATIONS, ZONES } from "@/donnees/fidelem";
import { STATUTS, clientsConseiller, demandesDeMaZone, mesDemandes, type Demande } from "@/config/apiEspace";
import type { Compte } from "@/config/api";
import { AddClientForm } from "@/components/AddClientForm";
import { AddCreditRequestForm } from "@/components/AddCreditRequestForm";
import { EditProfileForm } from "@/components/EditProfileForm";

/* ----------------------------- Données partagées ----------------------------- */

type Donnees = {
  zone: Demande[]; miennes: Demande[]; clients: Compte[];
  chargement: boolean; zoneIndisponible: boolean;
  recharger: () => void; maj: (d: Demande) => void;
};
const Ctx = createContext<Donnees | null>(null);
const useDonnees = () => useContext(Ctx)!;

function Fournisseur({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [zone, setZone] = useState<Demande[]>([]);
  const [miennes, setMiennes] = useState<Demande[]>([]);
  const [clients, setClients] = useState<Compte[]>([]);
  const [chargement, setChargement] = useState(true);
  const [zoneIndisponible, setZoneIndisponible] = useState(false);

  const recharger = useCallback(async () => {
    if (!user) return;
    setChargement(true);
    const [z, m, c] = await Promise.allSettled([demandesDeMaZone(), mesDemandes(), clientsConseiller(user.id)]);
    setZoneIndisponible(z.status === "rejected");
    setZone(z.status === "fulfilled" ? z.value : []);
    setMiennes(m.status === "fulfilled" ? m.value : []);
    setClients(c.status === "fulfilled" ? c.value : []);
    if (m.status === "rejected") toast.error("Impossible de charger vos demandes pour le moment.");
    setChargement(false);
  }, [user]);

  useEffect(() => { recharger(); }, [recharger]);

  // Une demande prise en charge quitte la liste de zone et rejoint les dossiers suivis.
  const maj = (d: Demande) => {
    if (d.statut !== "Nouvelle") setZone((l) => l.filter((x) => x.id !== d.id));
    else setZone((l) => l.map((x) => (x.id === d.id ? d : x)));
    setMiennes((l) => (l.some((x) => x.id === d.id) ? l.map((x) => (x.id === d.id ? d : x)) : d.statut !== "Nouvelle" ? [d, ...l] : l));
  };
  return <Ctx.Provider value={{ zone, miennes, clients, chargement, zoneIndisponible, recharger, maj }}>{children}</Ctx.Provider>;
}

const aVenir = (d: Demande) => !d.rendezVous?.date || new Date(d.rendezVous.date) >= new Date(new Date().toDateString());

/* ----------------------------- Tableau de bord ----------------------------- */

function TableauDeBord() {
  const { user } = useAuth();
  const { zone, miennes, chargement, zoneIndisponible } = useDonnees();
  const enCours = miennes.filter((d) => !["Acceptée", "Refusée"].includes(d.statut));
  const rdv = enCours.filter((d) => d.rendezVous?.date && aVenir(d));
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
          {!user?.zone && <div className="f-alerte f-alerte--info" role="status">Aucune zone de gestion ne vous est encore attribuée : vous ne recevez que les demandes qui vous sont adressées. Votre responsable FIDELEM attribue la zone avec votre licence.</div>}
          <div className="f-deux-col">
            <section className="f-panel">
              <div className="f-panel__tete"><h2 className="f-titre-m">Nouvelles demandes de ma zone</h2><Link className="f-lien" to="/espace-conseiller/demandes">Tout voir</Link></div>
              <TableDemandes compact demandes={zone.slice(0, 5)} vide={<EtatVide titre={zoneIndisponible ? "Les demandes de zone ne peuvent pas être chargées." : "Aucune nouvelle demande."} texte={zoneIndisponible ? "Réessayez dans un instant. Vos dossiers en cours restent accessibles." : "Les nouvelles demandes des usagers de votre zone apparaîtront ici."} />} />
            </section>
            <section className="f-panel">
              <div className="f-panel__tete"><h2 className="f-titre-m">Prochains rendez-vous</h2><Link className="f-lien" to="/espace-conseiller/rendez-vous">Agenda</Link></div>
              {rdv.length ? (
                <div className="f-rdv-jour">
                  {rdv.slice(0, 4).map((d) => (
                    <Link key={d.id} to={`/espace-conseiller/demandes/${d.id}`} className="f-rdv" style={{ background: "var(--f-papier)" }}>
                      <span className="f-rdv__heure">{rdvTexte(d)}</span>
                      <span>{d.usager.nom}<br /><small className="f-note">{d.rendezVous?.mode ?? ""}</small></span>
                      <PastilleStatut statut={d.statut} />
                    </Link>
                  ))}
                </div>
              ) : <EtatVide titre="Aucun rendez-vous." texte="Fixez un rendez-vous depuis la fiche d'une demande que vous suivez." />}
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
  const filtrees = useMemo(() => {
    const base = onglet === "zone" ? zone : onglet === "miennes" ? miennes : [...zone, ...miennes.filter((m) => !zone.some((z) => z.id === m.id))];
    return base.filter((d) =>
      (!q || `${d.usager.nom} ${d.objet} ${d.zone ?? ""}`.toLowerCase().includes(q.toLowerCase())) &&
      (!type || d.financement === type) && (!statut || d.statut === statut));
  }, [onglet, zone, miennes, q, type, statut]);

  return (
    <>
      <TetePage sur="Espace Conseiller" titre="Demandes" texte="Les demandes de votre zone et les dossiers que vous suivez." actions={<button type="button" className="f-btn f-btn--icone f-btn--encre" onClick={() => setNouveau(true)} disabled={!clients.length} title={clients.length ? undefined : "Ajoutez d'abord un client"}><Plus /> Nouvelle demande</button>} />
      <section className="f-panel">
        <div className="f-panel__tete">
          <div className="f-onglets" role="tablist">
            {([["zone", "Nouvelles de ma zone", zone.length], ["miennes", "Mes dossiers", miennes.length], ["toutes", "Toutes", undefined]] as const).map(([k, l, n]) => (
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
          <TableDemandes demandes={filtrees} vide={<EtatVide titre={onglet === "zone" && zoneIndisponible ? "Les demandes de zone ne peuvent pas être chargées." : "Aucune demande."} texte={onglet === "zone" && zoneIndisponible ? "Réessayez dans un instant." : "Aucune demande ne correspond à ces filtres."} />} />
        )}
      </section>
      <AddCreditRequestForm open={nouveau} onOpenChange={setNouveau} isAdvisor clients={clients} onCree={recharger} />
    </>
  );
}

/* ----------------------------- Fiche d'une demande ----------------------------- */

function FicheConseiller() {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const { zone, miennes, chargement, maj } = useDonnees();
  const retour = { chemin: "/espace-conseiller/demandes", libelle: "Demandes" };
  const d = [...zone, ...miennes].find((x) => x.id === idDepuisAdresse(id));

  if (chargement) return <p className="f-texte" style={{ display: "flex", gap: 10 }}><Loader2 className="animate-spin" /> Chargement</p>;
  if (!d) return <DemandeIntrouvable retour={{ ...retour, libelle: "Retour aux demandes" }} />;

  const moi = user ? String(user.id) : undefined;
  const suivi = d.conseillerId === moi;
  return (
    <FicheDemande
      demande={d}
      retour={retour}
      droits={{ prendreEnCharge: true, modifier: suivi, fixerRendezVous: true }}
      auteur={`${user?.name ?? ""} ${user?.last_name ?? ""}`.trim()}
      conseillerId={moi}
      onMaj={maj}
    />
  );
}

/* ----------------------------- Rendez-vous ----------------------------- */

function RendezVousPage() {
  const { miennes, chargement } = useDonnees();
  const avec = miennes.filter((d) => d.rendezVous?.date && aVenir(d)).sort((a, b) => (a.rendezVous!.date! < b.rendezVous!.date! ? -1 : 1));
  const parJour = avec.reduce<Record<string, Demande[]>>((acc, d) => { (acc[d.rendezVous!.date!] ||= []).push(d); return acc; }, {});
  return (
    <>
      <TetePage sur="Espace Conseiller" titre="Rendez-vous" texte="Vos prochains rendez-vous, par jour." />
      {chargement ? <p className="f-texte"><Loader2 className="animate-spin" /></p> : Object.keys(parJour).length ? (
        Object.entries(parJour).map(([jour, liste]) => (
          <section key={jour} className="f-rdv-jour">
            <p className="f-label">{new Date(jour).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</p>
            {liste.map((d) => (
              <Link key={d.id} to={`/espace-conseiller/demandes/${d.id}`} className="f-rdv">
                <span className="f-rdv__heure">{d.rendezVous?.creneau ?? ""}</span>
                <span>{d.usager.nom} · {nomFinancement(d.financement)}<br /><small className="f-note">{d.rendezVous?.mode ?? ""}{d.zone ? ` · ${d.zone}` : ""}</small></span>
                <PastilleStatut statut={d.statut} />
              </Link>
            ))}
          </section>
        ))
      ) : <EtatVide titre="Aucun rendez-vous prévu." texte="Les rendez-vous que vous fixez depuis la fiche d'une demande apparaissent ici." action={<Link className="f-btn f-btn--icone f-btn--gris" to="/espace-conseiller/demandes">Voir les demandes</Link>} />}
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
                  <tr key={String(c.id)} style={{ cursor: "default" }}><td>{c.name} {c.last_name}</td><td>{c.phone || "—"}</td><td>{c.email}</td><td>{c.address || "—"}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <EtatVide titre="Aucun client." texte="Ajoutez un client pour créer son compte : il suit ses demandes depuis son espace, et ses demandes envoyées depuis le site lui sont rattachées." />}
      </section>
      <AddClientForm open={ajout} onOpenChange={(o: boolean) => { setAjout(o); if (!o) recharger(); }} />
    </>
  );
}

/* ----------------------------- Profil ----------------------------- */

function Profil() {
  const { user } = useAuth();
  const [edition, setEdition] = useState(false);
  const niveau = FORMATIONS.find((f) => f.id === user?.niveau?.toLowerCase());
  return (
    <>
      <TetePage sur="Espace Conseiller" titre="Mon profil" actions={<button type="button" className="f-btn f-btn--encre" onClick={() => setEdition(true)}>Modifier mon profil</button>} />
      <section className="f-panel">
        <dl className="f-dl">
          <div><dt>Nom</dt><dd>{user?.name} {user?.last_name}</dd></div>
          <div><dt>E-mail</dt><dd>{user?.email}</dd></div>
          <div><dt>Téléphone</dt><dd>{user?.phone || "—"}</dd></div>
          <div><dt>Adresse</dt><dd>{user?.address || "—"}</dd></div>
          <div><dt>Zone de gestion</dt><dd>{user?.zone || "Attribuée avec votre licence"}</dd></div>
          <div><dt>Niveau</dt><dd>{niveau ? `CF ${niveau.nom}` : "—"}</dd></div>
        </dl>
        <p className="f-note">La zone de gestion est attribuée par FIDELEM avec la licence de travail. Pour la modifier, contactez votre responsable. Zones couvertes : {ZONES.slice(0, 6).join(", ")}…</p>
      </section>
      <EditProfileForm open={edition} onOpenChange={setEdition} />
    </>
  );
}

/* ----------------------------- Espace ----------------------------- */

function Interieur() {
  const { zone } = useDonnees();
  const liens = [
    { libelle: "Tableau de bord", chemin: "/espace-conseiller", icone: LayoutDashboard, fin: true },
    { libelle: "Demandes", chemin: "/espace-conseiller/demandes", icone: Inbox, badge: zone.length },
    { libelle: "Rendez-vous", chemin: "/espace-conseiller/rendez-vous", icone: CalendarDays },
    { libelle: "Mes clients", chemin: "/espace-conseiller/clients", icone: Users },
    { libelle: "Mon profil", chemin: "/espace-conseiller/profil", icone: UserCircle },
  ];
  return (
    <CadreEspace titreEspace="Espace Conseiller" liens={liens}>
      <Routes>
        <Route index element={<TableauDeBord />} />
        <Route path="demandes" element={<ListeDemandes />} />
        <Route path="demandes/:id" element={<FicheConseiller />} />
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
