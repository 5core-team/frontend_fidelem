import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { login as loginAPI, logout as logoutAPI, moi, type Utilisateur } from "@/config/api";
import { CLE_JETON, CLE_UTILISATEUR, quandSessionExpire } from "@/config/http";
import { modeDemo } from "@/config/demo";

export type { Utilisateur };

type AuthContextType = {
  user: Utilisateur | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<Utilisateur>;
  logout: () => Promise<void>;
  /** Recharge l'utilisateur depuis l'API (après une modification du profil, par exemple). */
  rafraichir: () => Promise<void>;
  /** Remplace l'utilisateur en session par la version renvoyée par l'API. */
  majUtilisateur: (u: Utilisateur) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const stocker = (u: Utilisateur | null, jeton?: string) => {
  try {
    if (u) localStorage.setItem(CLE_UTILISATEUR, JSON.stringify(u)); else localStorage.removeItem(CLE_UTILISATEUR);
    if (jeton) localStorage.setItem(CLE_JETON, jeton);
    if (!u) localStorage.removeItem(CLE_JETON);
  } catch { /* stockage indisponible : la session ne survivra pas au rechargement */ }
};

const lireSession = (): Utilisateur | null => {
  try {
    const u = localStorage.getItem(CLE_UTILISATEUR);
    return u && localStorage.getItem(CLE_JETON) ? (JSON.parse(u) as Utilisateur) : null;
  } catch {
    stocker(null);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Utilisateur | null>(null);
  const [loading, setLoading] = useState(true);

  const fermer = useCallback(() => { stocker(null); setUser(null); }, []);

  const majUtilisateur = useCallback((u: Utilisateur) => { stocker(u); setUser(u); }, []);

  const rafraichir = useCallback(async () => {
    const { data } = await moi();
    majUtilisateur(data);
  }, [majUtilisateur]);

  useEffect(() => {
    const enSession = lireSession();
    setUser(enSession);
    setLoading(false);
    // Le jeton est revérifié en arrière-plan : un compte rejeté ou une session expirée est déconnecté.
    if (enSession && !modeDemo()) rafraichir().catch(() => {});
  }, [rafraichir]);

  // Quand l'API refuse le jeton, la session est fermée et l'usager renvoyé vers la connexion.
  useEffect(() => {
    quandSessionExpire(() => {
      const role = lireSession()?.role;
      fermer();
      const chemin = role === "user" ? "/connexion" : "/espace-conseiller/connexion";
      if (!window.location.pathname.endsWith("/connexion")) window.location.assign(`${chemin}?session=expiree`);
    });
  }, [fermer]);

  const login = async (email: string, password: string) => {
    const { data } = await loginAPI(email, password);
    stocker(data.user, data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try { if (!modeDemo()) await logoutAPI(); } catch { /* la session locale est fermée quoi qu'il arrive */ }
    fermer();
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout, rafraichir, majUtilisateur }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
