// src/components/layout/AuthLayout.tsx
import React, { ReactNode } from 'react';
import { Flex, Box } from '@chakra-ui/react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <Flex 
      minHeight="100vh" 
      width="full" 
      align="center" 
      justifyContent="center" 
      bg="gray.50"
    >
      <Box 
        p={8} 
        maxWidth="500px" 
        width="full"
      >
        {children}
      </Box>
    </Flex>
  );
};

export default AuthLayout;