import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Replace with your Laravel backend URL

export const register = (name, last_name, email, phone, address, password, type_compte) => {
  return axios.post(`${API_URL}/register`, { name, last_name, email, phone, address, password, type_compte });
};

export const login = (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
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
