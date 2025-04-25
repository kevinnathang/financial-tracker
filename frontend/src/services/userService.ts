// src/services/userService.ts
import api from "./api";
import { User } from '../../src/types'

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

    updateUser: async(userId: string, userData: User.UserPayload): Promise<any> => {
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