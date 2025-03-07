import { useQuery, useMutation } from 'react-query';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { queryClient } from '../lib/reactQuery';

export interface User {
  id: string;
  email: string;
  full_name: string;
  balance: number;
}

// Key for caching user data
export const USER_QUERY_KEY = 'userData';

// Fetch current user data (can be used both on initial load or after login)
export const useUserData = () => {
  return useQuery<User | null>(
    USER_QUERY_KEY,
    async () => {
      // Try to get from localStorage first
      const userData = localStorage.getItem('user');
      if (userData) {
        return JSON.parse(userData);
      }
      
      // If no userData in localStorage but token exists, you could 
      // fetch from API (would need to add this endpoint)
      // Example: const response = await authService.getCurrentUser();
      // return response.data;
      
      return null;
    },
    {
      // Don't refetch on component mount if we already have data
      refetchOnMount: false,
    }
  );
};

// Login mutation
export const useLogin = () => {
  return useMutation(
    async (credentials: { email: string; password: string }) => {
      return await authService.login(credentials.email, credentials.password);
    },
    {
      onSuccess: (data) => {
        // Store in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Update React Query cache
        queryClient.setQueryData(USER_QUERY_KEY, data.user);
      },
    }
  );
};

// Logout mutation
export const useLogout = () => {
  return useMutation(
    async () => {
      return await authService.logout();
    },
    {
      onSuccess: () => {
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Clear React Query cache
        queryClient.setQueryData(USER_QUERY_KEY, null);
      },
    }
  );
};

// Register mutation
export const useRegister = () => {
  return useMutation(
    async (userData: { email: string; password: string; full_name: string }) => {
      return await userService.register(
        userData.email,
        userData.password,
        userData.full_name
      );
    },
    {
      onSuccess: (data) => {
        // Store in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Update React Query cache
        queryClient.setQueryData(USER_QUERY_KEY, data.user);
      },
    }
  );
};

// Request password reset mutation
export const useRequestPasswordReset = () => {
  return useMutation(async (email: string) => {
    return await authService.requestResetPassword(email);
  });
};

// Reset password mutation
export const useResetPassword = () => {
  return useMutation(
    async (data: { token: string; password: string }) => {
      return await authService.resetPassword(data.token, data.password);
    }
  );
};