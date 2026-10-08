import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Gabarit, { EnTetePage } from "@/components/Gabarit";
import { CONTACT } from "@/donnees/fidelem";
import { envoyerMessageContact } from "@/config/apiPublic";
import {
  BlocCoordonnees, BlocRendezVous, BoutonEnvoi, Champ, Confirmation, MessageErreurEnvoi,
  champClasse, selectClasse, coordonneesVides, rendezVousVide, useEnvoi, validerCoordonnees, validerRendezVous,
} from "@/components/Formulaires";

const OBJETS = ["Demande de financement", "EasyLife", "Devenir conseiller financier", "Autre"];

const Contact = () => {
  const [coord, setCoord] = useState(coordonneesVides());
  const [rdv, setRdv] = useState(rendezVousVide());
  const [objet, setObjet] = useState(OBJETS[0]);
  const [message, setMessage] = useState("");
  const { etat, erreurs, envoyer, messageErreur } = useEnvoi();

  const infos = [
    { icone: Phone, titre: "Téléphone", valeur: <a href={`tel:${CONTACT.telephoneLien}`} className="hover:text-fidelem">{CONTACT.telephone}</a> },
    { icone: Mail, titre: "Email", valeur: <a href={`mailto:${CONTACT.email}`} className="hover:text-fidelem break-all">{CONTACT.email}</a> },
    { icone: MapPin, titre: "Adresse", valeur: <>{CONTACT.adresse}<br />{CONTACT.pays}</> },
    { icone: Clock, titre: "Horaires", valeur: CONTACT.horaires },
  ];

  return (
    <Gabarit>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <EnTetePage titre="Contactez-nous" sousTitre="Notre équipe est à votre disposition pour répondre à toutes vos questions et vous mettre en relation avec un conseiller financier" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {infos.map(({ icone: Icone, titre, valeur }) => (
            <Card key={titre}>
              <CardContent className="flex flex-col items-center text-center p-6">
                <Icone className="h-12 w-12 text-fidelem mb-4" />
                <CardTitle className="mb-2">{titre}</CardTitle>
                <p className="text-gray-600">{valeur}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Envoyez-nous un message</CardTitle>
            <p className="text-gray-600">Prenez rendez-vous avec un conseiller financier et précisez vos disponibilités.</p>
          </CardHeader>
          <CardContent>
            {etat === "succes" ? (
              <Confirmation titre="Message envoyé.">Merci {coord.prenom}. Nous vous recontactons pour confirmer votre rendez-vous du {rdv.date}.</Confirmation>
            ) : (
              <form noValidate className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                const v = { ...validerCoordonnees(coord), ...validerRendezVous(rdv) };
                if (!message.trim()) v.message = "Écrivez votre message.";
                envoyer(v, () => envoyerMessageContact({ ...coord, objet, message, rendezVous: rdv }));
              }}>
                <Champ libelle="Sujet" id="f-objet-contact">
                  <select id="f-objet-contact" className={selectClasse} value={objet} onChange={(e) => setObjet(e.target.value)}>
                    {OBJETS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </Champ>
                <Champ libelle="Message" id="f-message-contact" erreur={erreurs.message}>
                  <textarea id="f-message-contact" rows={5} className={champClasse} value={message} onChange={(e) => setMessage(e.target.value)}
                    aria-invalid={!!erreurs.message} placeholder="Votre message" />
                </Champ>
                <BlocCoordonnees valeur={coord} onChange={setCoord} erreurs={erreurs} avecEmail />
                <BlocRendezVous valeur={rdv} onChange={setRdv} erreurs={erreurs} />
                {etat === "erreur" && <MessageErreurEnvoi message={messageErreur} />}
                <BoutonEnvoi etat={etat}>Envoyer le message</BoutonEnvoi>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </Gabarit>
  );
};

export default Contact;
