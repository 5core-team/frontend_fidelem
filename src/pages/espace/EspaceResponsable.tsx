import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import { LayoutDashboard, UserCheck, Users, Inbox, MapPinned, Sparkles, UserPlus, UserCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import CadreEspace, { Chiffre, EtatVide, TetePage } from "@/components/espace/CadreEspace";
import UserTable from "@/components/UserTable";
import { AddFinancialAdvisorForm } from "@/components/AddFinancialAdvisorForm";
import { EditProfileForm } from "@/components/EditProfileForm";
import { getCreditStats, getUserStats, getUsers } from "@/config/api";
import { candidaturesConseillers, interetsEasyLife, toutesLesDemandes, type Demande } from "@/config/apiEspace";
import { TableDemandes } from "./EspaceConseiller";
import { ZONES } from "@/donnees/fidelem";

type Ligne = Record<string, unknown>;

function VueEnsemble() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [demandes, setDemandes] = useState<Record<string, number>>({});
  const [recentes, setRecentes] = useState<Demande[]>([]);
  const [candidatures, setCandidatures] = useState<Ligne[]>([]);
  useEffect(() => {
    getUserStats().then((r) => setStats(r.data ?? {})).catch(() => {});
    getCreditStats().then((r) => setDemandes(r.data ?? {})).catch(() => {});
    toutesLesDemandes().then((l) => setRecentes(l.slice(0, 4))).catch(() => {});
    candidaturesConseillers().then(setCandidatures).catch(() => {});
  }, []);
  const v = (o: Record<string, number>, ...cles: string[]) => cles.map((c) => o[c]).find((x) => typeof x === "number") ?? "—";
  return (
    <>
      <TetePage sur="Back-office" titre="Vue d'ensemble" texte="L'activité de la plateforme FIDELEM." />
      <div className="f-chiffres">
        <Chiffre accent libelle="Comptes en attente" valeur={v(stats, "pendingUsers", "pending")} aide="Candidatures à traiter" />
        <Chiffre libelle="Usagers" valeur={v(stats, "totalUsers", "users")} />
        <Chiffre libelle="Conseillers" valeur={v(stats, "totalAdvisors", "advisors")} />
        <Chiffre libelle="Demandes de financement" valeur={v(demandes, "total", "totalRequests", "count")} />
      </div>
      <div className="f-deux-col">
        <section className="f-panel">
          <div className="f-panel__tete"><h2 className="f-titre-m">Dernières demandes</h2><Link className="f-lien" to="/responsable/demandes">Tout voir</Link></div>
          <TableDemandes compact demandes={recentes} base="/responsable/demandes" vide={<EtatVide titre="Aucune demande." texte="Les nouvelles demandes apparaîtront ici." />} />
        </section>
        <section className="f-panel">
          <div className="f-panel__tete"><h2 className="f-titre-m">Candidatures</h2><Link className="f-lien" to="/responsable/conseillers">Tout voir</Link></div>
          {candidatures.length ? (
            <div style={{ display: "grid", gap: 8 }}>
              {candidatures.map((c, i) => { const r = (c.rendezVous ?? {}) as Ligne; return (
                <Link key={i} to="/responsable/conseillers" className="f-carte-demande">
                  <div><strong style={{ fontWeight: 500 }}>{String(c.prenom ?? "")} {String(c.nom ?? "")}</strong><span className="f-pastille" style={{ background: "var(--f-or-clair)" }}>{String(c.niveauVise ?? "")}</span></div>
                  <div><span className="f-note">{String(r.zone ?? "")} · test le {String(r.date ?? "")}</span></div>
                </Link>
              ); })}
            </div>
          ) : <EtatVide titre="Aucune candidature." texte="Les candidatures envoyées depuis le site apparaîtront ici." />}
        </section>
      </div>
    </>
  );
}

