// src/pages/Login.tsx
import React from 'react';
import AuthLayout from '../components/layout/AuthLayout';
import VerificationForm from '../components/auth/VerificationForm';

const Verify = () => {
  return (
    <AuthLayout>
      <VerificationForm />
    </AuthLayout>
  );
};

export default Verify;