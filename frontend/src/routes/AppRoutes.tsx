import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useUserData } from '../hooks/userQueries';

import Login from '../pages/Login';
import Register from '../pages/Register';
import RequestResetPassword from '../pages/RequestResetPassword';
import ResetPassword from '../pages/ResetPassword';

import Dashboard from '../pages/Dashboard';
import Tags from '../pages/Tags'
import Budget from '../pages/Budget'
import AccountSettings from '../pages/AccountSettings'
import Verify from '../pages/VerifyUser';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const storedUser = localStorage.getItem('user') || null;

  const { data: user, isLoading: userLoading } = useUserData(storedUser || '' );

  if (userLoading) {
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
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/reset-password/:token" component={ResetPassword} />
      <Route path="/request-reset-password" component={RequestResetPassword} />
      <Route path="/verify/:verificationToken" component={Verify} />
      
      <Route
        path="/dashboard"
        exact
        render={() => (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/tags"
        exact
        render={() => (
          <ProtectedRoute>
            <Tags />
          </ProtectedRoute>
        )}
      />

      <Route
        path="/budget"
        exact
        render={() => (
          <ProtectedRoute>
            <Budget />
          </ProtectedRoute>
        )}
      />

<Route
        path="/account-settings"
        exact
        render={() => (
          <ProtectedRoute>
            <AccountSettings />
          </ProtectedRoute>
        )}
      />
      
      <Route path="*">
        <Redirect to="/login" />
      </Route>
    </Switch>
  );
};

export default AppRoutes;
