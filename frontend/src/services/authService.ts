// src/services/authService.ts
import api from "./api";

const authService = {
    initiateUserRegistration: async (email: string, password: string, first_name: string, middle_name: string, last_name: string) => {
        try {
            const response = await api.post('/auth/register', { email, password, first_name, middle_name, last_name });
            return response.data;
        } catch (error) {
            console.error('SERVICE - Error in initiateUserRegistration');
            throw error;
        }
    },

    verifyUser: async (verificationToken: string) => {
        try {
            const response = await api.post(`/auth/verify/${verificationToken}`);
            return response.data;
        } catch (error) {
            console.error('SERVICE - Error in verifyUser');
            throw error;
        }
    },

    login: async (email: string, password: string) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            return response.data;
        } catch (error) {
            console.error('SERVICE - Error in login');
            throw error; 
        }
    },  
    logout: async () => {
        try {
            await api.post('/auth/logout');
            localStorage.removeItem('token');
        } catch (error) {
            console.error('SERVICE - Error in logout');
            throw error; 
        }
    },
    requestResetPassword: async (email: string) => {
        try {
            const response = await api.post('/auth/request-reset-password', { email })
            return response.data
        } catch (error) {
            console.error('SERVICE - Error in requestResetPassword');
            throw error; 
        }
    },
    resetPassword: async (token: string, password: string) => {
        try {
            await api.post(`/auth/reset-password/${token}`, { password })
        } catch (error) {
            console.error('SERVICE - Error in resetPassword');
            throw error; 
        }
    }
};

export default authService