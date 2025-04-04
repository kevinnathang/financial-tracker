// src/services/userService.ts
import api from "./api";

const userService = {
    registerUser: async (email: string, password: string, full_name: string) => {
        try {
            const response = await api.post('/user/register', { email, password, full_name });
            return response.data;
        } catch (error) {
            console.error('SERVICE - Error in registerUser');
            throw error;
        }
    },
}

export default userService;