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
import { Connexion, ConnexionConseiller, MotDePasseOublie, ReinitialiserMotDePasse } from "./pages/site/Connexion";
import { DEMO_DISPONIBLE } from "./config/demo";
import { lazy, Suspense } from "react";

// Les espaces connectés et la démo sont chargés à la demande : le site public reste léger.
const EspaceConseiller = lazy(() => import("./pages/espace/EspaceConseiller"));
const EspaceClient = lazy(() => import("./pages/espace/EspaceClient"));
const EspaceResponsable = lazy(() => import("./pages/espace/EspaceResponsable"));
const Demo = lazy(() => import("./pages/site/Demo"));

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

            {DEMO_DISPONIBLE && <Route path="/demo" element={<Suspense fallback={null}><Demo /></Suspense>} />}

            {/* Connexion */}
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/espace-conseiller/connexion" element={<ConnexionConseiller />} />
            <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />
            <Route path="/reinitialiser-mot-de-passe" element={<ReinitialiserMotDePasse />} />

            {/* Espaces connectés */}
            <Route path="/espace-conseiller/*" element={<Suspense fallback={null}><EspaceConseiller /></Suspense>} />
            <Route path="/mon-espace/*" element={<Suspense fallback={null}><EspaceClient /></Suspense>} />
            <Route path="/responsable/*" element={<Suspense fallback={null}><EspaceResponsable /></Suspense>} />

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
