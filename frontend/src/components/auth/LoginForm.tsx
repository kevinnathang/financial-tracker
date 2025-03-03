// src/components/auth/LoginForm.tsx
import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Stack, Heading, Text, Link, Center } from '@chakra-ui/react';
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { useToast } from '@chakra-ui/toast';
import { useAuth } from '../../hooks/useAuth';
import { useHistory } from 'react-router-dom';

const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required')
});

const LoginForm = () => {
    const { login } = useAuth();
    const history = useHistory();
    const toast = useToast();

    return (
        <Box p={20} maxWidth="500px" borderWidth={0} borderRadius={0} boxShadow="lg">
            <Box textAlign="center">
                <Heading>Login to Your Account</Heading>
                <Text mt={4} color="gray.500">Track your finances with ease</Text>
            </Box>

            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={LoginSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        await login(values.email, values.password);
                        toast({
                            title: "Login successful",
                            status: "success",
                            duration: 3000,
                            isClosable: true,
                        });
                        history.push('/dashboard');
                    } catch (error: any) {
                        toast({
                            title: "Login failed",
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

                            <FormControl isInvalid={!!errors.password && touched.password}>
                                <FormLabel>Password</FormLabel>
                                <Field 
                                    as={Input} 
                                    id="password" 
                                    name="password" 
                                    type="password" 
                                    borderWidth={1} 
                                    borderColor="black"/>
                                <FormErrorMessage>{errors.password}</FormErrorMessage>
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
                                Login
                                </Button>
                            </Box>

                            <Text mt={4} textAlign="center">
                                Don't have an account?{" "}
                                <Link 
                                    onClick={() => history.push('/register')}
                                    cursor="pointer"
                                    fontWeight="bold"
                                >
                                Register
                                </Link>
                            </Text>
                        </Stack>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};

export default LoginForm;