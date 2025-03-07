// src/pages/dashboard/Dashboard.tsx
import React from 'react';
import { Grid, GridItem, Heading, Box } from '@chakra-ui/react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AccountSummary from '../components/dashboard/widgets/AccountSummary';
import RecentTransactions from '../components/dashboard/widgets/RecentTransactions';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <Box mb={6}>
        <Heading size="lg">Welcome back!</Heading>
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