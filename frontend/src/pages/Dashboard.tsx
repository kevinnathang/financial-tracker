import React from 'react';
import { Grid, GridItem, Heading, Box } from '@chakra-ui/react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AccountSummary from '../components/dashboard/widgets/AccountSummary';
import RecentTransactions from '../components/dashboard/widgets/RecentTransactions';
import { useUserData } from '../hooks/userQueries';

const Dashboard: React.FC = () => {
  const storedUser = localStorage.getItem('user');
  const currentUserId = storedUser ? JSON.parse(storedUser).id : null;
  
  const { data: user, isLoading: userLoading } = useUserData(currentUserId);
  
  return (
    <DashboardLayout>
      <Box mb={6}>
        <Heading size="lg">
          {userLoading ? 'Welcome!' : user ? `Welcome back, ${user.first_name}!` : 'Welcome!'}
        </Heading>
      </Box>
      {/* Dashboard Widgets Grid */}
      <Grid
        templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
        gap={6}
      >
        {/* Account Summary Cards */}
        <GridItem colSpan={{ base: 1, md: 2, lg: 4 }}>
          <AccountSummary />
        </GridItem>
        {/* Recent Transactions */}
        <GridItem colSpan={{ base: 1, md: 2, lg: 4 }}>
          <RecentTransactions />
        </GridItem>
      </Grid>
    </DashboardLayout>
  );
};

export default Dashboard;