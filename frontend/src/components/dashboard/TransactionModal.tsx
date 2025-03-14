import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  Stack,
  useToast,
  Radio,
  RadioGroup,
  Flex,
  Box,
  Spinner,
  Text
} from '@chakra-ui/react';
import { useCreateTransaction } from '../../hooks/transactionQueries';
import { useTags } from '../../hooks/tagQueries';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose }) => {
    const { data, isLoading, isError } = useTags();

    const [amount, setAmount] = useState<number>(0);
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [tag, setTag] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('income');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const transactionMutation = useCreateTransaction()
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

    const tags = data.tags || [];

    const handleSubmit = async () => {
        if (!type || !amount || !date) {
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
            
            await transactionMutation.mutateAsync({
                amount: amount,
                type: type,
                description: description || undefined,
                tag_id: tag || undefined,
                date: date ? new Date(date) : undefined
            })
            
            toast({
            title: 'Success',
            description: 'Transaction created successfully',
            status: 'success',
            duration: 3000,
            isClosable: true,
            });
            
            // Reset form and close modal
            resetForm();
            onClose();
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
        setDescription('');
        setAmount(0);
        setDate(new Date().toISOString().split('T')[0]);
        setTag('');
        setType('expense');
    };

    return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Add New Transaction</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Stack spacing={4}>
                        <RadioGroup value={type} onChange={(value) => setType(value as 'income' | 'expense')}>
                            <Flex gap={4}>
                                <Radio value="expense">Expense</Radio>
                                <Radio value="income">Income</Radio>
                            </Flex>
                        </RadioGroup>
            
                    <FormControl isRequired>
                        <FormLabel>Description</FormLabel>
                        <Input 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter description"
                        />
                    </FormControl>
            
                    <FormControl isRequired>
                        <FormLabel>Amount</FormLabel>
                        <NumberInput min={0} precision={2} value={amount}>
                            <NumberInputField
                                value={amount}
                                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                                placeholder="Enter amount"
                            />
                        </NumberInput>
                    </FormControl>
            
                    <FormControl isRequired>
                        <FormLabel>Date</FormLabel>
                            <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </FormControl>
            
                    <FormControl>
                        <FormLabel>Tag</FormLabel>
                        <Select 
                            placeholder="Select tag" 
                            value={tag} 
                            onChange={(e) => setTag(e.target.value)}
                        >
                            {/* You would dynamically populate these options from your backend */}
                            <option value="1">Food</option>
                            <option value="2">Transportation</option>
                            <option value="3">Entertainment</option>
                            <option value="4">Utilities</option>
                            <option value="5">Salary</option>
                        </Select>
                    </FormControl>
                </Stack>
            </ModalBody>

            <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onClose}>
                    Cancel
                </Button>
                <Button 
                    colorScheme="blue" 
                    isLoading={isSubmitting}
                    onClick={handleSubmit}
                >
                    Save
                </Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
    );
};

export default TransactionModal;