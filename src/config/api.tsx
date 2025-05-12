import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Replace with your Laravel backend URL

export const register = (name, last_name, email, phone, address, password, type_compte) => { // Changed to last_name
  return axios.post(`${API_URL}/register`, { name, last_name, email, phone, address, password, type_compte });
};

export const login = (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};
