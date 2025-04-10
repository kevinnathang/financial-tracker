// src/components/auth/RegisterForm.tsx
import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Stack, Heading, Text, Link } from '@chakra-ui/react';
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { useToast } from '@chakra-ui/toast';
import { useRegister } from '../../hooks/userQueries';
import { useHistory } from 'react-router-dom';

const RegisterSchema = Yup.object().shape({
  full_name: Yup.string()
    .min(2, 'Name is too short')
    .max(50, 'Name is too long')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required')
});

const RegisterForm = () => {
  const registerMutation = useRegister();
  const history = useHistory();
  const toast = useToast();

  return (
    <Box p={20} maxWidth="500px" borderWidth={0} borderRadius={0} boxShadow="lg">
      <Box textAlign="center">
        <Heading>Create Your Account</Heading>
        <Text mt={4} color="gray.500">Start tracking your finances today</Text>
      </Box>

      <Formik
        initialValues={{ full_name: '', email: '', password: '', confirmPassword: '' }}
        validationSchema={RegisterSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await registerMutation.mutateAsync({
              email: values.email,
              password: values.password,
              full_name: values.full_name
            });
            
            toast({
              title: "Registration successful",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            history.push('/dashboard');
          } catch (error: any) {
            toast({
              title: "Registration failed",
              description: error.response?.data?.message || "An error occurred",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Stack spacing={4} mt={8}>
              <FormControl isInvalid={!!errors.full_name && touched.full_name}>
                <FormLabel>Full Name</FormLabel>
                <Field as={Input} id="full_name" name="full_name" borderWidth={1} borderColor="black" />
                <FormErrorMessage>{errors.full_name}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.email && touched.email}>
                <FormLabel>Email</FormLabel>
                <Field as={Input} id="email" name="email" type="email" borderWidth={1} borderColor="black" />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password && touched.password}>
                <FormLabel>Password</FormLabel>
                <Field as={Input} id="password" name="password" type="password" borderWidth={1} borderColor="black" />
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.confirmPassword && touched.confirmPassword}>
                <FormLabel>Confirm Password</FormLabel>
                <Field as={Input} id="confirmPassword" name="confirmPassword" type="password" borderWidth={1} borderColor="black" />
                <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
              </FormControl>

              <Box textAlign="center">
                <Button
                  mt={4}
                  backgroundColor="#4FD1C5"
                  color="white"
                  _hover={{
                      backgroundColor: "#319795"
                  }}
                  isLoading={isSubmitting}
                  transition="background-color 0.3s ease"
                  type="submit"
                  width="50%"
                >
                  Register
                </Button>
              </Box>
              <Text mt={4} textAlign="center">
                Already have an account?{" "}
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

export default RegisterForm;