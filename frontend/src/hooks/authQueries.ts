import { useMutation } from 'react-query';
import  authService  from '../services/authService';
import { queryClient } from '../lib/reactQuery';
export const USER_QUERY_KEY = 'userData';

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

export const useInitiateUserRegistration = () => {
    return useMutation(
        async (userData: { email: string; password: string; first_name: string, middle_name: string, last_name: string }) => {
            return await authService.initiateUserRegistration(
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

export const useVerifyUser = () => {
    return useMutation(
        async (verificationToken: string) => {
            return await authService.verifyUser(verificationToken);
        },
        {
            onError: () => {
                console.error(`QUERY - Error using useVerifyUser.`);
            },  
        }
    );
};