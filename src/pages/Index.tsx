
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  LineChart, 
  Users, 
  ChevronRight, 
  CheckCircle2,
  CreditCard,
  Lock,
  Clock
} from "lucide-react";
import Navbar from "../components/Navbar";
import { QuickCreditSimulator } from "@/components/QuickCreditSimulator";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

// Hero Section
const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-fidelem to-fidelem-dark text-white py-20 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Facilitez l'accès au crédit pour vos projets
            </h1>
            <p className="text-xl opacity-90">
              Fidelem connecte les usagers et les conseillers financiers pour un accès simplifié et sécurisé aux solutions de crédit.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/contact">
                <Button className="bg-white text-fidelem hover:bg-white/90 text-lg py-6 px-8">
                  Démarrer maintenant
                </Button>
              </Link>
              <Link to="/services">
                <Button className="bg-white text-fidelem hover:bg-white/90 text-lg py-6 px-8">
                Découvrir nos services
                </Button>
              </Link>
             
            </div>
          </div>
          <QuickCreditSimulator />
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 transform skew-x-12"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-white/5 rounded-tr-full"></div>
    </section>
  );
};

// Features Section
const FeaturesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Set a timeout to simulate intersection observer
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <ShieldCheck size={40} className="text-fidelem" />,
      title: "Sécurisé et fiable",
      description:
        "Vos données financières sont protégées avec les plus hauts standards de sécurité. Notre plateforme garantit la confidentialité de vos informations.",
    },
    {
      icon: <LineChart size={40} className="text-fidelem" />,
      title: "Simulateur avancé",
      description:
        "Estimez précisément vos mensualités et le coût total de votre crédit avec notre simulateur facile à utiliser.",
    },
    {
      icon: <Users size={40} className="text-fidelem" />,
      title: "Accompagnement personnalisé",
      description:
        "Chaque usager est accompagné par un conseiller financier dédié qui l'aide à trouver la meilleure solution de crédit.",
    },
  ];

  return (
    <section className="py-20 bg-fidelem-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-fidelem mb-4">Pourquoi choisir Fidelem</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Notre plateforme innovante vous offre des outils puissants pour faciliter vos démarches de crédit
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow transition-opacity duration-500 transform ${isVisible ? 'opacity-100' : 'opacity-0'}`}
              style={{transitionDelay: `${index * 100}ms`}}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// How It Works Section
const HowItWorksSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Set a timeout to simulate intersection observer
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const steps = [
    {
      number: "01",
      title: "Inscription sur la plateforme",
      description:
        "Créez votre compte en tant qu'usager ou conseiller financier en quelques minutes.",
      icon: <Users size={24} />,
    },
    {
      number: "02",
      title: "Validation du compte",
      description:
        "Les comptes conseillers sont validés par nos responsables financiers pour garantir la qualité de service.",
      icon: <CheckCircle2 size={24} />,
    },
    {
      number: "03",
      title: "Simulation de crédit",
      description:
        "Utilisez notre simulateur pour estimer vos mensualités et le coût total de votre crédit.",
      icon: <LineChart size={24} />,
    },
    {
      number: "04",
      title: "Traitement de la demande",
      description:
        "Votre conseiller analyse votre dossier et vous propose la meilleure solution adaptée à vos besoins.",
      icon: <Clock size={24} />,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-fidelem mb-4">Comment ça fonctionne</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Un processus simple et transparent pour accéder à votre crédit
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative transition-opacity duration-500 transform ${isVisible ? 'opacity-100' : 'opacity-0'}`}
              style={{transitionDelay: `${index * 150}ms`}}
            >
              <div className="bg-fidelem-light rounded-lg p-6 h-full">
                <div className="flex items-start mb-4">
                  <span className="text-3xl font-bold text-fidelem-secondary opacity-60">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                <div className="absolute top-6 right-6 p-2 bg-fidelem text-white rounded-full">
                  {step.icon}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 left-full transform -translate-y-1/2 w-12 h-4">
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      content:
        "Grâce à Fidelem, j'ai pu obtenir un prêt immobilier avec des conditions exceptionnelles. Le conseiller a été d'une aide précieuse tout au long du processus.",
      author: "Sophie Martin",
      role: "Propriétaire",
    },
    {
      content:
        "En tant que conseiller financier, Fidelem me permet de gérer efficacement mes clients et d'offrir un service personnalisé de qualité supérieure.",
      author: "Thomas Dubois",
      role: "Conseiller Financier",
    },
    {
      content:
        "L'interface est intuitive et le simulateur de crédit très précis. J'ai pu financer ma voiture en quelques jours seulement.",
      author: "Julie Lefèvre",
      role: "Cliente",
    },
  ];

  return (
    <section className="py-20 bg-fidelem text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Ce qu'ils disent de Fidelem</h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Découvrez les témoignages de nos utilisateurs satisfaits
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-1"
            >
              <p className="text-lg mb-6 opacity-90">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm opacity-80">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => {
  return (
    <section className="py-20 bg-fidelem-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-fidelem to-fidelem-dark rounded-2xl p-8 md:p-12 shadow-xl text-white">
          <div className="md:flex items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Prêt à démarrer?</h2>
              <p className="text-xl opacity-90">
                Rejoignez Fidelem aujourd'hui et découvrez comment nous pouvons vous aider à concrétiser vos projets.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact">
                <Button className="bg-white text-fidelem hover:bg-white/90 text-lg py-6 px-8">
                Nous contacter
                </Button>
              </Link>
            
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Fidelem</h3>
            <p className="text-gray-400">
              Plateforme de facilitation de crédit innovante et sécurisée pour tous vos projets financiers.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Crédits immobiliers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Prêts personnels</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Crédits auto</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Refinancement</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Entreprise</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Carrières</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Légal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Confidentialité</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Conditions d'utilisation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Protection des données</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Fidelem. Tous droits réservés.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Index;
