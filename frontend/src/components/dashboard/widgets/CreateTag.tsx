import React, { useState } from 'react';
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
  Select,
  Flex,
} from '@chakra-ui/react';
import { FiDollarSign, FiArrowUpRight, FiArrowDownRight, FiPieChart } from 'react-icons/fi';
import { useCreateTag, useTags } from '../../../hooks/tagQueries';

type IconComponentType = React.ComponentType<{ size?: number }>;

const CreateTag: React.FC = () => {
  const { data, isLoading, isError } = useTags();
  const [ name, setName ] = useState('');
  const [ color, setColor ] = useState('#3182CE'); // Default blue color
  const [ icon, setIcon ] = useState('FiPieChart');
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const tagMutation = useCreateTag();
  const toast = useToast();
  
  
  // Handle loading state
  if (isLoading) {
    return (
      <Box p={4} bg="white" borderRadius="lg" boxShadow="sm" textAlign="center">
        <Spinner size="md" />
        <Text mt={2}>Loading transactions...</Text>
      </Box>
    );
  }
  
  // Handle error state
  if (isError || !data) {
    return (
      <Box p={4} bg="red.50" color="red.500" borderRadius="lg">
        <Text>Unable to load account transactions. Please try again later.</Text>
      </Box>
    );
  }
  
  const handleSubmit = async () => {
    
    if (!name) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await tagMutation.mutateAsync({
        name: name,
        color: color,
        icon: icon,
      });
      
      toast({
        title: 'Success',
        description: 'Tag created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Reset form and close modal
      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create transaction',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setName('');
    setColor('#3182CE');
    setIcon('FiPieChart');
  };
  
  // Available icons for selection
  const iconOptions = [
    { value: 'FiDollarSign', label: 'Dollar Sign', icon: FiDollarSign as IconComponentType },
    { value: 'FiArrowUpRight', label: 'Arrow Up', icon: FiArrowUpRight as IconComponentType },
    { value: 'FiArrowDownRight', label: 'Arrow Down', icon: FiArrowDownRight as IconComponentType },
    { value: 'FiPieChart', label: 'Pie Chart', icon: FiPieChart as IconComponentType }
  ];
  
  // Predefined color options
  const colorOptions = [
    { value: '#3182CE', label: 'Blue' },
    { value: '#38A169', label: 'Green' },
    { value: '#E53E3E', label: 'Red' },
    { value: '#805AD5', label: 'Purple' },
    { value: '#DD6B20', label: 'Orange' },
    { value: '#718096', label: 'Gray' }
  ];
  
  return (
    <Box p={6} bg="white" borderRadius="lg" boxShadow="md" maxWidth="500px" mx="auto">
      <Text fontSize="xl" fontWeight="bold" mb={4}>Create New Tag</Text>
      
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired isInvalid={!name && isSubmitting}>
            <FormLabel>Tag Name</FormLabel>
            <Input 
              placeholder="Enter tag name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {!name && isSubmitting && (
              <FormErrorMessage>Tag name is required</FormErrorMessage>
            )}
          </FormControl>
          
          <FormControl>
            <FormLabel>Color</FormLabel>
            <HStack spacing={4}>
              <Select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                width="full"
              >
                {colorOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <Box 
                width="40px" 
                height="40px" 
                borderRadius="md" 
                bg={color} 
                border="1px solid" 
                borderColor="gray.200"
              />
            </HStack>
          </FormControl>
          
          <FormControl>
            <FormLabel>Icon</FormLabel>
            <Select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            >
              {iconOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Flex mt={2} justify="center">
              <Box p={2} borderWidth="1px" borderRadius="md">
                {(() => {
                    const IconComponent = iconOptions.find(option => option.value === icon)?.icon;
                    return IconComponent ? <IconComponent size={24} /> : null;
                })()}
              </Box>
            </Flex>
          </FormControl>
          
          <HStack spacing={4} justify="flex-end" pt={4}>
            <Button 
              variant="outline" 
              onClick={resetForm}
              isDisabled={isSubmitting}
            >
              Reset
            </Button>
            <Button 
              colorScheme="blue" 
              type="submit"
              isLoading={isSubmitting}
              loadingText="Creating"
            >
              Create Tag
            </Button>
          </HStack>
        </VStack>
      </form>
    </Box>
  );
};

export default CreateTag;