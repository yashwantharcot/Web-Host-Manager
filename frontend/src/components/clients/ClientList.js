import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  IconButton,
  HStack,
  VStack,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { clientService } from '../../services/api';
import ClientForm from './ClientForm';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const data = await clientService.getAllClients();
      setClients(data || []);
    } catch (error) {
      toast({
        title: 'Error fetching clients',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleEdit = (client) => {
    setSelectedClient(client);
    onOpen();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await clientService.deleteClient(id);
        toast({ title: 'Client deleted', status: 'success' });
        fetchClients();
      } catch (error) {
        toast({ title: 'Error deleting client', description: error.message, status: 'error' });
      }
    }
  };

  const handleFormSuccess = () => {
    onClose();
    fetchClients();
  };

  if (loading) {
    return (
      <Center height="200px">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <HStack justifyContent="space-between">
          <Text fontSize="2xl" fontWeight="bold">Clients</Text>
          <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={() => { setSelectedClient(null); onOpen(); }}>
            Add Client
          </Button>
        </HStack>

        <Box overflowX="auto" borderWidth="1px" borderRadius="lg" bg="white">
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>Name</Th>
                <Th>Company</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {clients.map((client) => (
                <Tr key={client.id} _hover={{ bg: 'gray.50' }}>
                  <Td fontWeight="medium">{client.name}</Td>
                  <Td>{client.company}</Td>
                  <Td>{client.email}</Td>
                  <Td>{client.phone || 'N/A'}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton size="sm" icon={<EditIcon />} onClick={() => handleEdit(client)} aria-label="Edit client" />
                      <IconButton size="sm" icon={<DeleteIcon />} colorScheme="red" onClick={() => handleDelete(client.id)} aria-label="Delete client" />
                    </HStack>
                  </Td>
                </Tr>
              ))}
              {clients.length === 0 && (
                <Tr>
                  <Td colSpan={5} textAlign="center" py={10}>
                    <VStack spacing={2}>
                      <Text color="gray.500">No clients found</Text>
                      <Button size="sm" variant="ghost" colorScheme="blue" onClick={onOpen}>Add your first client</Button>
                    </VStack>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedClient ? 'Edit Client' : 'Add New Client'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <ClientForm
              clientId={selectedClient?.id}
              initialData={selectedClient}
              onSuccess={handleFormSuccess}
              onCancel={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ClientList;