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
/*export const register = async (name, last_name, email, phone, address, password, role) => {
  const response = await axiosInstance.post('/register', { name, last_name, email, phone, address, password, role });
  return response;
};*/

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
  // profileData doit contenir: firstName, lastName, email, phone (optionnel), address (optionnel)
  return axiosInstance.post('/update-profile', profileData);
};

// ✅ Mise à jour du mot de passe
export const updatePassword = (passwordData) => {
  // passwordData doit contenir: currentPassword, newPassword, newPassword_confirmation
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


// Mettre à jour le statut d'une demande de crédit
export const updateCreditRequestStatus = (id, status) => {
  return axiosInstance.put(`/credit-requests/${id}/status`, { status });
};



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
    const response = await axios.get('/api/credit-requests-admin');
    console.log(response.data); // Affichez les données dans la console
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes de crédit:", error);
    throw error;
  }
};
export const approveCreditRequest = async (id) => {
  const response = await axios.post(`/api/credit-requests/${id}/approve`);
  return response.data;
};

export const rejectCreditRequest = async (id) => {
  const response = await axios.post(`/api/credit-requests/${id}/reject`);
  return response.data;
};

export const deleteCreditRequest = async (id) => {
  const response = await axios.delete(`/api/credit-requests/${id}`);
  return response.data;
};