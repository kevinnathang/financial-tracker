import { useQuery, useMutation } from 'react-query';
import  authService  from '../services/authService';
import  userService  from '../services/userService';
import { queryClient } from '../lib/reactQuery';

export interface User {
  id: string;
  email: string;
  full_name: string;
  balance: number;
}

export const USER_QUERY_KEY = 'userData';

export const useUserData = () => {
  return useQuery<User | null>(
    USER_QUERY_KEY,
    async () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    },
    {
      refetchOnMount: false,
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
    async (userData: { email: string; password: string; full_name: string }) => {
      return await userService.registerUser(
        userData.email,
        userData.password,
        userData.full_name
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