// src/components/dashboard/DashboardLayout.tsx
import React, { ReactNode } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Sidebar from '../dashboard/Sidebar';
import Header from '../dashboard/Header';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <Flex height="100vh" width="full">
      <Box
        width="250px"
        bg="gray.800"
        color="white"
        height="100vh"
        position="fixed"
        left={0}
      >
        <Sidebar />
      </Box>

      <Flex
        direction="column"
        ml="250px"
        width="calc(100% - 250px)"
        height="100vh"
      >
        <Box
          as="header"
          height="60px"
          bg="white"
          borderBottomWidth="1px"
          borderColor="gray.200"
          boxShadow="sm"
          zIndex={10}
        >
          <Header />
        </Box>

        <Box
          as="main"
          p={6}
          bg="gray.50"
          height="calc(100vh - 60px)"
          overflowY="auto"
        >
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default DashboardLayout;