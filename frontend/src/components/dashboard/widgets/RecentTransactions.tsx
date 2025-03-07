// src/components/dashboard/widgets/RecentTransactions.tsx
import React from 'react';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Badge, Flex, Text, Button } from '@chakra-ui/react';
import { FiShoppingBag, FiCoffee, FiHome, FiTruck, FiArrowRight } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { ChakraIcon } from '../../ui/ChakraIcon';

const RecentTransactions: React.FC = () => {
  const history = useHistory();
  
  // In a real app, this data would come from your API or state management
  const transactions = [
    {
      id: 1,
      description: 'Grocery Store',
      category: 'Shopping',
      date: '2023-04-15',
      amount: -85.45,
      icon: FiShoppingBag,
      color: 'blue.500'
    },
    {
      id: 2,
      description: 'Coffee Shop',
      category: 'Food & Drink',
      date: '2023-04-14',
      amount: -4.50,
      icon: FiCoffee,
      color: 'orange.500'
    },
    {
      id: 3,
      description: 'Rent Payment',
      category: 'Housing',
      date: '2023-04-14',
      amount: -1200.00,
      icon: FiHome,
      color: 'purple.500'
    },
    {
      id: 4,
      description: 'Salary Deposit',
      category: 'Income',
      date: '2023-04-13',
      amount: 3200.00,
      icon: FiTruck,
      color: 'green.500'
    }
  ];

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
              <Th>Category</Th>
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
                      bg={`${transaction.color}15`} 
                      color={transaction.color}
                      p={1}
                      borderRadius="md"
                      boxSize="30px"
                      mr={3}
                    >
                      <ChakraIcon icon={transaction.icon} />
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
                    {transaction.category}
                  </Badge>
                </Td>
                <Td>{transaction.date}</Td>
                <Td isNumeric fontWeight="medium" color={transaction.amount > 0 ? 'green.500' : undefined}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
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