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
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: "url('/images/money.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.85,
        zIndex: -1
      }}
    >
      <Box
        p={0}
        maxWidth="500px"
        width="full"
        bg="rgba(255, 255, 255, 0.95)"
        borderRadius="10px"
        borderStyle="solid"
        borderWidth="3px"
        borderColor="rgb(28, 28, 28)"
        boxShadow="0 10px 25px rgba(0, 0, 0, 0.95)"
        backdropFilter="blur(5px)"
        zIndex={1}
      >
        {children}
      </Box>
    </Flex>
  );
};

export default AuthLayout;