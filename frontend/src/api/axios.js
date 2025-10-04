import axios from 'axios';
import { useAuthStore } from '../store/AuthStore';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request interceptor to inject token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token; // get token from Zustand
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
