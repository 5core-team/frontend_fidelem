import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Remplace avec ton URL si besoin

// Récupérer le token d'authentification
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};



// Créer une instance axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${getAuthToken()}`,
    'Content-Type': 'application/json',
  }
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


// Met à jour le token dynamiquement si besoin
export const setAuthToken = (token) => {
  axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
};


axiosInstance.interceptors.request.use(
  config => {
    console.log('Token:', getAuthToken());
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);



// Enregistrement
export const register = (userData) => {
  return axiosInstance.post('/register', userData);
};

// Connexion
/*export const login = (email, password) => {
  return axiosInstance.post('/login', { email, password });
};*/

export const login = async (email, password) => {
  const response = await axiosInstance.post('/login', { email, password });
  const token = response.data.token;
  localStorage.setItem('authToken', token);
  setAuthToken(token); // Mettre à jour le token dans Axios
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
export const getCreditRequests = () => {
  return axiosInstance.get('/credit-requests');
};

// Mettre à jour le statut d'une demande de crédit
export const updateCreditRequestStatus = (id, status) => {
  return axiosInstance.put(`/credit-requests/${id}/status`, { status });
};
