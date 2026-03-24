import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  HStack,
  Divider,
  useToast,
  Spinner,
  Center,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { ArrowBackIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { clientService } from '../../services/api';
import ClientForm from './ClientForm';
import WebsiteList from '../websites/WebsiteList';
import DomainList from '../domains/DomainList';
import EmailList from '../emails/EmailList';

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const loadClient = useCallback(async () => {
    try {
      setLoading(true);
      const data = await clientService.getClient(id);
      setClient(data);
    } catch (err) {
      toast({
        title: 'Error loading client',
        description: err.message,
        status: 'error',
      });
      console.error('Error loading client:', err);
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    loadClient();
  }, [loadClient]);

  const handleUpdateClient = () => {
    onClose();
    loadClient();
  };

  const handleDeleteClient = async () => {
    if (window.confirm('Are you sure you want to delete this client? This will delete all associated websites, domains, and email accounts.')) {
      try {
        await clientService.deleteClient(id);
        toast({ title: 'Client deleted', status: 'success' });
        navigate('/clients');
      } catch (error) {
        toast({ title: 'Error deleting client', description: error.message, status: 'error' });
      }
    }
  };

  if (loading) {
    return (
      <Center minH="400px">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (!client) {
    return (
      <Center minH="400px">
        <VStack spacing={4}>
          <Text fontSize="xl">Client not found</Text>
          <Button onClick={() => navigate('/clients')}>Back to Clients</Button>
        </VStack>
      </Center>
    );
  }

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <HStack justifyContent="space-between" wrap="wrap" spacing={4}>
          <HStack spacing={4}>
            <IconButton
              icon={<ArrowBackIcon />}
              onClick={() => navigate('/clients')}
              variant="ghost"
              aria-label="Back to clients"
            />
            <VStack align="flex-start" spacing={0}>
              <Heading size="lg">{client.name}</Heading>
              <Text color="gray.500">{client.company}</Text>
            </VStack>
          </HStack>
          <HStack spacing={3}>
            <Button leftIcon={<EditIcon />} colorScheme="blue" onClick={onOpen}>
              Edit Client
            </Button>
            <Button leftIcon={<DeleteIcon />} colorScheme="red" variant="outline" onClick={handleDeleteClient}>
              Delete
            </Button>
          </HStack>
        </HStack>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={8}>
          <GridItem>
            <Box p={6} borderWidth="1px" borderRadius="lg" bg="white" shadow="sm">
              <Heading size="md" mb={4}>Contact Information</Heading>
              <VStack align="stretch" spacing={3}>
                <HStack>
                  <Text fontWeight="bold" minW="100px">Email:</Text>
                  <Text>{client.email}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold" minW="100px">Phone:</Text>
                  <Text>{client.phone || 'N/A'}</Text>
                </HStack>
                <HStack align="flex-start">
                  <Text fontWeight="bold" minW="100px">Address:</Text>
                  <Text>{client.address || 'N/A'}</Text>
                </HStack>
              </VStack>
            </Box>
          </GridItem>
          <GridItem>
            <Box p={6} borderWidth="1px" borderRadius="lg" bg="white" shadow="sm">
              <Heading size="md" mb={4}>Client Stats</Heading>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <VStack p={4} bg="blue.50" borderRadius="md" align="center">
                  <Text fontWeight="bold" fontSize="2xl">{client.Websites?.length || 0}</Text>
                  <Text fontSize="sm">Websites</Text>
                </VStack>
                <VStack p={4} bg="green.50" borderRadius="md" align="center">
                  <Text fontWeight="bold" fontSize="2xl">{client.Domains?.length || 0}</Text>
                  <Text fontSize="sm">Domains</Text>
                </VStack>
                <VStack p={4} bg="purple.50" borderRadius="md" align="center" gridColumn="span 2">
                  <Text fontWeight="bold" fontSize="2xl">{client.EmailAccounts?.length || 0}</Text>
                  <Text fontSize="sm">Email Accounts</Text>
                </VStack>
              </Grid>
            </Box>
          </GridItem>
        </Grid>

        <Divider />

        <Box>
          <WebsiteList clientId={id} websites={client.Websites} onUpdate={loadClient} />
        </Box>

        <Divider />

        <Box>
          <DomainList clientId={id} domains={client.Domains} onUpdate={loadClient} />
        </Box>

        <Divider />

        <Box>
          <EmailList clientId={id} emailAccounts={client.EmailAccounts} onUpdate={loadClient} />
        </Box>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Client</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <ClientForm
              clientId={id}
              initialData={client}
              onSuccess={handleUpdateClient}
              onCancel={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ClientDetails;