function Conseillers() {
  const [ajout, setAjout] = useState(false);
  const [candidatures, setCandidatures] = useState<Ligne[] | null>(null);
  useEffect(() => { candidaturesConseillers().then(setCandidatures).catch(() => setCandidatures(null)); }, []);
  return (
    <>
      <TetePage sur="Back-office" titre="Conseillers et candidatures" texte="Validez les candidatures, suivez le test de niveau, la formation et la licence." actions={<button type="button" className="f-btn f-btn--icone f-btn--encre" onClick={() => setAjout(true)}><UserPlus /> Nouveau conseiller</button>} />
      <section className="f-panel">
        <h2 className="f-titre-m">Candidatures reçues du site</h2>
        {candidatures === null ? <EtatVide titre="Le suivi des candidatures arrive bientôt." texte="Les candidatures envoyées depuis la page « Devenir conseiller » s'afficheront ici avec le niveau visé, le rendez-vous de test et l'état des paiements. Les comptes conseillers en attente restent validables ci-dessous." />
          : candidatures.length ? (
            <div className="f-defile-x"><table className="f-table"><thead><tr><th>Candidat</th><th>Téléphone</th><th>Niveau visé</th><th>Zone souhaitée</th><th>Rendez-vous</th></tr></thead><tbody style={{ cursor: "default" }}>
              {candidatures.map((c, i) => { const r = (c.rendezVous ?? {}) as Ligne; return <tr key={i} style={{ cursor: "default" }}><td>{String(c.prenom ?? "")} {String(c.nom ?? "")}</td><td>{String(c.telephone ?? "")}</td><td>{String(c.niveauVise ?? "")}</td><td>{String(r.zone ?? "")}</td><td>{String(r.date ?? "")} {String(r.creneau ?? "")}</td></tr>; })}
            </tbody></table></div>
          ) : <EtatVide titre="Aucune candidature." texte="Les nouvelles candidatures apparaîtront ici." />}
      </section>
      <section className="f-panel"><UserTable title="Comptes conseillers" description="Validez ou refusez les comptes en attente." filterType="advisor" /></section>
      <AddFinancialAdvisorForm open={ajout} onOpenChange={setAjout} />
    </>
  );
}

function Usagers() {
  return (
    <>
      <TetePage sur="Back-office" titre="Usagers" />
      <section className="f-panel"><UserTable title="Comptes usagers" description="Les usagers inscrits sur FIDELEM." filterType="user" /></section>
    </>
  );
}

function Demandes() {
  const [liste, setListe] = useState<Demande[] | null>(null);
  useEffect(() => { toutesLesDemandes().then(setListe).catch(() => setListe([])); }, []);
  return (
    <>
      <TetePage sur="Back-office" titre="Demandes de financement" texte="Toutes les demandes de la plateforme, avec leur statut." />
      <section className="f-panel">
        {liste === null ? <p className="f-texte">Chargement…</p> : <TableDemandes demandes={liste} base="/responsable/demandes" vide={<EtatVide titre="Aucune demande." texte="Les demandes de financement apparaîtront ici." />} />}
      </section>
    </>
  );
}

function Zones() {
  const [conseillers, setConseillers] = useState<Ligne[]>([]);
  useEffect(() => { getUsers().then((r) => setConseillers((Array.isArray(r.data) ? r.data : []).filter((u: Ligne) => u.type_compte === "advisor"))).catch(() => {}); }, []);
  const parZone = (z: string) => conseillers.filter((c) => String(c.zone ?? "") === z);
  return (
    <>
      <TetePage sur="Back-office" titre="Zones de gestion" texte="Chaque conseiller reçoit une zone avec sa licence. Repérez les zones sans conseiller." />
      <section className="f-panel">
        <div className="f-defile-x"><table className="f-table"><thead><tr><th>Zone</th><th>Conseillers</th><th>Couverture</th></tr></thead><tbody style={{ cursor: "default" }}>
          {ZONES.map((z) => { const c = parZone(z); return (
            <tr key={z} style={{ cursor: "default" }}><td>{z}</td><td>{c.length ? c.map((x) => `${x.name} ${x.last_name}`).join(", ") : "—"}</td><td>{c.length ? <span className="f-pastille" style={{ color: "#1D4D36", background: "#D7EDE0" }}>Couverte</span> : <span className="f-pastille" style={{ color: "#7A2B1D", background: "#F5DCD5" }}>Sans conseiller</span>}</td></tr>
          ); })}
        </tbody></table></div>
        <p className="f-note">Liste provisoire des communes. L'attribution d'une zone à un conseiller nécessite le champ « zone » côté serveur.</p>
      </section>
    </>
  );
}

