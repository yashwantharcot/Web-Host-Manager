import React, { useState, useEffect, useCallback } from 'react';
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
  Heading,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useColorModeValue,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon, SearchIcon, DownloadIcon } from '@chakra-ui/icons';
import { domainService } from '../../services/api';
import DomainForm from './DomainForm';
// Removed date-fns and xlsx dependencies

const DomainList = ({ clientId, domains: initialDomains, onUpdate }) => {
  const [domains, setDomains] = useState(initialDomains || []);
  const [loading, setLoading] = useState(!initialDomains);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(null);
  
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();


  const fetchDomains = useCallback(async () => {
    if (initialDomains && !clientId) return;
    
    setLoading(true);
    try {
      const data = clientId 
        ? await domainService.getDomainsByClient(clientId)
        : await domainService.getAllDomains();
      setDomains(data || []);
    } catch (error) {
      toast({
        title: 'Error fetching domains',
        description: error.message,
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [clientId, initialDomains, toast]);

  useEffect(() => {
    if (!initialDomains || clientId) {
      fetchDomains();
    }
  }, [fetchDomains, initialDomains, clientId]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this domain?')) {
      try {
        await domainService.deleteDomain(id);
        toast({ title: 'Domain deleted', status: 'success' });
        if (onUpdate) onUpdate();
        fetchDomains();
      } catch (error) {
        toast({ title: 'Error deleting domain', description: error.message, status: 'error' });
      }
    }
  };

  const handleEdit = (domain) => {
    setSelectedDomain(domain);
    onOpen();
  };

  const handleFormSuccess = () => {
    onClose();
    if (onUpdate) onUpdate();
    fetchDomains();
  };

  const handleExport = () => {
    const exportData = domains.map(domain => ({
      Name: domain.name,
      Registrar: domain.registrar,
      Status: domain.status,
      'Registration Date': domain.registrationDate ? new Date(domain.registrationDate).toLocaleDateString() : 'N/A',
      'Expiry Date': domain.expiryDate ? new Date(domain.expiryDate).toLocaleDateString() : 'N/A',
      'Auto Renew': domain.autoRenew ? 'Yes' : 'No',
      Client: domain.Client?.name || domain.clientName || '',
    }));

    const headers = Object.keys(exportData[0]).join(',');
    const rows = exportData.map(row => Object.values(row).join(',')).join('\n');
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "domains.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'green';
      case 'expired': return 'red';
      case 'pending': return 'yellow';
      case 'suspended': return 'purple';
      default: return 'gray';
    }
  };

  const filteredDomains = domains.filter(domain => {
    const matchesSearch = domain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         domain.registrar?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || domain.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        <HStack justifyContent="space-between" wrap="wrap" spacing={4}>
          <Heading size="lg">Domains</Heading>
          <HStack spacing={3}>
            <Input
              placeholder="Search domains..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              width="250px"
              bg="white"
            />
            <Select
              placeholder="All Statuses"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              width="150px"
              bg="white"
            >
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </Select>
            <Button leftIcon={<DownloadIcon />} onClick={handleExport} variant="outline">
              Export
            </Button>
            <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={() => { setSelectedDomain(null); onOpen(); }}>
              Add Domain
            </Button>
          </HStack>
        </HStack>

        <Box overflowX="auto" borderWidth="1px" borderRadius="lg" bg="white">
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>Name</Th>
                <Th>Registrar</Th>
                <Th>Expiry</Th>
                <Th>Auto Renew</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredDomains.map((domain) => (
                <Tr key={domain.id} _hover={{ bg: 'gray.50' }}>
                  <Td fontWeight="medium">{domain.name}</Td>
                  <Td>{domain.registrar}</Td>
                  <Td>{domain.expiryDate ? new Date(domain.expiryDate).toLocaleDateString() : 'N/A'}</Td>

                  <Td>
                    <Badge colorScheme={domain.autoRenew ? 'green' : 'gray'}>
                      {domain.autoRenew ? 'Yes' : 'No'}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(domain.status)}>
                      {domain.status}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton size="sm" icon={<EditIcon />} onClick={() => handleEdit(domain)} aria-label="Edit domain" />
                      <IconButton size="sm" icon={<DeleteIcon />} colorScheme="red" onClick={() => handleDelete(domain.id)} aria-label="Delete domain" />
                    </HStack>
                  </Td>
                </Tr>
              ))}
              {filteredDomains.length === 0 && (
                <Tr>
                  <Td colSpan={6} textAlign="center" py={10}>
                    <Text color="gray.500">No domains found</Text>
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
          <ModalHeader>{selectedDomain ? 'Edit Domain' : 'Add New Domain'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <DomainForm
              domainId={selectedDomain?.id}
              clientId={clientId}
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