// src/App.tsx
import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './hooks/useAuth';

// Create a theme (even an empty one) to satisfy the ChakraProvider
const theme = {
    config: {
        initialColorMode: 'light',
        useSystemColorMode: false,
    }
};
// Protected route wrapper
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Redirect to="/login" />;
    }

    return children;
};

// Placeholder Dashboard component
const Dashboard = () => <div>Dashboard (Protected)</div>;

const AppRoutes = () => {
    return (
        <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route
                path="/dashboard"
                render={() => (
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                )}
            />
            <Route path="/" render={() => <Redirect to="/login" />} />
        </Switch>
    );
};

const App = () => {
    return (
        <ChakraProvider theme={theme}>
            <AuthProvider>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </AuthProvider>
        </ChakraProvider>
    );
};

export default App;