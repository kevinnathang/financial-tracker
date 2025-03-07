// src/components/dashboard/Header.tsx
import React from 'react';
import { Flex, Box, Text, Avatar, Menu, MenuButton, MenuList, MenuItem, MenuDivider } from '@chakra-ui/react';
import { FiBell, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useHistory } from 'react-router-dom';
import { ChakraIcon } from '../ui/ChakraIcon';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const history = useHistory();

  const handleLogout = async () => {
    await logout();
    history.push('/login');
  };

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      px={6}
      py={2}
      height="100%"
    >
      <Box>
        <Text fontSize="xl" fontWeight="bold">
          {/* Dynamic title based on current page */}
          Dashboard
        </Text>
      </Box>

      <Flex alignItems="center">
        {/* Notifications */}
        <Box position="relative" mr={4}>
          <ChakraIcon
            icon={FiBell}
            fontSize="xl"
            cursor="pointer"
            color="gray.500"
            _hover={{ color: 'gray.700' }}
          />
          <Box
            position="absolute"
            top="-1px"
            right="-1px"
            width="8px"
            height="8px"
            borderRadius="full"
            bg="red.500"
          />
        </Box>

        {/* User Profile Menu */}
        <Menu>
          <MenuButton>
            <Flex alignItems="center">
              <Avatar 
                size="sm" 
                name={user?.full_name || 'User'} 
                mr={2} 
              />
              <Text mr={1} display={{ base: 'none', md: 'block' }}>
                {user?.full_name || 'User'}
              </Text>
              <ChakraIcon icon={FiChevronDown} fontSize="sm" />
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuItem>Profile</MenuItem>
            <MenuItem>Account Settings</MenuItem>
            <MenuDivider />
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default Header;