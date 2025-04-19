// src/components/auth/SendPasswordResetForm.tsx
import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Stack, Heading, Text, Link, useToast } from '@chakra-ui/react';
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { useHistory } from 'react-router-dom';
import { useRequestPasswordReset } from '../../hooks/authQueries'; 

const RequestPasswordResetSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
});

const RequestPasswordResetForm = () => {
  const history = useHistory();
  const toast = useToast();
  const useRequestPasswordResetMutation = useRequestPasswordReset()

  const handleFormSubmit = async (values: { email: string }, { setSubmitting }: any) => {
    try {
      await useRequestPasswordResetMutation.mutateAsync(values.email);
      
      toast({
        title: "Reset link sent",
        description: "Check your email for the password reset link",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      history.push('/login');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send reset link",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box p={8} maxWidth="500px" borderWidth={0} borderRadius={0}>
      <Box textAlign="center">
        <Heading>Reset Your Password</Heading>
        <Text mt={4} color="gray.500">Enter your email to receive a reset link</Text>
      </Box>

      <Formik
        initialValues={{ email: '' }}
        validationSchema={RequestPasswordResetSchema}
        onSubmit={handleFormSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Stack spacing={4} mt={8}>
              <FormControl isInvalid={!!errors.email && touched.email}>
                <FormLabel>Email</FormLabel>
                <Field 
                  as={Input} 
                  id="email" 
                  name="email" 
                  type="email"
                  borderWidth={1}
                  borderColor="black"
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              <Box textAlign="center">
                <Button
                  mt={4}
                  backgroundColor="#4FD1C5"
                  color="white"
                  _hover={{
                    backgroundColor: "#319795"
                  }}
                  transition="background-color 0.3s ease"
                  isLoading={isSubmitting}
                  type="submit"
                  width="50%"
                >
                  Send Reset Link
                </Button>
              </Box>

              <Text mt={4} textAlign="center">
                Remember your password?{" "}
                <Link 
                  onClick={() => history.push('/login')}
                  cursor="pointer"
                  fontWeight="bold"
                >
                  Login
                </Link>
              </Text>
            </Stack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default RequestPasswordResetForm;