import { useQuery, useMutation, useQueryClient } from 'react-query';
import  userService  from '../services/userService';
import { User } from '../types';

export const USER_QUERY_KEY = 'userData';

export const useUserData = (id: string) => {
  return useQuery<User.User | null>(
    [USER_QUERY_KEY, id],
    async () => {
      if (!id) return null
      const response = await userService.getUser(id);
      return response.user ?? null
    },
    {
      refetchOnMount: false,
      enabled: !!id
    }
  );
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, User.UpdateUserPayload>(
    async ({ userId, ...userData }) => {
      const response = await userService.updateUser(userId, userData);
      return response;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userData');
        queryClient.invalidateQueries('transactions')
      },
      onError: (error, { userId }) => {
        console.error(`QUERY - Error Updating budget with ID: ${userId}`);
      },
    }
  );
};