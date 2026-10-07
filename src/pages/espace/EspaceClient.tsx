import { useCallback, useEffect, useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import { LayoutDashboard, UserCircle, Plus, Loader2, Phone, MessageCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import CadreEspace, { Chiffre, EtatVide, PastilleStatut, TetePage } from "@/components/espace/CadreEspace";
import { AddCreditRequestForm } from "@/components/AddCreditRequestForm";
import { EditProfileForm } from "@/components/EditProfileForm";
import { demandesUsager, type Demande } from "@/config/apiEspace";
import { CONTACT, formatFcfa } from "@/donnees/fidelem";

const dateCourte = (s?: string) => (s ? new Date(s).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : "—");

function MesDemandes() {
  const { user } = useAuth();
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(false);
  const [nouvelle, setNouvelle] = useState(false);

  const charger = useCallback(async () => {
    if (!user) return;
    setChargement(true);
    try { setDemandes(await demandesUsager()); setErreur(false); } catch { setErreur(true); } finally { setChargement(false); }
  }, [user]);
  useEffect(() => { charger(); }, [charger]);

  const enCours = demandes.filter((d) => !["Acceptée", "Refusée"].includes(d.statut));
  const prochain = demandes.find((d) => d.rendezVous?.date && new Date(d.rendezVous.date) >= new Date(new Date().toDateString()));
  // Le conseiller attitré du compte, ou à défaut celui qui suit la dernière demande.
  const suivi = demandes.find((d) => d.conseiller)?.conseiller;
  const conseillerNom = user?.conseiller_nom ?? suivi?.nom;
  const conseillerTel = user?.conseiller_telephone ?? suivi?.telephone;

  return (
    <>
      <TetePage sur="Mon espace" titre={`Bonjour ${user?.name ?? ""}.`} texte="Suivez vos demandes de financement et vos rendez-vous." actions={<button type="button" className="f-btn f-btn--icone f-btn--or" onClick={() => setNouvelle(true)}><Plus /> Nouvelle demande</button>} />
      <div className="f-chiffres">
        <Chiffre accent libelle="Demandes en cours" valeur={chargement ? "…" : enCours.length} />
        <Chiffre libelle="Demandes au total" valeur={chargement ? "…" : demandes.length} />
        <Chiffre libelle="Financements acceptés" valeur={chargement ? "…" : demandes.filter((d) => d.statut === "Acceptée").length} />
        <Chiffre libelle="Prochain rendez-vous" valeur={<span style={{ fontSize: "1.3rem" }}>{prochain ? dateCourte(prochain.rendezVous?.date) : "—"}</span>} />
      </div>
      <div className="f-deux-col">
        <section className="f-panel">
          <h2 className="f-titre-m">Mes demandes</h2>
          {chargement ? <p className="f-texte" style={{ display: "flex", gap: 10 }}><Loader2 className="animate-spin" /> Chargement</p>
            : erreur ? <EtatVide titre="Vos demandes ne peuvent pas être chargées." texte={`Réessayez dans un instant ou appelez le ${CONTACT.telephone}.`} action={<button type="button" className="f-btn f-btn--gris" onClick={charger}>Réessayer</button>} />
            : demandes.length ? (
              <div style={{ display: "grid", gap: 8 }}>
                {demandes.map((d) => (
                  <article key={d.id} className="f-carte-demande" style={{ display: "grid", gap: 10, padding: 16, border: "1px dashed var(--f-guide)", borderRadius: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}><strong style={{ fontWeight: 500 }}>{d.objet || d.financement}</strong><PastilleStatut statut={d.statut} /></div>
                    <div className="f-note">{d.montant ? formatFcfa(d.montant) : ""}{d.duree ? ` · ${d.duree} mois` : ""} · envoyée le {dateCourte(d.creeLe)}</div>
                    {d.rendezVous?.date && <div className="f-note">Rendez-vous : {dateCourte(d.rendezVous.date)} · {d.rendezVous.creneau} · {d.rendezVous.mode}</div>}
                  </article>
                ))}
              </div>
            ) : <EtatVide titre="Aucune demande pour l'instant." texte="Décrivez votre projet : un conseiller de votre zone vous recontacte." action={<button type="button" className="f-btn f-btn--or" onClick={() => setNouvelle(true)}>Faire une demande</button>} />}
        </section>
        <aside style={{ display: "grid", gap: 16 }}>
          <section className="f-panel f-mon-conseiller">
            <p className="f-label f-label--doux">Mon conseiller</p>
            {conseillerNom ? (
              <>
                <div className="f-mon-conseiller__id">
                  <span className="f-app__avatar">{conseillerNom.split(" ").map((m) => m[0]).join("").slice(0, 2).toUpperCase()}</span>
                  <span><strong>{conseillerNom}</strong><small>Conseiller FIDELEM de votre zone</small></span>
                </div>
                {conseillerTel && (
                  <div className="f-mon-conseiller__actions">
                    <a className="f-btn f-btn--icone f-btn--encre" href={`tel:${conseillerTel.replace(/\s/g, "")}`}><Phone /> {conseillerTel}</a>
                    <a className="f-btn f-btn--icone f-btn--gris" href={`https://wa.me/229${conseillerTel.replace(/\s/g, "").replace(/^\+?229/, "")}`} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp</a>
                  </div>
                )}
              </>
            ) : <p className="f-texte">Un conseiller de votre zone vous est attribué dès votre première demande.</p>}
            <Link className="f-mon-conseiller__lien" to="/trouver-un-conseiller">Trouver un autre conseiller <ArrowRight /></Link>
          </section>
        </aside>
      </div>
      <AddCreditRequestForm open={nouvelle} onOpenChange={setNouvelle} onCree={charger} />
    </>
  );
}

function Profil() {
  const { user } = useAuth();
  const [edition, setEdition] = useState(false);
  return (
    <>
      <TetePage sur="Mon espace" titre="Mon profil" actions={<button type="button" className="f-btn f-btn--encre" onClick={() => setEdition(true)}>Modifier</button>} />
      <section className="f-panel">
        <dl className="f-dl">
          <div><dt>Nom</dt><dd>{user?.name} {user?.last_name}</dd></div>
          <div><dt>E-mail</dt><dd>{user?.email}</dd></div>
          <div><dt>Téléphone</dt><dd>{user?.phone || "—"}</dd></div>
          <div><dt>Adresse</dt><dd>{user?.address || "—"}</dd></div>
        </dl>
      </section>
      <EditProfileForm open={edition} onOpenChange={setEdition} />
    </>
  );
}

export default function EspaceClient() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/connexion" replace />;
  if (user.role !== "user") return <Navigate to={user.role === "advisor" ? "/espace-conseiller" : "/responsable"} replace />;
  return (
    <CadreEspace titreEspace="Mon espace" liens={[
      { libelle: "Mes demandes", chemin: "/mon-espace", icone: LayoutDashboard, fin: true },
      { libelle: "Mon profil", chemin: "/mon-espace/profil", icone: UserCircle },
    ]}>
      <Routes>
        <Route index element={<MesDemandes />} />
        <Route path="profil" element={<Profil />} />
        <Route path="*" element={<Navigate to="/mon-espace" replace />} />
      </Routes>
    </CadreEspace>
  );
}
