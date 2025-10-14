import api from './api';
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // Fetch base URL from .env

// Login a user
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const sendPasswordResetEmail = async (email) => {
  await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
};

export const resetPassword = async (token, newPassword) => {
  await axios.post(`${API_BASE_URL}/auth/reset-password`, { token, newPassword });
};