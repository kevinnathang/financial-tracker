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
  useToast,
  Divider,
  Heading
} from '@chakra-ui/react';
import { useUserData, useUpdateUser } from '../../hooks/userQueries';

const UserAccountSettings: React.FC = () => {
    type FormField = 'first_name' | 'middle_name' | 'last_name' | 'email';
  const toast = useToast();
  const storedUser = localStorage.getItem('user');
  const currentUserId = storedUser ? JSON.parse(storedUser).id : null;
  const { data: user, isLoading, isError } = useUserData(currentUserId);
  
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: ''
  });
  const [formErrors, setFormErrors] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const updateUserMutation = useUpdateUser();

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        middle_name: user.middle_name || '',
        last_name: user.last_name || '',
        email: user.email || ''
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

  const validateForm = () => {
    let isValid = true;
    const errors = {
        first_name: '',
        middle_name: '',
        last_name: '',
        email: ''
    };

    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      errors.first_name = 'First name is required';
      errors.last_name = 'Last name is required'
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
    return isValid;
  };

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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      await updateUserMutation.mutateAsync({
        userId: currentUserId,
        first_name: formData.first_name,
        middle_name: formData.middle_name,
        last_name: formData.last_name,
        email: formData.email
      });
      
      toast({
        title: 'Success',
        description: 'Your account information has been updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update account information',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
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
    </Box>
  );
};

export default UserAccountSettings;