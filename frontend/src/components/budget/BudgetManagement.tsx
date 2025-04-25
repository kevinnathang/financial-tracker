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
  Select,
  Grid,
  GridItem,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Switch,
  NumberInput,
  NumberInputField,
  Textarea,
  Badge,
  Divider
} from '@chakra-ui/react';
import * as Icons from 'react-icons/fi';
import { useCreateBudget, useBudgets, useDeleteBudget, useUpdateBudget } from '../../hooks/budgetQueries';
import { ChakraIcon } from '../ui/ChakraIcon';
import { toast } from 'react-toastify';

import { Budget } from '../../types';

const BudgetManagement: React.FC = () => {
  const { data, isLoading, isError } = useBudgets();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [period, setPeriod] = useState('monthly');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [isMain, setIsMain] = useState(false);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget.Budget | undefined>(undefined);
  
  const budgetMutation = useCreateBudget();
  const updateBudgetMutation = useUpdateBudget();
  const { mutate: deleteBudget } = useDeleteBudget();
  
  if (isLoading) {
    return (
      <Box p={4} bg="white" borderRadius="lg" boxShadow="sm" textAlign="center">
        <Spinner size="md" />
        <Text mt={2}>Loading budgets...</Text>
      </Box>
    );
  }
  
  if (isError || !data) {
    return (
      <Box p={4} bg="red.50" color="red.500" borderRadius="lg">
        <Text>Unable to load budgets. Please try again later.</Text>
      </Box>
    );
  }

  const handleDelete = (budgetId: string) => {
    deleteBudget(budgetId);
  };

  const openEditModal = (budget: Budget.Budget) => {
    setSelectedBudget(budget);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedBudget(undefined);
  };

  const handleUpdate = async () => {
    if (!selectedBudget) return;

    if (!selectedBudget.name || !selectedBudget.amount) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await updateBudgetMutation.mutateAsync({
        budgetId: selectedBudget.id,
        name: selectedBudget.name,
        amount: selectedBudget.amount,
        period: selectedBudget.period,
        start_date: selectedBudget.start_date ? new Date(selectedBudget.start_date) : null,
        end_date: selectedBudget.end_date ? new Date(selectedBudget.end_date) : null,
        is_main: selectedBudget.is_main,
        description: selectedBudget.description
      });
      
      toast.success('Budget updated successfully')
      closeEditModal();
    } catch (error) {
      toast.error('Failed to update budgets');
    } finally {
      setIsSubmitting(false);
    }
  };

  const budgets = data.budgets || [];
  
  const handleSubmit = async (e: any) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!name || !amount) {
      toast.error('Please fill all required fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await budgetMutation.mutateAsync({
        name,
        amount,
        period,
        start_date: startDate ? new Date(startDate) : null,
        end_date: endDate ? new Date(endDate) : null,
        is_main: isMain,
        description
      });
      
      toast.success('Budget created successfully');
      resetForm();
    } catch (error) {
      toast.error('Failed to create budget');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setName('');
    setAmount(0);
    setPeriod('monthly');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setIsMain(false);
    setDescription('');
  };
  
  const periodOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'custom', label: 'Custom' }
  ];
  
  return (
    <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} p={4}>
      <GridItem>
        <Box p={6} bg="white" borderRadius="lg" boxShadow="md" height="100%">
          <Text fontSize="xl" fontWeight="bold" mb={4}>Create New Budget</Text>
          
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired isInvalid={!name && isSubmitting}>
                <FormLabel>Budget Name</FormLabel>
                <Input 
                  placeholder="Enter budget name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {!name && isSubmitting && (
                  <FormErrorMessage>Budget name is required</FormErrorMessage>
                )}
              </FormControl>
              
              <FormControl isRequired isInvalid={!amount && isSubmitting}>
                <FormLabel>Amount</FormLabel>
                <NumberInput min={0} precision={2} value={amount}>
                  <NumberInputField
                    placeholder="Enter budget amount"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  />
                </NumberInput>
                {!amount && isSubmitting && (
                  <FormErrorMessage>Amount is required</FormErrorMessage>
                )}
              </FormControl>
              
              <FormControl>
                <FormLabel>Period</FormLabel>
                <Select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  {periodOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
              
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <GridItem>
                  <FormControl>
                    <FormLabel>Start Date</FormLabel>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl>
                    <FormLabel>End Date (Optional)</FormLabel>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              
              <FormControl>
                <FormLabel>Description (Optional)</FormLabel>
                <Textarea
                  placeholder="Enter budget description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </FormControl>
              
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="is-main" mb="0">
                  Set as Main Budget
                </FormLabel>
                <Switch 
                  id="is-main"
                  isChecked={isMain}
                  onChange={(e) => setIsMain(e.target.checked)}
                  colorScheme="blue"
                />
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
                  Create Budget
                </Button>
              </HStack>
            </VStack>
          </form>
        </Box>
      </GridItem>
      
      <GridItem>
        <Box p={6} bg="white" borderRadius="lg" boxShadow="md" height="100%">
          <Text fontSize="xl" fontWeight="bold" mb={4}>Your Budgets</Text>
          
          {budgets && budgets.length > 0 ? (
            <VStack spacing={3} align="stretch">
              {budgets.map((budget: any) => (
                <Box key={budget.id} p={4} borderWidth="1px" borderRadius="md">
                  <HStack justifyContent="space-between" mb={2}>
                    <HStack>
                      <Text fontWeight="bold" fontSize="lg">{budget.name}</Text>
                      {budget.is_main && (
                        <Badge colorScheme="green">Main</Badge>
                      )}
                    </HStack>
                    <HStack>
                      <IconButton
                        aria-label="Edit Budget"
                        icon={<ChakraIcon icon={Icons.FiEdit} />}
                        colorScheme="blue"
                        size="sm"
                        onClick={() => openEditModal(budget)}
                      />
                      <IconButton
                        aria-label="Delete Budget"
                        icon={<ChakraIcon icon={Icons.FiTrash2} />}
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleDelete(budget.id)}
                      />
                    </HStack>
                  </HStack>
                  
                  <Divider my={2} />
                  
                  <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                    <Box>
                      <Text color="gray.500" fontSize="sm">Amount:</Text>
                      <Text fontWeight="medium">${Number(budget.amount).toFixed(2)}</Text>
                    </Box>
                    <Box>
                      <Text color="gray.500" fontSize="sm">Period:</Text>
                      <Text textTransform="capitalize">{budget.period}</Text>
                    </Box>
                    {budget.start_date && (
                      <Box>
                        <Text color="gray.500" fontSize="sm">Start Date:</Text>
                        <Text>{new Date(budget.start_date).toLocaleDateString()}</Text>
                      </Box>
                    )}
                    {budget.end_date && (
                      <Box>
                        <Text color="gray.500" fontSize="sm">End Date:</Text>
                        <Text>{new Date(budget.end_date).toLocaleDateString()}</Text>
                      </Box>
                    )}
                  </Grid>
                  
                  {budget.description && (
                    <>
                      <Text color="gray.500" fontSize="sm" mt={2}>Description:</Text>
                      <Text fontSize="sm" noOfLines={2}>{budget.description}</Text>
                    </>
                  )}
                </Box>
              ))}
            </VStack>
          ) : (
            <Box p={6} textAlign="center" borderWidth="1px" borderRadius="md" borderStyle="dashed">
              <Text color="gray.500">No budgets created yet</Text>
              <Text fontSize="sm" color="gray.400" mt={2}>
                Create a budget using the form on the left
              </Text>
            </Box>
          )}
        </Box>
      </GridItem>

      <Modal isOpen={isEditModalOpen} onClose={closeEditModal} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Budget</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedBudget && (
              <VStack spacing={4} align="stretch">
                <FormControl isRequired isInvalid={!selectedBudget.name && isSubmitting}>
                  <FormLabel>Budget Name</FormLabel>
                  <Input 
                    placeholder="Enter budget name"
                    value={selectedBudget.name}
                    onChange={(e) => setSelectedBudget({...selectedBudget, name: e.target.value})}
                  />
                  {!selectedBudget.name && isSubmitting && (
                    <FormErrorMessage>Budget name is required</FormErrorMessage>
                  )}
                </FormControl>
                
                <FormControl isRequired isInvalid={!selectedBudget.amount && isSubmitting}>
                  <FormLabel>Amount</FormLabel>
                  <NumberInput min={0} precision={2} value={selectedBudget.amount}>
                    <NumberInputField
                      placeholder="Enter budget amount"
                      value={selectedBudget.amount}
                      onChange={(e) => setSelectedBudget({...selectedBudget, amount: parseFloat(e.target.value) || 0})}
                    />
                  </NumberInput>
                  {!selectedBudget.amount && isSubmitting && (
                    <FormErrorMessage>Amount is required</FormErrorMessage>
                  )}
                </FormControl>
                
                <FormControl>
                  <FormLabel>Period</FormLabel>
                  <Select
                    value={selectedBudget.period || ''}
                    onChange={(e) => setSelectedBudget({...selectedBudget, period: e.target.value})}
                  >
                    {periodOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <GridItem>
                    <FormControl>
                      <FormLabel>Start Date</FormLabel>
                      <Input
                        type="date"
                        value={selectedBudget.start_date ? new Date(selectedBudget.start_date).toISOString().split('T')[0] : ''}
                        onChange={(e) => setSelectedBudget({...selectedBudget, start_date: e.target.value})}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel>End Date (Optional)</FormLabel>
                      <Input
                        type="date"
                        value={selectedBudget.end_date ? new Date(selectedBudget.end_date).toISOString().split('T')[0] : ''}
                        onChange={(e) => setSelectedBudget({...selectedBudget, end_date: e.target.value || null})}
                      />
                    </FormControl>
                  </GridItem>
                </Grid>
                
                <FormControl>
                  <FormLabel>Description (Optional)</FormLabel>
                  <Textarea
                    placeholder="Enter budget description"
                    value={selectedBudget.description || ''}
                    onChange={(e) => setSelectedBudget({...selectedBudget, description: e.target.value})}
                    rows={3}
                  />
                </FormControl>
                
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="edit-is-main" mb="0">
                    Set as Main Budget
                  </FormLabel>
                  <Switch 
                    id="edit-is-main"
                    isChecked={selectedBudget.is_main}
                    onChange={(e) => setSelectedBudget({...selectedBudget, is_main: e.target.checked})}
                    colorScheme="blue"
                  />
                </FormControl>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={closeEditModal}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleUpdate}
              isLoading={isSubmitting}
              loadingText="Updating"
              isDisabled={!selectedBudget}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Grid>
  );
};

export default BudgetManagement;