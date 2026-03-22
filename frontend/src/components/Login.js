import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Heading,
  Text,
  Link,
  Container,
  useColorModeValue,
} from '@chakra-ui/react';
import api from '../services/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.700');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await api.post('/auth/login', { username, password });
      if (data && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/clients');
      } else {
        alert('Login failed: Invalid response from server');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="lg" centerContent py={20}>
      <Box
        p={8}
        maxWidth="400px"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        bg={bgColor}
        width="full"
      >
        <VStack spacing={4} align="flex-start" w="full">
          <VStack spacing={1} align="flex-start" w="full">
            <Heading size="lg">Login</Heading>
            <Text color="gray.500">Welcome back! Please enter your details.</Text>
          </VStack>
          
          <Box as="form" onSubmit={handleLogin} w="full">
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </VStack>
          </Box>
          
          <HStack justifyContent="center" w="full">
            <Text>Don't have an account?</Text>
            <Link as={RouterLink} to="/register" color="blue.500">
              Register
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Container>
  );
};

export default Login;