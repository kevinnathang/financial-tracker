import { useQuery, useMutation, useQueryClient } from 'react-query';
import  authService  from '../services/authService';
import  userService  from '../services/userService';
import { User, UpdateUserPayload } from '../services/userService';
import { queryClient } from '../lib/reactQuery';

export const USER_QUERY_KEY = 'userData';

export const useUserData = (id: string) => {
  return useQuery<User | null>(
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

export const useLogin = () => {
  return useMutation(
    async (credentials: { email: string; password: string }) => {
      return await authService.login(credentials.email, credentials.password);
    },
    {
      onSuccess: (data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        queryClient.setQueryData(USER_QUERY_KEY, data.user);
      },
      onError: () => {
        console.error(`QUERY - Error using useLogin.`);
      },
    }
  );
};

export const useLogout = () => {
  return useMutation(
    async () => {
      return await authService.logout();
    },
    {
      onSuccess: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        queryClient.setQueryData(USER_QUERY_KEY, null);
      },
      onError: () => {
        console.error(`QUERY - Error using useLogout.`);
      },
    }
  );
};

export const useRegister = () => {
  return useMutation(
    async (userData: { email: string; password: string; first_name: string, middle_name: string, last_name: string }) => {
      return await userService.registerUser(
        userData.email,
        userData.password,
        userData.first_name,
        userData.middle_name,
        userData.last_name
      );
    },
    {
      onSuccess: (data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        queryClient.setQueryData(USER_QUERY_KEY, data.user);
      },
      onError: () => {
        console.error(`QUERY - Error using useRegister.`);
      },
    }
  );
};

export const useRequestPasswordReset = () => {
  return useMutation(
    async (email: string) => {
      return await authService.requestResetPassword(email);
    },
    {
      onError: () => {
        console.error(`QUERY - Error using useRequestPasswordReset.`);
      },
    }
  );
}

export const useResetPassword = () => {
  return useMutation(
    async (data: { token: string; password: string }) => {
      return await authService.resetPassword(data.token, data.password);
    },
    {
      onError: () => {
        console.error(`QUERY - Error using useResetPassword.`);
      },
    }
  );
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, UpdateUserPayload>(
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