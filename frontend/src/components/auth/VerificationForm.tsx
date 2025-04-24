import React, { useState } from 'react';
import { Box, Button, Stack, Heading, Text } from '@chakra-ui/react';
import { useHistory, useParams } from 'react-router-dom';
import { useVerifyUser } from '../../hooks/authQueries';
import { toast } from 'react-toastify';

interface VerificationFormProps {
  email?: string;
  onBack?: () => void;
}

const VerificationForm = ({ email, onBack }: VerificationFormProps) => {
  const history = useHistory();
  const { verificationToken } = useParams<{ verificationToken: string }>();
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyMutation = useVerifyUser();

  const handleVerify = async () => {
    try {
      setIsVerifying(true);
      const response = await verifyMutation.mutateAsync(verificationToken);
      
      localStorage.setItem('token', response.token);
      
      toast.success("Your account has been successfully verified")

      setTimeout(() => {
        history.push('/login');
      }, 3000);

    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred")
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Box textAlign="center" padding="20px">
      <Heading size="lg">Verify Your Email</Heading>
      <Text mt={4} color="gray.600">
        {email ? `We've sent a verification link to ${email}` : 'Complete your account verification'}
      </Text>
      <Text mt={2} color="gray.500">
        Click the button below to verify your email address
      </Text>

      <Box mt={8}>
        <Stack spacing={4} mt={8}>
          <Button
            backgroundColor="#4FD1C5"
            color="white"
            maxWidth="300px"
            mx="auto"
            display="box"
            _hover={{
              backgroundColor: "#319795"
            }}
            isLoading={isVerifying}
            onClick={handleVerify}
            width="full"
          >
            Verify My Account
          </Button>
          
            <Button
              variant="link"
              onClick={(() => history.push('/register'))}
              color="gray.500"
              fontSize="sm"
            >
              ← Back to registration
            </Button>
          
          <Text fontSize="sm" color="gray.500" mt={4}>
            Having trouble? Please contact support for assistance.
          </Text>
        </Stack>
      </Box>
    </Box>
  );
};

export default VerificationForm;