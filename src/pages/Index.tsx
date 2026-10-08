
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  LineChart, 
  Users, 
  ChevronRight, 
  CheckCircle2,
  Clock,
  Home,
  Car,
  Briefcase,
  ArrowRight,
  GraduationCap,
  MapPin
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SimulateurRapide } from "@/components/SimulateurRapide";
import { FINANCEMENTS, EASYLIFE } from "@/donnees/fidelem";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <FinancementsSection />
      <HowItWorksSection />
      <EcosystemeSection />
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
              Facilitez l'accès au financement de vos projets
            </h1>
            <p className="text-xl opacity-90">
              Fidelem met en relation les usagers et les conseillers financiers de chaque zone pour un accès simple et sécurisé aux solutions de financement.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/services">
                <Button className="bg-white text-fidelem hover:bg-white/90 text-lg py-6 px-8">
                  Découvrir nos services
                </Button>
              </Link>
              <Link to="/trouver-un-conseiller">
                <Button className="bg-fidelem-secondary text-fidelem hover:bg-fidelem-secondary/90 text-lg py-6 px-8">
                  Trouver un conseiller
                </Button>
              </Link>
             
            </div>
          </div>
          <SimulateurRapide />
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
        "Estimez vos mensualités pour un financement immobilier, transport ou d'affaires avec notre simulateur facile à utiliser.",
    },
    {
      icon: <Users size={40} className="text-fidelem" />,
      title: "Accompagnement personnalisé",
      description:
        "Chaque usager est accompagné par un conseiller financier de sa zone, qui l'aide à trouver la meilleure solution de financement.",
    },
  ];

  return (
    <section className="py-20 bg-fidelem-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-fidelem mb-4">Pourquoi choisir Fidelem</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Notre plateforme vous offre des outils simples pour faciliter vos démarches de financement
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

// Financements
const ICONES_FINANCEMENT = { immobilier: Home, transport: Car, affaires: Briefcase };

const FinancementsSection = () => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-fidelem mb-4">Nos financements</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Trois familles de financement, un conseiller pour monter votre dossier
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {FINANCEMENTS.map((f) => {
          const Icone = ICONES_FINANCEMENT[f.slug];
          return (
            <Link key={f.slug} to={`/services/${f.slug}`}
              className="group bg-fidelem-light rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow flex flex-col">
              <Icone size={40} className="text-fidelem mb-4" />
              <h3 className="text-xl font-semibold mb-2">{f.nom}</h3>
              <p className="text-gray-600 flex-1">{f.resume}</p>
              <span className="mt-4 inline-flex items-center gap-1 font-medium text-fidelem">
                En savoir plus <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  </section>
);

// EasyLife et conseillers
const EcosystemeSection = () => (
  <section className="py-20 bg-fidelem-light">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl p-8 shadow-md flex flex-col">
        <span className="text-sm font-semibold uppercase tracking-wide text-fidelem-secondary">EasyLife</span>
        <h3 className="text-2xl font-bold text-fidelem mt-2 mb-3">Financer vos biens et votre quotidien</h3>
        <p className="text-gray-600 flex-1">{EASYLIFE.volets[0].texte}</p>
        <Link to="/easylife" className="mt-6">
          <Button className="bg-fidelem hover:bg-fidelem/90">Découvrir EasyLife</Button>
        </Link>
      </div>
      <div className="bg-white rounded-xl p-8 shadow-md flex flex-col">
        <span className="text-sm font-semibold uppercase tracking-wide text-fidelem-secondary">Conseiller financier</span>
        <h3 className="text-2xl font-bold text-fidelem mt-2 mb-3">Un conseiller dans chaque zone</h3>
        <ul className="space-y-3 text-gray-600 flex-1">
          <li className="flex gap-3"><MapPin className="text-fidelem shrink-0" size={20} />Trouvez le conseiller financier de votre commune.</li>
          <li className="flex gap-3"><GraduationCap className="text-fidelem shrink-0" size={20} />Devenez conseiller : trois niveaux de formation, une licence et une zone.</li>
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/trouver-un-conseiller"><Button className="bg-fidelem hover:bg-fidelem/90">Trouver un conseiller</Button></Link>
          <Link to="/conseiller-financier"><Button variant="outline">Devenir conseiller</Button></Link>
        </div>
      </div>
    </div>
  </section>
);

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
      title: "Votre demande en ligne",
      description:
        "Choisissez votre financement, décrivez votre projet et indiquez vos disponibilités.",
      icon: <Users size={24} />,
    },
    {
      number: "02",
      title: "Un conseiller de votre zone",
      description:
        "Un conseiller financier formé par Fidelem, installé dans votre zone, vous contacte et fixe le rendez-vous.",
      icon: <CheckCircle2 size={24} />,
    },
    {
      number: "03",
      title: "Le montage du dossier",
      description:
        "Il étudie vos revenus, votre contrat et votre projet, puis monte le dossier avec vous.",
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
            Un processus simple et transparent pour financer votre projet
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
        "Grâce à Fidelem, j'ai pu obtenir un financement immobilier dans de très bonnes conditions. Le conseiller a été d'une aide précieuse tout au long du processus.",
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
        "L'interface est intuitive et le simulateur très clair. J'ai pu financer mon véhicule de travail en quelques jours seulement.",
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
              <Link to="/conseiller-financier">
                <Button className="bg-fidelem-secondary text-fidelem hover:bg-fidelem-secondary/90 text-lg py-6 px-8">
                Devenir conseiller
                </Button>
              </Link>
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

export default Index;
