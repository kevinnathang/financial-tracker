import React from 'react';
import { Flex, Box, Text, Avatar, Menu, MenuButton, MenuList, MenuItem, MenuDivider } from '@chakra-ui/react';
import { FiBell, FiChevronDown } from 'react-icons/fi';
import { useHistory, useLocation } from 'react-router-dom';
import { ChakraIcon } from '../ui/ChakraIcon';
import { useUserData, useLogout } from '../../hooks/userQueries';

const Header: React.FC = () => {
  const pageTitles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/tags': 'Tags',
    '/budget': 'Budget',
    '/settings': 'Settings',
  };
  const location = useLocation();
  const currentTitle = pageTitles[location.pathname] || 'Finance Tracker';
  
  const storedUser = localStorage.getItem('user');
  const currentUserId = storedUser ? JSON.parse(storedUser).id : null;
  
  const { data: user } = useUserData(currentUserId);

  const logout = useLogout();
  const history = useHistory();
  
  const handleLogout = async () => {
    await logout.mutateAsync();
    history.push('/login');
  };

  const handleAccountSettings = async () => {
    history.push('/account-settings');
  }
  
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
          {currentTitle}
        </Text>
      </Box>
      <Flex alignItems="center">
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
            <MenuItem onClick={handleAccountSettings}>Account Settings</MenuItem>
            <MenuDivider />
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default Header;