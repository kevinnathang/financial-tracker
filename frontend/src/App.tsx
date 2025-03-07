// src/App.tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

// Create a theme with toast configuration
const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  components: {
    Toast: {
      baseStyle: {
        container: {
          zIndex: 9999, // High z-index to ensure toasts appear above all content
        },
      },
    },
  },
});

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;