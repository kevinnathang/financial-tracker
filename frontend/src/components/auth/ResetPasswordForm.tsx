// src/components/auth/ResetPasswordForm.tsx
import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Stack, Heading, Text, useToast } from '@chakra-ui/react';
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { useHistory, useParams } from 'react-router-dom';
import { useResetPassword } from '../../hooks/userQueries';

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required')
});

interface ResetParams {
  token: string;
}

const ResetPasswordForm = () => {
  const { token } = useParams<ResetParams>();
  const history = useHistory();
  const toast = useToast();
  const resetPasswordMutation = useResetPassword()

  const handleFormSubmit = async (values: { password: string }, { setSubmitting }: any) => {
    try {
      await resetPasswordMutation.mutateAsync({
        token,
        password: values.password
      });
          
      toast({
        title: "Password reset successful",
        description: "Your password has been updated successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      history.push('/login');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to reset password. The link may have expired.",
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
        <Heading>Create New Password</Heading>
        <Text mt={4} color="gray.500">Enter your new password below</Text>
      </Box>

      <Formik
        initialValues={{ password: '', confirmPassword: '' }}
        validationSchema={ResetPasswordSchema}
        onSubmit={handleFormSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Stack spacing={4} mt={8}>
              <FormControl isInvalid={!!errors.password && touched.password}>
                <FormLabel>New Password</FormLabel>
                <Field 
                  as={Input} 
                  id="password" 
                  name="password" 
                  type="password" 
                  borderWidth={1} 
                  borderColor="black"
                />
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.confirmPassword && touched.confirmPassword}>
                <FormLabel>Confirm Password</FormLabel>
                <Field 
                  as={Input} 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type="password" 
                  borderWidth={1} 
                  borderColor="black"
                />
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
                  transition="background-color 0.3s ease"
                  isLoading={isSubmitting}
                  type="submit"
                  width="50%"
                >
                  Reset Password
                </Button>
              </Box>
            </Stack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ResetPasswordForm;