function EasyLifeDemandes() {
  const [liste, setListe] = useState<Ligne[] | null>(null);
  useEffect(() => { interetsEasyLife().then(setListe).catch(() => setListe(null)); }, []);
  return (
    <>
      <TetePage sur="Back-office" titre="Demandes EasyLife" texte="Les personnes et entreprises intéressées par EasyLife Living et les autres pôles." />
      <section className="f-panel">
        {liste === null ? <EtatVide titre="Les demandes EasyLife arrivent bientôt." texte="Les formulaires d'intérêt de la page EasyLife s'afficheront ici dès que le service sera activé côté serveur." />
          : liste.length ? <div className="f-defile-x"><table className="f-table"><thead><tr><th>Contact</th><th>Profil</th><th>Pôle</th><th>Téléphone</th><th>Message</th></tr></thead><tbody style={{ cursor: "default" }}>
            {liste.map((l, i) => <tr key={i} style={{ cursor: "default" }}><td>{String(l.prenom ?? "")} {String(l.nom ?? "")}</td><td>{String(l.profil ?? "")}</td><td>{String(l.pole ?? "")}</td><td>{String(l.telephone ?? "")}</td><td>{String(l.message ?? "")}</td></tr>)}
          </tbody></table></div>
          : <EtatVide titre="Aucune demande EasyLife." texte="Les nouvelles demandes apparaîtront ici." />}
      </section>
    </>
  );
}

function Profil() {
  const { user } = useAuth();
  const [edition, setEdition] = useState(false);
  return (
    <>
      <TetePage sur="Back-office" titre="Mon profil" actions={<button type="button" className="f-btn f-btn--encre" onClick={() => setEdition(true)}>Modifier</button>} />
      <section className="f-panel"><dl className="f-dl"><div><dt>Nom</dt><dd>{user?.name} {user?.last_name}</dd></div><div><dt>E-mail</dt><dd>{user?.email}</dd></div></dl></section>
      <EditProfileForm open={edition} onOpenChange={setEdition} />
    </>
  );
}

export default function EspaceResponsable() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/espace-conseiller/connexion" replace />;
  if (user.role !== "manager") return <Navigate to={user.role === "advisor" ? "/espace-conseiller" : "/mon-espace"} replace />;
  return (
    <CadreEspace titreEspace="Back-office" liens={[
      { libelle: "Vue d'ensemble", chemin: "/responsable", icone: LayoutDashboard, fin: true },
      { libelle: "Conseillers", chemin: "/responsable/conseillers", icone: UserCheck },
      { libelle: "Usagers", chemin: "/responsable/usagers", icone: Users },
      { libelle: "Demandes", chemin: "/responsable/demandes", icone: Inbox },
      { libelle: "Zones", chemin: "/responsable/zones", icone: MapPinned },
      { libelle: "EasyLife", chemin: "/responsable/easylife", icone: Sparkles },
      { libelle: "Mon profil", chemin: "/responsable/profil", icone: UserCircle },
    ]}>
      <Routes>
        <Route index element={<VueEnsemble />} />
        <Route path="conseillers" element={<Conseillers />} />
        <Route path="usagers" element={<Usagers />} />
        <Route path="demandes" element={<Demandes />} />
        <Route path="zones" element={<Zones />} />
        <Route path="easylife" element={<EasyLifeDemandes />} />
        <Route path="profil" element={<Profil />} />
        <Route path="*" element={<Navigate to="/responsable" replace />} />
      </Routes>
    </CadreEspace>
  );
}
