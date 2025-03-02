// src/components/auth/LoginForm.tsx
import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Stack, Heading, Text, Link } from '@chakra-ui/react';
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
        <Box p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg">
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
                                <Field as={Input} id="email" name="email" type="email" />
                                <FormErrorMessage>{errors.email}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.password && touched.password}>
                                <FormLabel>Password</FormLabel>
                                <Field as={Input} id="password" name="password" type="password" />
                                <FormErrorMessage>{errors.password}</FormErrorMessage>
                            </FormControl>

                            <Button
                                mt={4}
                                colorScheme="teal"
                                isLoading={isSubmitting}
                                type="submit"
                                width="full"
                            >
                                Login
                            </Button>

                            <Text mt={4} textAlign="center">
                                Don't have an account?{" "}
                                <Link color="teal.500" onClick={() => history.push('/register')}>
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