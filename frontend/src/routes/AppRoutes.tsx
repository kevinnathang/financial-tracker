import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useUserData } from '../hooks/userQueries';

// Auth Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import RequestResetPassword from '../pages/RequestResetPassword';
import ResetPassword from '../pages/ResetPassword';

// Dashboard Pages
import Dashboard from '../pages/Dashboard';

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { data: user, isLoading } = useUserData();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Redirect to="/login" />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Switch>
      {/* Auth Routes */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/reset-password/:token" component={ResetPassword} />
      <Route path="/request-reset-password" component={RequestResetPassword} />
      
      {/* Dashboard Routes - Protected */}
      <Route
        path="/dashboard"
        exact
        render={() => (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )}
      />
      
      {/* Default redirect */}
      <Route path="*">
        <Redirect to="/login" />
      </Route>
    </Switch>
  );
};

export default AppRoutes;
