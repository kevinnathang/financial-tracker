// src/services/userService.ts
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

export const userService = {
    register: async (email: string, password: string, full_name: string) => {
        const response = await api.post('/user/register', { email, password, full_name });
        return response.data;
    },
}

export default api;