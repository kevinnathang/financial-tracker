// src/services/userService.ts
import api from "./api";

const userService = {
    register: async (email: string, password: string, full_name: string) => {
        const response = await api.post('/user/register', { email, password, full_name });
        return response.data;
    },
}

export default userService;