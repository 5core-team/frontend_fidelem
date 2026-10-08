import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Gabarit, { EnTetePage } from "@/components/Gabarit";
import { FINANCEMENTS, FORMATIONS, ZONES } from "@/donnees/fidelem";
import { envoyerDemandeFinancement, rechercherConseillers, type ConseillerPublic } from "@/config/apiPublic";
import {
  BlocCoordonnees, BlocRendezVous, BoutonEnvoi, Champ, Confirmation, MessageErreurEnvoi,
  champClasse, selectClasse, coordonneesVides, rendezVousVide, useEnvoi, validerCoordonnees, validerRendezVous,
} from "@/components/Formulaires";

type Recherche = "repos" | "chargement" | "resultats" | "vide" | "erreur";

const sansAccent = (s: string) => s.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");

function DemandeRendezVous({ zone, conseiller, onFermer }: { zone: string; conseiller?: ConseillerPublic; onFermer?: () => void }) {
  const [coord, setCoord] = useState(coordonneesVides());
  const [rdv, setRdv] = useState(rendezVousVide(zone));
  const [financement, setFinancement] = useState<string>(FINANCEMENTS[0].slug);
  const [message, setMessage] = useState("");
  const { etat, erreurs, envoyer, messageErreur } = useEnvoi();

  if (etat === "succes") return (
    <Confirmation titre="Demande envoyée.">
      {conseiller ? `${conseiller.prenom} vous recontacte` : "Un responsable Fidelem attribue votre demande au conseiller de votre zone et vous recontacte"} pour confirmer votre rendez-vous du {rdv.date}.
    </Confirmation>
  );

  return (
    <form className="space-y-6" noValidate onSubmit={(e) => {
      e.preventDefault();
      envoyer({ ...validerCoordonnees(coord), ...validerRendezVous(rdv) },
        () => envoyerDemandeFinancement({ ...coord, financement, montant: 0, duree: 0, objet: "Prise de rendez-vous", message, conseillerId: conseiller?.id, rendezVous: rdv }));
    }}>
      <div className="flex justify-between gap-4 items-start">
        <div>
          <p className="text-sm text-gray-500">{conseiller ? "Rendez-vous avec" : "Demande transmise au responsable de zone"}</p>
          <p className="text-2xl font-semibold text-fidelem">{conseiller ? `${conseiller.prenom} ${conseiller.nom.charAt(0)}.` : zone}</p>
        </div>
        {onFermer && <Button type="button" variant="ghost" size="icon" onClick={onFermer} aria-label="Fermer"><X /></Button>}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Champ libelle="Votre besoin" id="f-besoin">
          <select id="f-besoin" className={selectClasse} value={financement} onChange={(e) => setFinancement(e.target.value)}>
            {FINANCEMENTS.map((f) => <option key={f.slug} value={f.slug}>{f.nom}</option>)}
            <option value="conseil">Conseil financier, épargne</option>
          </select>
        </Champ>
        <Champ libelle="Message" id="f-message-rdv" optionnel>
          <input id="f-message-rdv" className={champClasse} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Votre projet en quelques mots" />
        </Champ>
      </div>
      <BlocCoordonnees valeur={coord} onChange={setCoord} erreurs={erreurs} />
      <BlocRendezVous valeur={rdv} onChange={setRdv} erreurs={erreurs} />
      {etat === "erreur" && <MessageErreurEnvoi message={messageErreur} />}
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
  const suggestions = saisie ? ZONES.filter((z) => sansAccent(z).includes(sansAccent(saisie))).slice(0, 6) : [];

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
      <div className="max-w-5xl mx-auto px-4 py-12">
        <EnTetePage titre="Trouver un conseiller financier" sousTitre="Selon votre zone, trouvez le conseiller Fidelem le plus proche de chez vous." />

        <form role="search" className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => {
          e.preventDefault();
          const z = ZONES.find((x) => sansAccent(x) === sansAccent(saisie)) ?? suggestions[0];
          if (z) chercher(z);
        }}>
          <label className="relative flex-1">
            <span className="sr-only">Votre commune</span>
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
            <input id="f-recherche" list="f-zones" className={`${champClasse} h-12 pl-10`} placeholder="Votre commune, ex. Abomey-Calavi"
              value={saisie} onChange={(e) => setSaisie(e.target.value)} autoComplete="off" />
            <datalist id="f-zones">{ZONES.map((z) => <option key={z} value={z} />)}</datalist>
          </label>
          <Button type="submit" className="h-12 px-6 bg-fidelem hover:bg-fidelem/90"><Search className="mr-2 h-5 w-5" /> Rechercher</Button>
        </form>
        <div className="flex flex-wrap gap-2 mt-4 items-center">
          <span className="text-sm text-gray-500 mr-1">Communes fréquentes :</span>
          {ZONES.slice(0, 8).map((z) => (
            <button key={z} type="button" onClick={() => chercher(z)}
              className={`rounded-full border px-3 py-1 text-sm ${zone === z ? "bg-fidelem text-white border-fidelem" : "bg-white text-gray-700 border-gray-300 hover:border-fidelem"}`}>{z}</button>
          ))}
        </div>

        <div className="mt-10" aria-live="polite">
          {etat === "repos" && <p className="text-center text-gray-500 py-10">Choisissez votre commune pour commencer.</p>}
          {etat === "chargement" && <p className="flex items-center gap-2 text-gray-600"><Loader2 className="animate-spin" /> Recherche des conseillers de {zone}…</p>}
          {etat === "resultats" && (
            <>
              <p className="font-medium mb-4">{conseillers.length} conseiller{conseillers.length > 1 ? "s" : ""} à {zone}</p>
              <div className="grid md:grid-cols-2 gap-6">
                {conseillers.map((c) => {
                  const niveau = FORMATIONS.find((f) => f.id === c.niveau);
                  return (
                    <Card key={c.id}>
                      <CardHeader className="flex flex-row items-center gap-4">
                        <div className="h-14 w-14 rounded-full bg-fidelem text-white grid place-items-center text-lg font-semibold overflow-hidden shrink-0">
                          {c.photo ? <img src={c.photo} alt="" className="h-full w-full object-cover" /> : `${c.prenom[0]}${c.nom[0]}`}
                        </div>
                        <div>
                          <CardTitle>{c.prenom} {c.nom.charAt(0)}.</CardTitle>
                          <p className="text-sm text-gray-500">{c.zone}{niveau ? ` · CF ${niveau.nom}` : ""}</p>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {c.financements.map((f) => <span key={f} className="rounded-full bg-fidelem-secondary/20 text-fidelem px-3 py-1 text-xs font-medium">{f}</span>)}
                        </div>
                        <Button className="w-full bg-fidelem hover:bg-fidelem/90" onClick={() => setChoisi(c)}>Prendre rendez-vous</Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
          {(etat === "vide" || etat === "erreur") && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{etat === "vide" ? `Pas encore de conseiller disponible à ${zone}.` : "La recherche n'est pas disponible pour le moment."}</CardTitle>
                <p className="text-gray-600">Laissez votre demande : un responsable Fidelem l'attribue au conseiller le plus proche et vous recontacte.</p>
              </CardHeader>
              <CardContent><DemandeRendezVous zone={zone} /></CardContent>
            </Card>
          )}
          {choisi && (
            <Card className="mt-6"><CardContent className="p-6"><DemandeRendezVous zone={zone} conseiller={choisi} onFermer={() => setChoisi(null)} /></CardContent></Card>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-12 text-center">Vous êtes conseiller ? <Link to="/espace-conseiller/connexion" className="underline text-fidelem">Accédez à votre espace</Link>.</p>
      </div>
    </Gabarit>
  );
}
