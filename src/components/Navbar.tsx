import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, UserCircle, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NAVIGATION } from "@/donnees/fidelem";
import { cheminEspace, libelleRole } from "@/lib/espaces";
import logo from "@/assets/logo.png";

const lienClasse = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? "text-fidelem" : "text-gray-600 hover:text-fidelem"}`;

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center" aria-label="Fidelem, accueil">
            <img src={logo} alt="Fidelem" className="h-40 w-auto" />
          </Link>

          {/* Navigation (ordre demandé par FIDELEM) */}
          <div className="hidden lg:flex items-center space-x-1">
            {NAVIGATION.map((lien) => (
              <NavLink key={lien.chemin} to={lien.chemin} end={lien.chemin === "/"} className={lienClasse}>
                {lien.libelle}
              </NavLink>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <UserCircle size={20} />
                    <span>{user?.name}</span>
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-medium">{user?.email}</div>
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">{libelleRole(user?.role)}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={cheminEspace(user?.role)}>Mon espace</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                    <LogOut size={16} className="mr-2" /> Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/espace-conseiller/connexion" className="text-sm font-medium text-gray-600 hover:text-fidelem">
                  Espace conseiller
                </Link>
                <Link to="/connexion">
                  <Button variant="outline" size="sm">Connexion</Button>
                </Link>
              </>
            )}
          </div>

          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileMenuOpen}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-fidelem focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAVIGATION.map((lien) => (
              <Link
                key={lien.chemin}
                to={lien.chemin}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-fidelem-light hover:text-fidelem"
              >
                {lien.libelle}
              </Link>
            ))}
            <div className="border-t border-gray-100 my-2" />
            {isAuthenticated ? (
              <>
                <Link
                  to={cheminEspace(user?.role)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-fidelem-light hover:text-fidelem"
                >
                  Mon espace
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/connexion"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-fidelem-light hover:text-fidelem"
                >
                  Connexion
                </Link>
                <Link
                  to="/espace-conseiller/connexion"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-fidelem-light hover:text-fidelem"
                >
                  Espace conseiller
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
