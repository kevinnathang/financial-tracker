import React, { useState } from 'react';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Flex, Text, Button, Spinner } from '@chakra-ui/react';
import { FiArrowRight, FiPlus } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { ChakraIcon } from '../../ui/ChakraIcon';
import { useTransactions } from '../../../hooks/transactionQueries';
import TransactionModal from '../TransactionModal';

const RecentTransactions: React.FC = () => {
  const history = useHistory();
  const { data, isLoading, isError } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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

  // Extract the transactions array from the response
  const transactions = data.transactions || [];

  return (
    <Box bg="white" borderRadius="lg" boxShadow="sm" p={5}>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="md">Recent Transactions</Heading>
        <Flex gap={2}>
          <Button
            colorScheme="blue"
            size="sm"
            leftIcon={<ChakraIcon icon={FiPlus} />}
            onClick={openModal}
          >
            New Transaction
          </Button>
          <Button
            variant="ghost"
            size="sm"
            rightIcon={<ChakraIcon icon={FiArrowRight} />}
            onClick={() => history.push('/dashboard/transactions')}
          >
            View All
          </Button>
        </Flex>
      </Flex>

      {/* Show appropriate content based on transaction list */}
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
              </Tr>
            </Thead>
            <Tbody>
              {transactions.map((transaction) => (
                <Tr key={transaction.id}>
                  <Td>
                    <Flex alignItems="center">
                      <Text fontWeight="medium">{transaction.tag?.name}</Text>
                    </Flex>
                  </Td>
                  <Td>
                    <Flex alignItems="center">
                      <Text fontWeight="medium">{transaction.description}</Text>
                    </Flex>
                  </Td>
                  <Td>{transaction.date}</Td>
                  <Td isNumeric fontWeight="medium" color={transaction.type === 'income' ? 'green.500' : 'red.500'}>
                    {transaction.type === 'income' ? '+' : '-'}{transaction.amount}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
      
      {/* Transaction Modal */}
      <TransactionModal isOpen={isModalOpen} onClose={closeModal} />
    </Box>
  );
};

export default RecentTransactions;