import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  Container,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import api from '../services/api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.700');

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/auth/register', { username, email, password });
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Error registering:', error);
      alert('Registration failed. ' + (error.response?.data?.message || 'Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="lg" centerContent py={20}>
      <Box
        p={8}
        maxWidth="450px"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        bg={bgColor}
        width="full"
      >
        <VStack spacing={4} align="flex-start" w="full">
          <VStack spacing={1} align="flex-start" w="full">
            <Heading size="lg">Create Account</Heading>
            <Text color="gray.500">Join us to manage your websites easily.</Text>
          </VStack>
          
          <Box as="form" onSubmit={handleRegister} w="full">
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={isLoading}
              >
                Sign Up
              </Button>
            </VStack>
          </Box>
          
          <HStack justifyContent="center" w="full">
            <Text>Already have an account?</Text>
            <Link as={RouterLink} to="/login" color="blue.500">
              Login
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Container>
  );
};

export default Register;