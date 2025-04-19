// src/services/userService.ts
import api from "./api";


export interface User {
  id: string;
  email: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  balance: number;
}

export interface UserPayload {
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
}

export interface UpdateUserPayload extends UserPayload {
  userId: string;
}

const userService = {
    getUser: async(id: string) => {
        try {
            const response = await api.get(`/user/${id}`)
            return response.data
        } catch (error) {
            console.error('SERVICE - Error in getUser');
            throw error;
        }
    },

    updateUser: async(userId: string, userData: UserPayload): Promise<any> => {
        try {
          const response = await api.patch(`/user/${userId}`, userData);
          return response.data
        } catch (error) {
          console.error('SERVICE - Error in updateBudget:', error);
          throw error;
        }
      }
}

export default userService;