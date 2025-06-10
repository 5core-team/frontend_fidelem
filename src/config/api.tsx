import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Créer une instance axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Ajoutez un intercepteur de requête pour inclure dynamiquement le token
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Fonction pour mettre à jour le token
export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers['Authorization'];
  }
};

// Connexion
export const login = async (email, password) => {
  const response = await axiosInstance.post('/login', { email, password });
  return response;
};

// Inscription
export const register = async (data: {
  name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
  type_compte: string;
  created_by?: number;
}) => {
  const response = await axiosInstance.post('/register', {
    name: data.name,
    last_name: data.last_name,
    email: data.email,
    phone: data.phone || '',
    address: data.address || '',
    type_compte: data.type_compte,
    password: data.password,
    created_by: data.created_by
  });
  return response;
};


// ✅ Mise à jour du profil utilisateur
export const updateProfile = (profileData) => {
  return axiosInstance.post('/update-profile', profileData);
};

// ✅ Mise à jour du mot de passe
export const updatePassword = (passwordData) => {
  return axiosInstance.post('/update-password', passwordData);
};

// Récupérer stats (conseiller)
export const getUserStatsAdvisor = () => {
  return axiosInstance.get('/user-stats-advisor');
};

// Filtrer par type
export const getUsersByType = (type) => {
  return axiosInstance.get(`/users?type_compte=${type}`);
};

// Liste utilisateurs
export const getUsers = () => {
  return axiosInstance.get('/users');
};

// Statistiques utilisateurs
export const getUserStats = () => {
  return axiosInstance.get('/user-stats');
};

// Statistiques crédits
export const getCreditStats = () => {
  return axiosInstance.get('/credit-stats');
};

// Approbation utilisateur
export const approveUser = (id) => {
  return axiosInstance.post(`/users/${id}/approve`);
};

// Rejet utilisateur
export const rejectUser = (id) => {
  return axiosInstance.post(`/users/${id}/reject`);
};

// Suppression utilisateur
export const deleteUser = (id) => {
  return axiosInstance.delete(`/users/${id}`);
};



// Créer une demande de crédit
export const createCreditRequest = (creditRequestData) => {
  return axiosInstance.post('/credit-requests', creditRequestData);
};

// Récupérer les demandes de crédit


export const getActiveCredits = async (userId) => {
  const response = await axiosInstance.get(`/active-credits?userId=${userId}`);
  return response.data;
};



// Récupérer les clients d'un conseiller
export const getClientsByAdvisor = (advisorId) => {
  return axiosInstance.get(`/advisor/${advisorId}/clients`);
};

// Récupérer les demandes de crédit d'un conseiller
export const getCreditRequestsByAdvisor = (advisorId) => {
  return axiosInstance.get(`/advisor/${advisorId}/credit-requests`);
};

// Récupérer les stats d'un conseiller
export const getAdvisorStats = (advisorId) => {
  return axiosInstance.get(`/advisor/${advisorId}/stats`);
};

export const getCreditRequests = async (userId) => {
  const response = await axiosInstance.get(`/credit-requests?userId=${userId}`);
  return response.data;
};


export const getCreditRequestsAdmin = async () => {
  try {
    const response = await axiosInstance.get('/credit-requests-admin');
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes de crédit:", error);
    throw error;
  }
};


export const approveCreditRequest = async (id: string) => {
  try {
    const response = await axiosInstance.post(`/credit-requests/${id}/approve`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'approbation de la demande de crédit:", error);
    throw error;
  }
};

export const rejectCreditRequest = async (id: string) => {
  try {
    const response = await axiosInstance.post(`/credit-requests/${id}/reject`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors du rejet de la demande de crédit:", error);
    throw error;
  }
};

export const deleteCreditRequest = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/credit-requests/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression de la demande de crédit:", error);
    throw error;
  }
};


export const updateCreditRequestStatus = async (id: string, status: "En attente" | "Approuvé" | "Rejeté") => {
  try {
    const response = await axiosInstance.put(`/credit-requests/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut de la demande de crédit:", error);
    throw error;
  }
};