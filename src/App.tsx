import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Accueil from "./pages/site/Accueil";
import Services from "./pages/site/Services";
import ServiceDetail from "./pages/site/ServiceDetail";
import EasyLife from "./pages/site/EasyLife";
import ConseillerFinancier from "./pages/site/ConseillerFinancier";
import Candidature from "./pages/site/Candidature";
import TrouverConseiller from "./pages/site/TrouverConseiller";
import { APropos, Contact, FAQPage, Legal, PageIntrouvable } from "./pages/site/PagesInfo";
import { Connexion, ConnexionConseiller, MotDePasseOublie } from "./pages/site/Connexion";
import EspaceConseiller from "./pages/espace/EspaceConseiller";
import EspaceClient from "./pages/espace/EspaceClient";
import EspaceResponsable from "./pages/espace/EspaceResponsable";
import Demo from "./pages/site/Demo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" />
        <BrowserRouter>
          <Routes>
            {/* Site public */}
            <Route path="/" element={<Accueil />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/easylife" element={<EasyLife />} />
            <Route path="/conseiller-financier" element={<ConseillerFinancier />} />
            <Route path="/conseiller-financier/candidature" element={<Candidature />} />
            <Route path="/trouver-un-conseiller" element={<TrouverConseiller />} />
            <Route path="/a-propos" element={<APropos />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/mentions-legales" element={<Legal page="mentions-legales" />} />
            <Route path="/confidentialite" element={<Legal page="confidentialite" />} />
            <Route path="/conditions" element={<Legal page="conditions" />} />

            <Route path="/demo" element={<Demo />} />

            {/* Connexion */}
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/espace-conseiller/connexion" element={<ConnexionConseiller />} />
            <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />

            {/* Espaces connectés */}
            <Route path="/espace-conseiller/*" element={<EspaceConseiller />} />
            <Route path="/mon-espace/*" element={<EspaceClient />} />
            <Route path="/responsable/*" element={<EspaceResponsable />} />

            {/* Anciennes adresses */}
            <Route path="/about" element={<Navigate to="/a-propos" replace />} />
            <Route path="/levee" element={<Navigate to="/easylife" replace />} />
            <Route path="/login" element={<Navigate to="/connexion" replace />} />
            <Route path="/register" element={<Navigate to="/conseiller-financier/candidature" replace />} />
            <Route path="/forgot-password" element={<Navigate to="/mot-de-passe-oublie" replace />} />
            <Route path="/pending-approval" element={<Navigate to="/espace-conseiller/connexion" replace />} />
            <Route path="/advisor" element={<Navigate to="/espace-conseiller" replace />} />
            <Route path="/user" element={<Navigate to="/mon-espace" replace />} />
            <Route path="/financial-manager" element={<Navigate to="/responsable" replace />} />
            <Route path="/blog" element={<Navigate to="/" replace />} />
            <Route path="/careers" element={<Navigate to="/" replace />} />

            <Route path="*" element={<PageIntrouvable />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
