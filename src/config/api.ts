import { http } from "./http";

// Authentification, profil et gestion des comptes (back-office).

export type Role = "user" | "advisor" | "manager";

export type Utilisateur = {
  id: string | number;
  name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  role: Role;
  statut?: string;
  created_by?: number | null;
  zone?: string | null;
  niveau?: string | null;
  financements?: string[];
  conseiller_nom?: string | null;
  conseiller_telephone?: string | null;
};

export type Compte = {
  id: string | number;
  name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  type_compte: Role;
  statut: "Actif" | "En attente" | "Rejeté";
  zone?: string | null;
  niveau?: string | null;
  financements?: string[];
  created_at: string;
};

export const login = (email: string, password: string) => http.post<{ token: string; user: Utilisateur }>("/login", { email, password });
export const logout = () => http.post("/logout");
export const moi = () => http.get<Utilisateur>("/me");

export const updateProfile = (d: { firstName: string; lastName: string; email: string; phone?: string; address?: string }) =>
  http.post<{ message: string; user: Utilisateur }>("/update-profile", d);
export const updatePassword = (d: { currentPassword: string; newPassword: string; newPassword_confirmation: string }) =>
  http.post<{ message: string }>("/update-password", d);

export const demanderReinitialisation = (email: string) => http.post("/mot-de-passe/oubli", { email });
export const reinitialiserMotDePasse = (d: { token: string; email: string; password: string; password_confirmation: string }) =>
  http.post<{ message: string }>("/mot-de-passe/reinitialiser", d);

// Back-office
export const getUsers = () => http.get<Compte[]>("/users");
export const approveUser = (id: string | number) => http.post(`/users/${id}/approve`);
export const rejectUser = (id: string | number) => http.post(`/users/${id}/reject`);
export const deleteUser = (id: string | number) => http.delete(`/users/${id}`);
export const getUserStats = () => http.get<{ totalUsers: number; totalAdvisors: number; pendingUsers: number }>("/user-stats");
export const getCreditStats = () => http.get<{ total: number; montantTotal: number; parStatut: Record<string, number> }>("/credit-stats");
