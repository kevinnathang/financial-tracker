// src/components/dashboard/widgets/RecentTransactions.tsx
import React from 'react';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Badge, Flex, Text, Button, Spinner } from '@chakra-ui/react';
import { FiArrowRight } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { ChakraIcon } from '../../ui/ChakraIcon';
import { useTransactions } from '../../../hooks/transactionQueries';

const RecentTransactions: React.FC = () => {
  const history = useHistory();
  const { data, isLoading, isError } = useTransactions();

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

  // Handle empty transactions
  if (transactions.length === 0) {
    return (
      <Box p={4} bg="white" borderRadius="lg" boxShadow="sm">
        <Heading size="md" mb={4}>Recent Transactions</Heading>
        <Text color="gray.500">No transactions found.</Text>
      </Box>
    );
  }

  return (
    <Box bg="white" borderRadius="lg" boxShadow="sm" p={5}>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="md">Recent Transactions</Heading>
        <Button 
          variant="ghost" 
          size="sm" 
          rightIcon={<ChakraIcon icon={FiArrowRight} />}
          onClick={() => history.push('/dashboard/transactions')}
        >
          View All
        </Button>
      </Flex>

      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Description</Th>
              <Th>Tag</Th>
              <Th>Date</Th>
              <Th isNumeric>Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.map((transaction) => (
              <Tr key={transaction.id}>
                <Td>
                  <Flex alignItems="center">
                    <Flex 
                      alignItems="center" 
                      justifyContent="center" 
                      p={1}
                      borderRadius="md"
                      boxSize="30px"
                      mr={3}
                    >
                    </Flex>
                    <Text fontWeight="medium">{transaction.description}</Text>
                  </Flex>
                </Td>
                <Td>
                  <Badge 
                    colorScheme={transaction.amount > 0 ? 'green' : 'gray'} 
                    variant="subtle" 
                    px={2} 
                    py={0.5} 
                    borderRadius="full"
                  >
                    {transaction.tag?.name}
                  </Badge>
                </Td>
                <Td>{transaction.date}</Td>
                <Td isNumeric fontWeight="medium" color={transaction.type === 'income' ? 'green.500' : 'red.500'}>
                  {transaction.type  === 'income' ? '+' : '-'}{transaction.amount}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default RecentTransactions;