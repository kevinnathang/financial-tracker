import React, { useState, useEffect } from 'react';
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
import { useCreateTransaction, useUpdateTransaction } from '../../hooks/transactionQueries';
import { useTags } from '../../hooks/tagQueries';
import { Transaction } from '../../services/transactionService';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction; 
}

const TransactionModal: React.FC<TransactionModalProps> = ({ 
  isOpen, 
  onClose, 
  transaction
}) => {
    const { data, isLoading, isError } = useTags();

    const [amount, setAmount] = useState<number>(0);
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [tag, setTag] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('income');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const createMutation = useCreateTransaction();
    const updateMutation = useUpdateTransaction();
    const toast = useToast();

    useEffect(() => {
        if (transaction) {
            setAmount(transaction.amount);
            setDescription(transaction.description || '');
            setDate(transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
            setTag(transaction.tag_id || '');
            setType(transaction.type.toLowerCase() as 'income' | 'expense');
        } else {
            setDescription('');
            setAmount(0);
            setDate(new Date().toISOString().split('T')[0]);
            setTag('');
            setType('expense');
        }
    }, [transaction, isOpen]);

    if (isLoading) {
        return (
            <Box p={4} bg="white" borderRadius="lg" boxShadow="sm" textAlign="center">
                <Spinner size="md" />
                <Text mt={2}>Loading transactions...</Text>
            </Box>
        );
    }
    
    if (isError || !data) {
        return (
            <Box p={4} bg="red.50" color="red.500" borderRadius="lg">
                <Text>Unable to load account transactions. Please try again later.</Text>
            </Box>
        );
    }

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
            
            const transactionData = {
                amount: amount,
                type: type,
                description: description || undefined,
                tag_id: tag ? tag : undefined,
                date: date ? new Date(date) : undefined,
            };
            
            if (transaction) {
                await updateMutation.mutateAsync({
                    ...transactionData,
                    transactionId: transaction.id
                });
                
                toast({
                    title: 'Success',
                    description: 'Transaction updated successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                await createMutation.mutateAsync(transactionData);
                
                toast({
                    title: 'Success',
                    description: 'Transaction created successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }
            
            onClose();
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to save transaction',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
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
                            {data.tags.map((tagItem) => (
                                <option key={tagItem.id} value={tagItem.id}>
                                    {tagItem.name}
                                </option>
                            ))}
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