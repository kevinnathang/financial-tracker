import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { userService } from '../services/userService';

interface User {
    id: string;
    email: string;
    full_name: string;
    balance: number;
}

interface UserContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    register: (email: string, password: string, full_name: string) => Promise<void>;
}

export const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
        const [user, setUser] = useState<User | null>(null);
        const [isLoading, setIsLoading] = useState(true);
    
        useEffect(() => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');
    
            if (token && userData) {
                setUser(JSON.parse(userData));
            }
    
            setIsLoading(false);
        }, []);


        const register = async (email: string, password: string, full_name: string) => {
            try {
                const response = await userService.register(email, password, full_name);
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                setUser(response.user);
            } catch (error) {
                console.error(error);
                throw error;
            }
        };

    return (
        <UserContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                register,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}