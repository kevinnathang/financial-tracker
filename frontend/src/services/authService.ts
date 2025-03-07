// src/services/authService.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000/v1/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        (config.headers as any)['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },  
    logout: async () => {
        await api.post('/auth/logout');
        localStorage.removeItem('token');
    },
    requestResetPassword: async (email: string) => {
        const response = await api.post('/auth/request-reset-password', { email })
        return response.data
    },
    resetPassword: async (token: string, password: string) => {
        await api.post(`/auth/reset-password/${token}`, { password })
    }
};

export default api;