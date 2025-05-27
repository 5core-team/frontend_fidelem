import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Replace with your Laravel backend URL

export const register = (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

export const login = (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};


export const updateProfile = (profileData) => {
  return axios.post(`${API_URL}/update-profile`, profileData);
};

export const updatePassword = (passwordData) => {
  return axios.post(`${API_URL}/update-password`, passwordData);
};

export const getUserStatsAdvisor = () => {
  return axios.get(`${API_URL}/user-stats-advisor`);
};
export const getUsersByType = (type) => {
  return axios.get(`${API_URL}/users?type_compte=${type}`);
};

export const getUsers = () => {
  return axios.get(`${API_URL}/users`);
};

export const getUserStats = () => {
  return axios.get(`${API_URL}/user-stats`);
};

export const getCreditStats = () => {
  return axios.get(`${API_URL}/credit-stats`);
};

export const approveUser = (id) => {
  return axios.post(`${API_URL}/users/${id}/approve`);
};

export const rejectUser = (id) => {
  return axios.post(`${API_URL}/users/${id}/reject`);
};

export const deleteUser = (id) => {
  return axios.delete(`${API_URL}/users/${id}`);
};
