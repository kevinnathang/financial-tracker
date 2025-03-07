// src/components/dashboard/widgets/AccountSummary.tsx
import React from 'react';
import { Box, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Flex } from '@chakra-ui/react';
import { FiDollarSign, FiArrowUpRight, FiArrowDownRight, FiPieChart } from 'react-icons/fi';
import { IconType } from 'react-icons';
import { ChakraIcon } from '../../ui/ChakraIcon';
import { useUserData } from '../../../hooks/userQueries';

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
        <Stat> {/* Added Stat wrapper component */}
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
  const { data: user } = useUserData()
  console.log('User data in AccountSummary:', JSON.stringify(user));

  const formattedBalance = `$${parseFloat(String(user?.balance)).toFixed(2)}`;

  const statData = [
    {
      title: 'Total Balance',
      value: formattedBalance,
      change: 2.5,
      icon: FiDollarSign,
      accentColor: 'blue.500'
    },
    {
      title: 'Income',
      value: '$3,450.00',
      change: 5.2,
      icon: FiArrowUpRight,
      accentColor: 'green.500'
    },
    {
      title: 'Expenses',
      value: '$2,150.00',
      change: -1.8,
      icon: FiArrowDownRight,
      accentColor: 'red.500'
    },
    {
      title: 'Budget Remaining',
      value: '$1,300.00',
      change: 3.1,
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