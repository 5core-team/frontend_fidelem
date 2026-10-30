import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { CONTACT, FINANCEMENTS } from "@/donnees/fidelem";

const Footer = () => (
  <footer className="bg-gray-900 text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">Fidelem</h3>
          <p className="text-gray-400">
            Cabinet de finance qui facilite l'accès au financement et forme les conseillers financiers, au plus près de chaque zone.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Financements</h4>
          <ul className="space-y-2 text-gray-400">
            {FINANCEMENTS.map((f) => (
              <li key={f.slug}><Link to={`/services/${f.slug}`} className="hover:text-white transition-colors">{f.nom}</Link></li>
            ))}
            <li><Link to="/easylife" className="hover:text-white transition-colors">EasyLife</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Fidelem</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/conseiller-financier" className="hover:text-white transition-colors">Devenir conseiller financier</Link></li>
            <li><Link to="/trouver-un-conseiller" className="hover:text-white transition-colors">Trouver un conseiller</Link></li>
            <li><Link to="/a-propos" className="hover:text-white transition-colors">À propos</Link></li>
            <li><Link to="/faq" className="hover:text-white transition-colors">Questions fréquentes</Link></li>
            <li><Link to="/espace-conseiller/connexion" className="hover:text-white transition-colors">Espace conseiller</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-gray-400">
            <li className="flex gap-2"><Phone size={18} className="shrink-0 mt-0.5" /><a href={`tel:${CONTACT.telephoneLien}`} className="hover:text-white">{CONTACT.telephone}</a></li>
            <li className="flex gap-2"><Mail size={18} className="shrink-0 mt-0.5" /><a href={`mailto:${CONTACT.email}`} className="hover:text-white break-all">{CONTACT.email}</a></li>
            <li className="flex gap-2"><MapPin size={18} className="shrink-0 mt-0.5" /><span>{CONTACT.adresse}, {CONTACT.pays}</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Fidelem. Tous droits réservés.</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
          <Link to="/mentions-legales" className="hover:text-white">Mentions légales</Link>
          <Link to="/confidentialite" className="hover:text-white">Confidentialité</Link>
          <Link to="/conditions" className="hover:text-white">Conditions d'utilisation</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
