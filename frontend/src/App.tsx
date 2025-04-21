import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import AppRoutes from './routes/AppRoutes';
import { queryClient } from './lib/reactQuery';
import { ToastContainer } from 'react-toastify';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  components: {
    Toast: {
      baseStyle: {
        container: {
          zIndex: 9999, 
        },
      },
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <AppRoutes />
          <ToastContainer position="bottom-right" autoClose={3000} />
        </BrowserRouter>
      </ChakraProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;