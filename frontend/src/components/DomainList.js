import React, { useState, useEffect } from 'react';
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
  Badge,
  HStack,
  Input,
  Select,
  VStack,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon, SearchIcon } from '@chakra-ui/icons';
import domainService from '../services/domainService';
import DomainForm from './DomainForm';

const DomainList = () => {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const fetchDomains = async () => {
    setLoading(true);
    try {
      const data = await domainService.getAllDomains();
      setDomains(data);
    } catch (error) {
      toast({
        title: 'Error fetching domains',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const handleEdit = (domain) => {
    setSelectedDomain(domain);
    onOpen();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this domain?')) {
      try {
        await domainService.deleteDomain(id);
        toast({
          title: 'Domain deleted successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        fetchDomains();
      } catch (error) {
        toast({
          title: 'Error deleting domain',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleCreate = () => {
    setSelectedDomain(null);
    onOpen();
  };

  const handleFormSuccess = () => {
    onClose();
    fetchDomains();
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'green';
      case 'expired':
        return 'red';
      case 'pending':
        return 'yellow';
      case 'suspended':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const filteredDomains = domains.filter((domain) => {
    const matchesSearch = domain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      domain.registrar.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || domain.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <HStack spacing={4}>
          <Box flex={1}>
            <Input
              placeholder="Search domains..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftElement={<SearchIcon color="gray.400" />}
            />
          </Box>
          <Select
            placeholder="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            w="200px"
          >
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </Select>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={handleCreate}
          >
            Add Domain
          </Button>
        </HStack>

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Domain Name</Th>
                <Th>Registrar</Th>
                <Th>Registration Date</Th>
                <Th>Expiry Date</Th>
                <Th>Status</Th>
                <Th>Auto Renew</Th>
                <Th>Client</Th>
                <Th>Website</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredDomains.map((domain) => (
                <Tr key={domain.id}>
                  <Td>{domain.name}</Td>
                  <Td>{domain.registrar}</Td>
                  <Td>{new Date(domain.registrationDate).toLocaleDateString()}</Td>
                  <Td>{new Date(domain.expiryDate).toLocaleDateString()}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(domain.status)}>
                      {domain.status}
                    </Badge>
                  </Td>
                  <Td>{domain.autoRenew ? 'Yes' : 'No'}</Td>
                  <Td>{domain.Client?.name || 'N/A'}</Td>
                  <Td>{domain.Website?.name || 'N/A'}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        icon={<EditIcon />}
                        size="sm"
                        onClick={() => handleEdit(domain)}
                        colorScheme="blue"
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        size="sm"
                        onClick={() => handleDelete(domain.id)}
                        colorScheme="red"
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
              {filteredDomains.length === 0 && (
                <Tr>
                  <Td colSpan={9} textAlign="center">
                    <Text>No domains found</Text>
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
          <ModalHeader>
            {selectedDomain ? 'Edit Domain' : 'Add New Domain'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <DomainForm
              domainId={selectedDomain?.id}
              onSuccess={handleFormSuccess}
              onCancel={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DomainList; 