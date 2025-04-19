// src/components/auth/LoginForm.tsx
import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Stack, Heading, Text, Link } from '@chakra-ui/react';
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { useLogin } from '../../hooks/authQueries';
import { useHistory } from 'react-router-dom';

const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required')
});

const LoginForm = () => {
    const loginMutation = useLogin();
    const history = useHistory();

    const handleFormSubmit = async (values: any, { setSubmitting }: any) => {
        try {
            await loginMutation.mutateAsync({ 
                email: values.email, 
                password: values.password 
            });
 
            history.push('/dashboard');
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box p={8} maxWidth="500px" borderWidth={0} borderRadius={0}>
            <Box textAlign="center">
                <Heading>Login to Your Account</Heading>
                <Text mt={4} color="gray.500">Track your finances with ease</Text>
            </Box>

            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={LoginSchema}
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

                            <FormControl isInvalid={!!errors.password && touched.password}>
                                <FormLabel>Password</FormLabel>
                                <Field 
                                    as={Input} 
                                    id="password" 
                                    name="password" 
                                    type="password" 
                                    borderWidth={1} 
                                    borderColor="black"
                                />
                                <FormErrorMessage>{errors.password}</FormErrorMessage>
                                <Text mt={1} textAlign="right" fontSize="sm">
                                    <Link 
                                        onClick={() => history.push('/request-reset-password')}
                                        cursor="pointer"
                                        color="blue.500"
                                    >
                                        Forgot password?
                                    </Link>
                                </Text>
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