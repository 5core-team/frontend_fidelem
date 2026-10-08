import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate, Route, Routes, useParams } from "react-router-dom";
import { LayoutDashboard, UserCheck, Users, Inbox, MapPinned, Sparkles, UserPlus, UserCircle, Mail, Phone, MessageCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import CadreEspace, { Chiffre, EtatVide, PastilleStatut, TetePage } from "@/components/espace/CadreEspace";
import { DemandeIntrouvable, FicheDemande, TableDemandes } from "@/components/espace/Demandes";
import { dateCourte, idDepuisAdresse } from "@/components/espace/demandesOutils";
import UserTable from "@/components/UserTable";
import { AddFinancialAdvisorForm } from "@/components/AddFinancialAdvisorForm";
import { EditProfileForm } from "@/components/EditProfileForm";
import { getCreditStats, getUserStats, getUsers, type Compte } from "@/config/api";
import {
  attribuerZone, candidaturesConseillers, interetsEasyLife, messagesContact, toutesLesDemandes,
  type CandidatureRecue, type Demande, type InteretRecu, type MessageRecu,
} from "@/config/apiEspace";
import { lireErreur } from "@/config/http";
import { FORMATIONS, ZONES } from "@/donnees/fidelem";

const Chargement = () => <p className="f-texte" style={{ display: "flex", gap: 10 }}><Loader2 className="animate-spin" /> Chargement</p>;
const rdvCourt = (r?: { zone?: string; date?: string; creneau?: string } | null) =>
  r?.date ? `${r.zone ? `${r.zone} · ` : ""}${dateCourte(r.date)}${r.creneau ? ` · ${r.creneau.split(" (")[0]}` : ""}` : "—";
const nomNiveau = (n?: string | null) => FORMATIONS.find((f) => f.id === n)?.nom;

/* ----------------------------- Vue d'ensemble ----------------------------- */

function VueEnsemble() {
  const [stats, setStats] = useState<{ totalUsers?: number; totalAdvisors?: number; pendingUsers?: number }>({});
  const [total, setTotal] = useState<number | undefined>();
  const [recentes, setRecentes] = useState<Demande[]>([]);
  const [candidatures, setCandidatures] = useState<CandidatureRecue[]>([]);
  useEffect(() => {
    getUserStats().then((r) => setStats(r.data ?? {})).catch(() => {});
    getCreditStats().then((r) => setTotal(r.data?.total)).catch(() => {});
    toutesLesDemandes().then((l) => setRecentes(l.slice(0, 4))).catch(() => {});
    candidaturesConseillers().then((l) => setCandidatures(l.slice(0, 4))).catch(() => {});
  }, []);
  return (
    <>
      <TetePage sur="Back-office" titre="Vue d'ensemble" texte="L'activité de la plateforme FIDELEM." />
      <div className="f-chiffres">
        <Chiffre accent libelle="Comptes en attente" valeur={stats.pendingUsers ?? "—"} aide="Candidatures à traiter" />
        <Chiffre libelle="Usagers" valeur={stats.totalUsers ?? "—"} />
        <Chiffre libelle="Conseillers" valeur={stats.totalAdvisors ?? "—"} />
        <Chiffre libelle="Demandes de financement" valeur={total ?? "—"} />
      </div>
      <div className="f-deux-col">
        <section className="f-panel">
          <div className="f-panel__tete"><h2 className="f-titre-m">Dernières demandes</h2><Link className="f-lien" to="/responsable/demandes">Tout voir</Link></div>
          <TableDemandes compact demandes={recentes} base="/responsable/demandes" avecConseiller vide={<EtatVide titre="Aucune demande." texte="Les nouvelles demandes apparaîtront ici." />} />
        </section>
        <section className="f-panel">
          <div className="f-panel__tete"><h2 className="f-titre-m">Candidatures</h2><Link className="f-lien" to="/responsable/conseillers">Tout voir</Link></div>
          {candidatures.length ? (
            <div style={{ display: "grid", gap: 8 }}>
              {candidatures.map((c) => (
                <Link key={c.id} to="/responsable/conseillers" className="f-carte-demande">
                  <div><strong style={{ fontWeight: 500 }}>{c.prenom} {c.nom}</strong><span className="f-pastille" style={{ background: "var(--f-or-clair)" }}>{c.niveauVise}</span></div>
                  <div><span className="f-note">Test : {rdvCourt(c.rendezVous)}</span></div>
                </Link>
              ))}
            </div>
          ) : <EtatVide titre="Aucune candidature." texte="Les candidatures envoyées depuis le site apparaîtront ici." />}
        </section>
      </div>
    </>
  );
}

/* ----------------------------- Conseillers ----------------------------- */

function Conseillers() {
  const [ajout, setAjout] = useState(false);
  const [version, setVersion] = useState(0);
  const [candidatures, setCandidatures] = useState<CandidatureRecue[] | null>(null);
  const [erreur, setErreur] = useState(false);
  useEffect(() => { candidaturesConseillers().then(setCandidatures).catch(() => setErreur(true)); }, [version]);
  return (
    <>
      <TetePage sur="Back-office" titre="Conseillers et candidatures" texte="Validez les candidatures, puis attribuez une zone à chaque conseiller depuis la page Zones." actions={<button type="button" className="f-btn f-btn--icone f-btn--encre" onClick={() => setAjout(true)}><UserPlus /> Nouveau conseiller</button>} />
      <section className="f-panel">
        <h2 className="f-titre-m">Candidatures reçues du site</h2>
        {erreur ? <EtatVide titre="Les candidatures ne peuvent pas être chargées." texte="Réessayez dans un instant. Les comptes conseillers en attente restent validables ci-dessous." />
          : candidatures === null ? <Chargement />
          : candidatures.length ? (
            <div className="f-defile-x"><table className="f-table"><thead><tr><th>Candidat</th><th>Téléphone</th><th>Niveau visé</th><th>Échange et test</th><th>Compte</th></tr></thead><tbody style={{ cursor: "default" }}>
              {candidatures.map((c) => (
                <tr key={c.id} style={{ cursor: "default" }}>
                  <td><span className="f-table__usager"><strong style={{ fontWeight: 500 }}>{c.prenom} {c.nom}</strong><small>{c.email}</small></span></td>
                  <td className="num">{c.telephone}</td>
                  <td>{c.niveauVise}</td>
                  <td>{rdvCourt(c.rendezVous)}</td>
                  <td>{c.statutCompte ? <PastilleStatut statut={c.statutCompte === "Actif" ? "Acceptée" : c.statutCompte === "Rejeté" ? "Refusée" : "Nouvelle"} libelle={c.statutCompte} /> : "—"}</td>
                </tr>
              ))}
            </tbody></table></div>
          ) : <EtatVide titre="Aucune candidature." texte="Les candidatures envoyées depuis la page « Devenir conseiller » apparaîtront ici, avec le niveau visé et le rendez-vous du test." />}
      </section>
      <section className="f-panel"><UserTable key={version} title="Comptes conseillers" description="Validez ou refusez les comptes en attente." filterType="advisor" /></section>
      <AddFinancialAdvisorForm open={ajout} onOpenChange={setAjout} onCree={() => setVersion((v) => v + 1)} />
    </>
  );
}

/* ----------------------------- Usagers ----------------------------- */

function Usagers() {
  return (
    <>
      <TetePage sur="Back-office" titre="Usagers" />
      <section className="f-panel"><UserTable title="Comptes usagers" description="Les usagers inscrits sur FIDELEM." filterType="user" /></section>
    </>
  );
}

/* ----------------------------- Demandes ----------------------------- */

const RETOUR_DEMANDES = { chemin: "/responsable/demandes", libelle: "Demandes" };

function FicheResponsable({ liste, maj }: { liste: Demande[] | null; maj: (d: Demande) => void }) {
  const { id = "" } = useParams();
  const { user } = useAuth();
  if (liste === null) return <Chargement />;
  const d = liste.find((x) => x.id === idDepuisAdresse(id));
  if (!d) return <DemandeIntrouvable retour={{ ...RETOUR_DEMANDES, libelle: "Retour aux demandes" }} />;
  return <FicheDemande demande={d} retour={RETOUR_DEMANDES} droits={{ modifier: true }} auteur={`${user?.name ?? ""} ${user?.last_name ?? ""}`.trim()} onMaj={maj} />;
}

function Demandes() {
  const [liste, setListe] = useState<Demande[] | null>(null);
  const [erreur, setErreur] = useState(false);
  const charger = useCallback(() => { toutesLesDemandes().then((l) => { setListe(l); setErreur(false); }).catch(() => { setListe([]); setErreur(true); }); }, []);
  useEffect(() => { charger(); }, [charger]);
  const maj = useCallback((d: Demande) => setListe((l) => (l ?? []).map((x) => (x.id === d.id ? d : x))), []);

  return (
    <Routes>
      <Route index element={
        <>
          <TetePage sur="Back-office" titre="Demandes de financement" texte="Toutes les demandes de la plateforme, avec leur conseiller et leur statut." />
          <section className="f-panel">
            {liste === null ? <Chargement />
              : erreur ? <EtatVide titre="Les demandes ne peuvent pas être chargées." texte="Réessayez dans un instant." action={<button type="button" className="f-btn f-btn--gris" onClick={charger}>Réessayer</button>} />
              : <TableDemandes demandes={liste} base="/responsable/demandes" avecConseiller vide={<EtatVide titre="Aucune demande." texte="Les demandes de financement apparaîtront ici." />} />}
          </section>
        </>
      } />
      <Route path=":id" element={<FicheResponsable liste={liste} maj={maj} />} />
    </Routes>
  );
}

/* ----------------------------- Zones ----------------------------- */

function Zones() {
  const [conseillers, setConseillers] = useState<Compte[] | null>(null);
  const [enCours, setEnCours] = useState<string | number | null>(null);
  useEffect(() => { getUsers().then((r) => setConseillers((Array.isArray(r.data) ? r.data : []).filter((u) => u.type_compte === "advisor"))).catch(() => setConseillers([])); }, []);
  const actifs = (conseillers ?? []).filter((c) => c.statut === "Actif");
  const parZone = (z: string) => actifs.filter((c) => c.zone === z);
  const sansZone = actifs.filter((c) => !c.zone).length;
  const tries = useMemo(() => [...actifs].sort((a, b) => Number(!!a.zone) - Number(!!b.zone) || a.name.localeCompare(b.name)), [actifs]);

  const changer = async (c: Compte, zone: string) => {
    setEnCours(c.id);
    try {
      const { data } = await attribuerZone(c.id, zone || null);
      setConseillers((l) => (l ?? []).map((x) => (x.id === c.id ? { ...x, zone: data?.zone ?? (zone || null) } : x)));
      toast.success(zone ? `${c.name} ${c.last_name} gère désormais la zone ${zone}.` : `${c.name} ${c.last_name} n'a plus de zone.`);
    } catch (e) {
      toast.error(lireErreur(e).message ?? "La zone n'a pas pu être attribuée.");
    } finally { setEnCours(null); }
  };

  return (
    <>
      <TetePage sur="Back-office" titre="Zones de gestion" texte="Chaque conseiller reçoit une zone avec sa licence. Les demandes du site lui arrivent selon la commune choisie par l'usager." />
      <section className="f-panel">
        <div className="f-panel__tete">
          <h2 className="f-titre-m">Attribuer les zones</h2>
          {!!sansZone && <span className="f-pastille" style={{ color: "#7A2B1D", background: "#F5DCD5" }}>{sansZone} sans zone</span>}
        </div>
        {conseillers === null ? <Chargement /> : tries.length ? (
          <div className="f-defile-x"><table className="f-table"><thead><tr><th>Conseiller</th><th>Niveau</th><th>Zone de gestion</th></tr></thead><tbody style={{ cursor: "default" }}>
            {tries.map((c) => (
              <tr key={c.id} style={{ cursor: "default" }}>
                <td><span className="f-table__usager"><strong style={{ fontWeight: 500 }}>{c.name} {c.last_name}</strong><small>{c.phone || c.email}</small></span></td>
                <td>{nomNiveau(c.niveau) ? `CF ${nomNiveau(c.niveau)}` : "—"}</td>
                <td>
                  <div className="f-filtres">
                    <select aria-label={`Zone de ${c.name} ${c.last_name}`} value={c.zone ?? ""} disabled={enCours === c.id} onChange={(e) => changer(c, e.target.value)}>
                      <option value="">Aucune zone</option>
                      {ZONES.map((z) => <option key={z}>{z}</option>)}
                    </select>
                    {enCours === c.id && <Loader2 className="animate-spin" aria-label="Enregistrement" />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody></table></div>
        ) : <EtatVide titre="Aucun conseiller actif." texte="Validez un compte conseiller depuis la page Conseillers pour lui attribuer une zone." action={<Link className="f-btn f-btn--gris" to="/responsable/conseillers">Voir les conseillers</Link>} />}
      </section>
      <section className="f-panel">
        <h2 className="f-titre-m">Couverture des communes</h2>
        <div className="f-defile-x"><table className="f-table"><thead><tr><th>Commune</th><th>Conseillers</th><th>Couverture</th></tr></thead><tbody style={{ cursor: "default" }}>
          {ZONES.map((z) => { const c = parZone(z); return (
            <tr key={z} style={{ cursor: "default" }}><td>{z}</td><td>{c.length ? c.map((x) => `${x.name} ${x.last_name}`).join(", ") : "—"}</td><td>{c.length ? <span className="f-pastille" style={{ color: "#1D4D36", background: "#D7EDE0" }}>Couverte</span> : <span className="f-pastille" style={{ color: "#7A2B1D", background: "#F5DCD5" }}>Sans conseiller</span>}</td></tr>
          ); })}
        </tbody></table></div>
        <p className="f-note">Une demande envoyée depuis une commune sans conseiller reste visible ici, dans Demandes, jusqu'à ce qu'un conseiller couvre la commune.</p>
      </section>
    </>
  );
}

/* ----------------------------- Messages ----------------------------- */

const OBJETS = ["Demande de financement", "EasyLife", "Devenir conseiller", "Autre"];

function Messages() {
  const [liste, setListe] = useState<MessageRecu[] | null>(null);
  const [erreur, setErreur] = useState(false);
  const [objet, setObjet] = useState("");
  useEffect(() => { messagesContact().then(setListe).catch(() => { setListe([]); setErreur(true); }); }, []);
  const filtres = (liste ?? []).filter((m) => !objet || m.objet === objet);
  const compte = (o: string) => (liste ?? []).filter((m) => m.objet === o).length;
  return (
    <>
      <TetePage sur="Back-office" titre="Messages de contact" texte="Les messages envoyés depuis la page Contact. Rappelez chaque personne au créneau qu'elle a choisi." />
      <section className="f-panel">
        <div className="f-onglets" role="tablist" aria-label="Filtrer par objet">
          <button type="button" role="tab" aria-selected={!objet} onClick={() => setObjet("")}>Tous<em>{liste?.length ?? 0}</em></button>
          {OBJETS.map((o) => <button key={o} type="button" role="tab" aria-selected={objet === o} onClick={() => setObjet(o)}>{o}<em>{compte(o)}</em></button>)}
        </div>
        {liste === null ? <Chargement />
          : erreur ? <EtatVide titre="Les messages ne peuvent pas être chargés." texte="Réessayez dans un instant. Chaque message est aussi transmis par e-mail à FIDELEM." />
          : filtres.length ? (
            <ul className="f-messages">
              {filtres.map((m) => {
                const tel = m.telephone.replace(/\s/g, "");
                return (
                  <li key={m.id} className="f-message">
                    <div className="f-message__tete">
                      <span className="f-table__usager"><strong style={{ fontWeight: 500 }}>{m.prenom} {m.nom}</strong><small>Reçu le {dateCourte(m.created_at)}</small></span>
                      <span className="f-pastille" style={{ background: m.objet === "EasyLife" ? "var(--f-or-clair)" : "rgba(18, 26, 46, .07)" }}>{m.objet}</span>
                    </div>
                    <p className="f-message__texte">{m.message}</p>
                    <div className="f-message__pied">
                      <span className="f-note">{m.rendezVous?.date ? `Rappel souhaité : ${rdvCourt(m.rendezVous)}${m.rendezVous.contactPrefere ? `, par ${m.rendezVous.contactPrefere.toLowerCase()}` : ""}` : "Pas de créneau indiqué"}</span>
                      <span className="f-app__actions">
                        <a className="f-btn f-btn--icone f-btn--encre" href={`tel:${tel}`}><Phone /> {m.telephone}</a>
                        <a className="f-btn f-btn--icone f-btn--gris" href={`https://wa.me/229${tel.replace(/^\+?229/, "")}`} target="_blank" rel="noreferrer" aria-label={`WhatsApp de ${m.prenom} ${m.nom}`}><MessageCircle /> WhatsApp</a>
                        {m.email && <a className="f-btn f-btn--icone f-btn--gris" href={`mailto:${m.email}`} aria-label={`E-mail à ${m.prenom} ${m.nom}`}><Mail /> E-mail</a>}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : <EtatVide titre={objet ? `Aucun message « ${objet} ».` : "Aucun message."} texte="Les messages envoyés depuis la page Contact apparaîtront ici." />}
      </section>
    </>
  );
}

/* ----------------------------- EasyLife ----------------------------- */

function EasyLifeDemandes() {
  const [liste, setListe] = useState<InteretRecu[] | null>(null);
  const [erreur, setErreur] = useState(false);
  useEffect(() => { interetsEasyLife().then(setListe).catch(() => { setListe([]); setErreur(true); }); }, []);
  return (
    <>
      <TetePage sur="Back-office" titre="Demandes EasyLife" texte="Les personnes et entreprises intéressées par EasyLife, y compris les messages de contact dont l'objet est EasyLife." />
      <section className="f-panel">
        {liste === null ? <Chargement />
          : erreur ? <EtatVide titre="Les demandes EasyLife ne peuvent pas être chargées." texte="Réessayez dans un instant." />
          : liste.length ? <div className="f-defile-x"><table className="f-table"><thead><tr><th>Contact</th><th>Profil</th><th>Pôle</th><th>Téléphone</th><th>Message</th></tr></thead><tbody style={{ cursor: "default" }}>
            {liste.map((l) => <tr key={l.id} style={{ cursor: "default" }}><td>{l.prenom} {l.nom}</td><td>{l.profil || "—"}</td><td>{l.pole || "—"}</td><td className="num">{l.telephone}</td><td>{l.message || "—"}</td></tr>)}
          </tbody></table></div>
          : <EtatVide titre="Aucune demande EasyLife." texte="Les nouvelles demandes apparaîtront ici." />}
      </section>
    </>
  );
}

/* ----------------------------- Profil ----------------------------- */

function Profil() {
  const { user } = useAuth();
  const [edition, setEdition] = useState(false);
  return (
    <>
      <TetePage sur="Back-office" titre="Mon profil" actions={<button type="button" className="f-btn f-btn--encre" onClick={() => setEdition(true)}>Modifier</button>} />
      <section className="f-panel"><dl className="f-dl"><div><dt>Nom</dt><dd>{user?.name} {user?.last_name}</dd></div><div><dt>E-mail</dt><dd>{user?.email}</dd></div><div><dt>Téléphone</dt><dd>{user?.phone || "—"}</dd></div><div><dt>Adresse</dt><dd>{user?.address || "—"}</dd></div></dl></section>
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
      { libelle: "Messages", chemin: "/responsable/messages", icone: Mail },
      { libelle: "EasyLife", chemin: "/responsable/easylife", icone: Sparkles },
      { libelle: "Mon profil", chemin: "/responsable/profil", icone: UserCircle },
    ]}>
      <Routes>
        <Route index element={<VueEnsemble />} />
        <Route path="conseillers" element={<Conseillers />} />
        <Route path="usagers" element={<Usagers />} />
        <Route path="demandes/*" element={<Demandes />} />
        <Route path="zones" element={<Zones />} />
        <Route path="messages" element={<Messages />} />
        <Route path="easylife" element={<EasyLifeDemandes />} />
        <Route path="profil" element={<Profil />} />
        <Route path="*" element={<Navigate to="/responsable" replace />} />
      </Routes>
    </CadreEspace>
  );
}
