// src/services/authService.ts
import api from "./api";

const authService = {
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

export default authService