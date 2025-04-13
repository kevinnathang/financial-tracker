// src/components/dashboard/widgets/AccountSummary.tsx
import React from 'react';
import { Box, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Flex, Spinner, Text } from '@chakra-ui/react';
import { FiDollarSign, FiArrowUpRight, FiArrowDownRight, FiPieChart } from 'react-icons/fi';
import { IconType } from 'react-icons';
import { ChakraIcon } from '../../ui/ChakraIcon';
import { useUserData } from '../../../hooks/userQueries';
import { useMonthlyStats } from '../../../hooks/transactionQueries';
import { useBudgets } from '../../../hooks/budgetQueries';

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon: IconType;
  accentColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, accentColor }) => {
  return (
    <Box
      p={5}
      bg="white"
      borderRadius="lg"
      boxShadow="sm"
      borderLeft="4px solid"
      borderColor={accentColor}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Stat>
          <StatLabel color="gray.500" fontSize="sm">{title}</StatLabel>
          <StatNumber fontSize="2xl" fontWeight="bold">{value}</StatNumber>
          {change !== undefined && (
            <StatHelpText fontSize="xs">
              <StatArrow type={change >= 0 ? 'increase' : 'decrease'} />
              {Math.abs(change)}% from last month
            </StatHelpText>
          )}
        </Stat>
        <Flex
          alignItems="center"
          justifyContent="center"
          bg={`${accentColor}15`}
          color={accentColor}
          p={2}
          borderRadius="full"
          boxSize="40px"
        >
          <ChakraIcon icon={icon} fontSize="xl" />
        </Flex>
      </Flex>
    </Box>
  );
};

const AccountSummary: React.FC = () => {
const storedUser = localStorage.getItem('user')
const currentUserId = storedUser ? JSON.parse(storedUser).id : null;

const { data: user  } = useUserData(currentUserId);
const { data: monthlyStats, isLoading, isError } = useMonthlyStats();
const { data } = useBudgets()
const budgetsArray = data?.budgets || [];
  
// Find the main budget
const mainBudget = budgetsArray.find(budget => budget.is_main === true);

console.log('Main budget:', mainBudget);
  
  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="200px">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }
  
  if (isError || !monthlyStats || !user) {
    return (
      <Box p={4} bg="red.50" color="red.500" borderRadius="lg">
        <Text>Unable to load account summary. Please try again later.</Text>
      </Box>
    );
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const statData = [
    {
      title: 'Total Balance',
      value: formatCurrency(Number(user.balance)),
      change: monthlyStats.percentageChanges.balance,
      icon: FiDollarSign,
      accentColor: 'blue.500'
    },
    {
      title: 'Income',
      value: formatCurrency(monthlyStats.currentMonth.income),
      change: monthlyStats.percentageChanges.income,
      icon: FiArrowUpRight,
      accentColor: 'green.500'
    },
    {
      title: 'Expenses',
      value: formatCurrency(monthlyStats.currentMonth.expenses),
      change: monthlyStats.percentageChanges.expenses,
      icon: FiArrowDownRight,
      accentColor: 'red.500'
    },
    {
      title: 'Budget Remaining',
      value: mainBudget 
        ? formatCurrency(Number(mainBudget.amount) - monthlyStats.currentMonth.expenses)
        : 'No budget set',
      change: mainBudget 
        ? parseFloat(((Number(mainBudget.amount) - monthlyStats.currentMonth.expenses) / Number(mainBudget.amount) * 100 - 100).toFixed(1))
        : undefined,
      icon: FiPieChart,
      accentColor: 'purple.500'
    }
  ];

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
      {statData.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          accentColor={stat.accentColor}
        />
      ))}
    </SimpleGrid>
  );
};

export default AccountSummary;