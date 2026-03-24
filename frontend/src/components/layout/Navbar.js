import React from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  useColorModeValue,
  Container,
} from '@chakra-ui/react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      color={useColorModeValue('gray.600', 'white')}
      minH={'60px'}
      py={{ base: 2 }}
      px={{ base: 4 }}
      borderBottom={1}
      borderStyle={'solid'}
      borderColor={useColorModeValue('gray.200', 'gray.900')}
      position="sticky"
      top="0"
      zIndex="10"
    >
      <Container maxW="container.xl">
        <Flex justify={'space-between'} align={'center'}>
          <Flex align="center">
            <Text
              as={RouterLink}
              to="/"
              textAlign="left"
              fontFamily={'heading'}
              fontWeight="bold"
              color={useColorModeValue('gray.800', 'white')}
              fontSize="xl"
            >
              Web Host Manager
            </Text>
          </Flex>

          <Stack
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={6}
          >
            {token ? (
              <>
                <Button as={RouterLink} to="/dashboard" fontSize={'sm'} fontWeight={400} variant={'link'}>
                  Dashboard
                </Button>
                <Button as={RouterLink} to="/clients" fontSize={'sm'} fontWeight={400} variant={'link'}>
                  Clients
                </Button>
                <Button as={RouterLink} to="/domains" fontSize={'sm'} fontWeight={400} variant={'link'}>
                  Domains
                </Button>
                <Button as={RouterLink} to="/websites" fontSize={'sm'} fontWeight={400} variant={'link'}>
                  Websites
                </Button>
                <Button as={RouterLink} to="/emails" fontSize={'sm'} fontWeight={400} variant={'link'}>
                  Emails
                </Button>
                <Button as={RouterLink} to="/settings" fontSize={'sm'} fontWeight={400} variant={'link'}>
                  Settings
                </Button>
                <Text fontSize="sm" alignSelf="center" fontWeight="bold">
                  Hi, {user?.username || 'User'}
                </Text>
                <Button
                  display={{ base: 'none', md: 'inline-flex' }}
                  fontSize={'sm'}
                  fontWeight={600}
                  color={'white'}
                  bg={'red.400'}
                  onClick={handleLogout}
                  _hover={{
                    bg: 'red.300',
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (

              <>
                <Button
                  as={RouterLink}
                  to="/login"
                  fontSize={'sm'}
                  fontWeight={400}
                  variant={'link'}
                >
                  Sign In
                </Button>
                <Button
                  as={RouterLink}
                  to="/register"
                  display={{ base: 'none', md: 'inline-flex' }}
                  fontSize={'sm'}
                  fontWeight={600}
                  color={'white'}
                  bg={'blue.400'}
                  _hover={{
                    bg: 'blue.300',
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Stack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;
