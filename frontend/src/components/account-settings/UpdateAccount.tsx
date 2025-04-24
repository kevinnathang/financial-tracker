import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  HStack,
  Spinner,
  Text,
  Divider,
  Heading
} from '@chakra-ui/react';
import { useUserData, useUpdateUser } from '../../hooks/userQueries';
import { toast } from 'react-toastify';
import { useChangePassword } from '../../hooks/authQueries';

const UserAccountSettings: React.FC = () => {
  type FormField = 'first_name' | 'middle_name' | 'last_name' | 'email' | 'currentPassword' | 'newPassword' | 'confirmPassword';
  const storedUser = localStorage.getItem('user');
  const currentUserId = storedUser ? JSON.parse(storedUser).id : null;
  const { data: user, isLoading, isError } = useUserData(currentUserId);
  
  const changePasswordMutation = useChangePassword();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const updateUserMutation = useUpdateUser();
  
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''

  });
  const [formErrors, setFormErrors] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        middle_name: user.middle_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  if (isLoading) {
    return (
      <Box p={4} bg="white" borderRadius="lg" boxShadow="sm" textAlign="center">
        <Spinner size="md" />
        <Text mt={2}>Loading user data...</Text>
      </Box>
    );
  }

  if (isError || !user) {
    return (
      <Box p={4} bg="red.50" color="red.500" borderRadius="lg">
        <Text>Unable to load user data. Please try again later.</Text>
      </Box>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as FormField;
    const value = e.target.value;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let isValid = true;
    const errors = { ...formErrors };
    
    if (!formData.currentPassword) {
      errors.currentPassword = 'Current password is required';
      isValid = false;
    }
    
    if (!formData.newPassword) {
      errors.newPassword = 'New password is required';
      isValid = false;
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
      isValid = false;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    setFormErrors(errors);
    if (!isValid) return;
    
    try {
      setIsChangingPassword(true);
      await changePasswordMutation.mutateAsync({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      toast.success('Your password has been updated successfully.');
      
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let isValid = true;
    const errors = { ...formErrors };
    
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      errors.first_name = !formData.first_name.trim() ? 'First name is required' : '';
      errors.last_name = !formData.last_name.trim() ? 'Last name is required' : '';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }
    
    setFormErrors(errors);
    if (!isValid) return;
    
    try {
      setIsSubmitting(true);
      await updateUserMutation.mutateAsync({
        userId: currentUserId,
        first_name: formData.first_name,
        middle_name: formData.middle_name,
        last_name: formData.last_name,
        email: formData.email
      });
      
      toast.success('Your account information has been updated successfully.')
    } catch (error) {
      toast.error('Failed to update account information')
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box p={6} bg="white" borderRadius="lg" boxShadow="md">
      <Heading size="md" mb={4}>Account Settings</Heading>
      <Divider mb={6} />
      
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          <FormControl isInvalid={!!formErrors.first_name}>
            <FormLabel htmlFor="first_name">First Name</FormLabel>
            <Input
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
            <FormErrorMessage>{formErrors.first_name}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!formErrors.middle_name}>
            <FormLabel htmlFor="middle_name">Middle Name</FormLabel>
            <Input
              id="middle_name"
              name="middle_name"
              value={formData.middle_name}
              onChange={handleChange}
            />
            <FormErrorMessage>{formErrors.middle_name}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!formErrors.last_name}>
            <FormLabel htmlFor="last_name">Last Name</FormLabel>
            <Input
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
            <FormErrorMessage>{formErrors.last_name}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!formErrors.email}>
            <FormLabel htmlFor="email">Email Address</FormLabel>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <FormErrorMessage>{formErrors.email}</FormErrorMessage>
          </FormControl>

          <HStack justifyContent="flex-end" pt={4}>
            <Button 
              colorScheme="blue" 
              type="submit" 
              isLoading={isSubmitting}
              loadingText="Saving"
            >
              Save Changes
            </Button>
          </HStack>
        </VStack>
      </form>
      
      <Divider my={8} />
      
      <Heading size="md" mb={4}>Change Password</Heading>
      
      <form onSubmit={handlePasswordChange}>
        <VStack spacing={6} align="stretch">
          <FormControl isInvalid={!!formErrors.currentPassword}>
            <FormLabel htmlFor="currentPassword">Current Password</FormLabel>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
            />
            <FormErrorMessage>{formErrors.currentPassword}</FormErrorMessage>
          </FormControl>
          
          <FormControl isInvalid={!!formErrors.newPassword}>
            <FormLabel htmlFor="newPassword">New Password</FormLabel>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
            />
            <FormErrorMessage>{formErrors.newPassword}</FormErrorMessage>
          </FormControl>
          
          <FormControl isInvalid={!!formErrors.confirmPassword}>
            <FormLabel htmlFor="confirmPassword">Confirm New Password</FormLabel>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <FormErrorMessage>{formErrors.confirmPassword}</FormErrorMessage>
          </FormControl>
          
          <HStack justifyContent="flex-end" pt={4}>
            <Button 
              colorScheme="teal"
              type="submit"
              isLoading={isChangingPassword}
              loadingText="Updating"
            >
              Update Password
            </Button>
          </HStack>
        </VStack>
      </form>
    </Box>
  );
};

export default UserAccountSettings;