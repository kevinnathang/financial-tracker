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

export default api