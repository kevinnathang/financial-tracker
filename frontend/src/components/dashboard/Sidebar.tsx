import React from 'react';
import { Box, VStack, Heading, Flex, Text } from '@chakra-ui/react';
import { useHistory, useLocation } from 'react-router-dom';
import { FiHome, FiDollarSign, FiPieChart, FiSettings, FiLogOut, FiTag } from 'react-icons/fi';
import { ChakraIcon } from '../ui/ChakraIcon';
import { IconType } from 'react-icons';
import { useLogout } from '../../hooks/userQueries';

interface NavItemProps {
  icon: IconType;
  label: string;
  path: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, path, active }) => {
  const history = useHistory();
  return (
    <Flex
      align="center"
      px={4}
      py={3}
      cursor="pointer"
      bg={active ? 'gray.700' : 'transparent'}
      color={active ? 'white' : 'gray.300'}
      _hover={{ bg: 'gray.700', color: 'white' }}
      borderRadius="md"
      onClick={() => history.push(path)}
      role="group"
    >
      <ChakraIcon icon={icon} mr={3} fontSize="lg" />
      <Text fontSize="md">{label}</Text>
    </Flex>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const logout = useLogout();
  const history = useHistory();
  
  const handleLogout = async () => {
    await logout.mutateAsync();
    history.push('/login');
  };
  
  return (
    <Box height="100%" py={5}>
      <Box textAlign="center" mb={8}>
        <Heading as="h1" size="md" color="white">
          Finance Tracker
        </Heading>
      </Box>
      <VStack spacing={1} align="stretch" px={3}>
        <NavItem
          icon={FiHome}
          label="Dashboard"
          path="/dashboard"
          active={location.pathname === '/dashboard'}
        />
        <NavItem
          icon={FiTag}
          label="Tags"
          path="/dashboard/tags"
          active={location.pathname === '/dashboard/tags'}
        />
        <NavItem
          icon={FiPieChart}
          label="Budget"
          path="/dashboard/budget"
          active={location.pathname === '/dashboard/budget'}
        />
        <NavItem
          icon={FiSettings}
          label="Settings"
          path="/dashboard/settings"
          active={location.pathname === '/dashboard/settings'}
        />
      </VStack>
      <Box position="absolute" bottom={5} width="100%" px={3}>
        <Flex
          align="center"
          px={4}
          py={3}
          cursor="pointer"
          color="gray.300"
          _hover={{ bg: 'gray.700', color: 'white' }}
          borderRadius="md"
          onClick={handleLogout}
        >
          <ChakraIcon icon={FiLogOut} mr={3} fontSize="lg" />
          <Text fontSize="md">Logout</Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default Sidebar;