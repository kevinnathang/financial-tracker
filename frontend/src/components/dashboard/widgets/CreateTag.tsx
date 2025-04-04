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
  Grid,
  GridItem,
  Badge,
  IconButton,
} from '@chakra-ui/react';
import * as Icons from 'react-icons/fi';
import { useCreateTag, useTags, useDeleteTag } from '../../../hooks/tagQueries';
import { ChakraIcon } from '../../ui/ChakraIcon';

const TagManagement: React.FC = () => {
  const { data, isLoading, isError } = useTags();
  const [ name, setName ] = useState('');
  const [ color, setColor ] = useState('#3182CE');
  const [ icon, setIcon ] = useState('💵');
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const tagMutation = useCreateTag();
  const toast = useToast();
  const { mutate: deleteTag } = useDeleteTag();
  
  if (isLoading) {
    return (
      <Box p={4} bg="white" borderRadius="lg" boxShadow="sm" textAlign="center">
        <Spinner size="md" />
        <Text mt={2}>Loading tags...</Text>
      </Box>
    );
  }
  
  if (isError || !data) {
    return (
      <Box p={4} bg="red.50" color="red.500" borderRadius="lg">
        <Text>Unable to load tags. Please try again later.</Text>
      </Box>
    );
  }

  const handleDelete = (tagId: string) => {
    console.log(tagId)
    deleteTag(tagId);
  };

  const tags = data.tags || [];
  
  const handleSubmit = async (e: any) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!name || !color) {
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
      
      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create tag',
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
    setIcon('💵');
  };
  
  // Emoji options instead of React icons
  const emojiOptions = [
    { value: '💵', label: 'Cash' },
    { value: '📈', label: 'Increase' },
    { value: '📉', label: 'Decrease' },
    { value: '📚', label: 'Studies' },
    { value: '💸', label: 'Expense' },
    { value: '⛽', label: 'Gas' },
    { value: '🏋️', label: 'Sports' },
    { value: '🍕', label: 'Food' },
    { value: '🏠', label: 'Housing' },
    { value: '🚗', label: 'Transportation' },
    { value: '💊', label: 'Healthcare' },
    { value: '🎮', label: 'Entertainment' },
    { value: '👜', label: 'Shopping' },
    { value: '✈️', label: 'Travel' }
  ];
  
  const colorOptions = [
    { value: '#3182CE', label: 'Blue' },
    { value: '#38A169', label: 'Green' },
    { value: '#E53E3E', label: 'Red' },
    { value: '#805AD5', label: 'Purple' },
    { value: '#DD6B20', label: 'Orange' },
    { value: '#718096', label: 'Gray' }
  ];
  
  return (
    <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} p={4}>
      <GridItem>
        <Box p={6} bg="white" borderRadius="lg" boxShadow="md" height="100%">
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
                {!color && isSubmitting && (
                  <FormErrorMessage>Tag color is required</FormErrorMessage>
                )}
              </FormControl>
              
              <FormControl>
                <FormLabel>Icon</FormLabel>
                <Select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                >
                  {emojiOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.value} {option.label}
                    </option>
                  ))}
                </Select>
                <Flex mt={2} justify="center">
                  <Box p={2} borderWidth="1px" borderRadius="md" fontSize="24px">
                    {icon}
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
      </GridItem>
      
      <GridItem>
        <Box p={6} bg="white" borderRadius="lg" boxShadow="md" height="100%">
          <Text fontSize="xl" fontWeight="bold" mb={4}>Your Tags</Text>
          
          {tags && tags.length > 0 ? (
            <VStack spacing={3} align="stretch">
              {tags.map((tag) => (
                <HStack key={tag.id} p={3} borderWidth="1px" borderRadius="md" justifyContent="space-between">
                  <HStack spacing={3}>
                    <Box fontSize="24px">{tag.icon}</Box>
                    <Text fontWeight="medium">{tag.name}</Text>
                    <Badge px={2} py={1} borderRadius="md" colorScheme={getColorScheme(tag.color)}>
                      {getColorName(tag.color)}
                    </Badge>
                  </HStack>
                  <IconButton
                    aria-label="Delete Tag"
                    icon={<ChakraIcon icon={Icons.FiTrash2} />}
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDelete(tag.id)}
                  />
                </HStack>
              ))}
            </VStack>
          ) : (
            <Box p={6} textAlign="center" borderWidth="1px" borderRadius="md" borderStyle="dashed">
              <Text color="gray.500">No tags created yet</Text>
              <Text fontSize="sm" color="gray.400" mt={2}>
                Create a tag using the form on the left
              </Text>
            </Box>
          )}
        </Box>
      </GridItem>
    </Grid>
  );
};

const getColorScheme = (colorHex: string): string => {
  const colorMap: Record<string, string> = {
    '#3182CE': 'blue',
    '#38A169': 'green',
    '#E53E3E': 'red',
    '#805AD5': 'purple',
    '#DD6B20': 'orange',
    '#718096': 'gray',
  };
  
  return colorMap[colorHex] || 'gray';
};

const getColorName = (colorHex: string): string => {
  const colorMap: Record<string, string> = {
    '#3182CE': 'Blue',
    '#38A169': 'Green',
    '#E53E3E': 'Red',
    '#805AD5': 'Purple',
    '#DD6B20': 'Orange',
    '#718096': 'Gray',
  };
  
  return colorMap[colorHex] || 'Custom';
};

export default TagManagement;