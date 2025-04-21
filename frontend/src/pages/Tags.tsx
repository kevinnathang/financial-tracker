import React from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import DashboardLayout from '../components/layout/DashboardLayout';
import CreateTag from '../components/tags/CreateTag'

const Dashboard: React.FC = () => {
  
  return (
    <DashboardLayout>
      <Grid
        templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
        gap={6}
      >
        <GridItem colSpan={{ base: 1, md: 2, lg: 4 }}>
          <CreateTag />
        </GridItem>
      </Grid>
    </DashboardLayout>
  );
};

export default Dashboard;