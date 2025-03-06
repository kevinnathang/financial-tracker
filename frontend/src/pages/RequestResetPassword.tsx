// src/pages/RequestResetPassword.tsx
import React from 'react';
import AuthLayout from '../components/layout/AuthLayout';
import RequestResetPasswordForm from '../components/auth/RequestResetPasswordForm';

const RequestResetPassword = () => {
  return (
    <AuthLayout>
      <RequestResetPasswordForm />
    </AuthLayout>
  );
};

export default RequestResetPassword;