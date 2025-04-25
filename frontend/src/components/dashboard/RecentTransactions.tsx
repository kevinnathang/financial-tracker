import React, { useState } from 'react';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Flex, Text, Button, Spinner, IconButton } from '@chakra-ui/react';
import * as Icons from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { ChakraIcon } from '../ui/ChakraIcon';
import { useTransactions, useDeleteTransaction } from '../../hooks/transactionQueries';
import TransactionModal from './TransactionModal';
import { Transaction } from '../../types';

const RecentTransactions: React.FC = () => {
  const history = useHistory();
  const { data, isLoading, isError } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction.Transaction | undefined>(undefined);
  const { mutate: deleteTransaction } = useDeleteTransaction();
  
  const openModal = () => {
    setSelectedTransaction(undefined); 
    setIsModalOpen(true);
  };
  
  const openUpdateModal = (transaction: Transaction.Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(undefined);
  };

  const handleDelete = (transactionId: string) => {
    deleteTransaction(transactionId);
  };

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

  const transactions = data.transactions || [];

  return (
    <Box bg="white" borderRadius="lg" boxShadow="sm" p={5}>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="md">Recent Transactions</Heading>
        <Flex gap={2}>
          <Button
            colorScheme="blue"
            size="sm"
            leftIcon={<ChakraIcon icon={Icons.FiPlus} />}
            onClick={openModal}
          >
            New Transaction
          </Button>
          <Button
            variant="ghost"
            size="sm"
            rightIcon={<ChakraIcon icon={Icons.FiArrowRight} />}
            onClick={() => history.push('/transactions')}
          >
            View All
          </Button>
        </Flex>
      </Flex>

      {transactions.length === 0 ? (
        <Text color="gray.500" py={4}>No transactions found.</Text>
      ) : (
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Tag</Th>
                <Th>Description</Th>
                <Th>Date</Th>
                <Th isNumeric>Amount</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {transactions.map((transaction) => (
                <Tr key={transaction.id}>
                  <Td>
                    <Flex alignItems="center" gap={2}>
                    {transaction.tag?.icon && (
                      <Text fontSize="lg">{transaction.tag.icon}</Text>
                    )}
                      <Text fontWeight="medium">{transaction.tag?.name}</Text>
                      {transaction.tag?.color && (
                        <Box 
                          width="200px" 
                          height="4px" 
                          backgroundColor={transaction.tag.color}
                          alignSelf="center"
                          borderRadius="sm"
                        />
                      )}
                    </Flex>
                  </Td>
                  <Td>
                    <Flex alignItems="center">
                      <Text fontWeight="medium">{transaction.description}</Text>
                    </Flex>
                  </Td>
                  <Td>{new Date(transaction.date).toLocaleDateString('en-GB')}</Td>
                  <Td isNumeric fontWeight="medium" color={transaction.type === 'income' ? 'green.500' : 'red.500'}>
                    {transaction.type === 'income' ? '+' : '-'}{transaction.amount}
                  </Td>
                  <Td>
                    <Flex gap={2}>
                      <IconButton
                        aria-label="Update Transaction"
                        icon={<ChakraIcon icon={Icons.FiEdit} />}
                        colorScheme="blue"
                        size="sm"
                        onClick={() => openUpdateModal(transaction)}
                      />
                      <IconButton
                        aria-label="Delete Transaction"
                        icon={<ChakraIcon icon={Icons.FiTrash2} />}
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleDelete(transaction.id)}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
      
      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        transaction={selectedTransaction}
      />
    </Box>
  );
};

export default RecentTransactions;