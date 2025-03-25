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
  Checkbox,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  FormControl,
  FormLabel,
  Switch,
  useColorModeValue,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon, SearchIcon, DownloadIcon, ChevronDownIcon } from '@chakra-ui/icons';
import domainService from '../../services/domainService';
import DomainForm from './DomainForm';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

const DomainList = () => {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    registrar: '',
    autoRenew: '',
    expiringSoon: false,
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingDomain, setEditingDomain] = useState(null);
  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    fetchDomains();
  }, [currentPage, filters, searchTerm]);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      const response = await domainService.getAll();
      let filteredDomains = [...response];

      // Apply filters
      if (filters.status) {
        filteredDomains = filteredDomains.filter(d => d.status === filters.status);
      }
      if (filters.registrar) {
        filteredDomains = filteredDomains.filter(d => d.registrar === filters.registrar);
      }
      if (filters.autoRenew !== '') {
        filteredDomains = filteredDomains.filter(d => d.autoRenew === (filters.autoRenew === 'true'));
      }
      if (filters.expiringSoon) {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        filteredDomains = filteredDomains.filter(d => {
          const expiryDate = new Date(d.expiryDate);
          return expiryDate <= thirtyDaysFromNow && expiryDate > new Date();
        });
      }

      // Apply search
      if (searchTerm) {
        filteredDomains = filteredDomains.filter(d =>
          d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.registrar.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.client?.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply sorting
      if (sortConfig.key) {
        filteredDomains.sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }

      // Apply pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedDomains = filteredDomains.slice(startIndex, endIndex);
      setTotalPages(Math.ceil(filteredDomains.length / itemsPerPage));
      setDomains(paginatedDomains);
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this domain?')) {
      try {
        await domainService.delete(id);
        toast({
          title: 'Domain deleted successfully',
          status: 'success',
          duration: 3000,
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

  const handleEdit = (domain) => {
    setEditingDomain(domain);
    onOpen();
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingDomain) {
        await domainService.update(editingDomain.id, formData);
        toast({
          title: 'Domain updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await domainService.create(formData);
        toast({
          title: 'Domain created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
      fetchDomains();
    } catch (error) {
      toast({
        title: `Error ${editingDomain ? 'updating' : 'creating'} domain`,
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedDomains.length} domains?`)) {
      try {
        await Promise.all(selectedDomains.map(id => domainService.delete(id)));
        toast({
          title: 'Domains deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setSelectedDomains([]);
        fetchDomains();
      } catch (error) {
        toast({
          title: 'Error deleting domains',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleExport = () => {
    const exportData = domains.map(domain => ({
      Name: domain.name,
      Registrar: domain.registrar,
      Status: domain.status,
      'Registration Date': format(new Date(domain.registrationDate), 'yyyy-MM-dd'),
      'Expiry Date': format(new Date(domain.expiryDate), 'yyyy-MM-dd'),
      'Auto Renew': domain.autoRenew ? 'Yes' : 'No',
      'Renewal Charge': domain.renewalCharge,
      Client: domain.client?.name || '',
      Website: domain.website?.name || '',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Domains');
    XLSX.writeFile(wb, 'domains.xlsx');
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'expired':
        return 'red';
      case 'pending':
        return 'yellow';
      case 'suspended':
        return 'purple';
      default:
        return 'gray';
    }
  };

  return (
    <Box>
      <HStack mb={4} justify="space-between">
        <HStack>
          <Input
            placeholder="Search domains..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            width="300px"
          />
          <Button leftIcon={<SearchIcon />} onClick={onFilterOpen}>
            Filters
          </Button>
        </HStack>
        <HStack>
          {selectedDomains.length > 0 && (
            <Button colorScheme="red" onClick={handleBulkDelete}>
              Delete Selected ({selectedDomains.length})
            </Button>
          )}
          <Button leftIcon={<DownloadIcon />} onClick={handleExport}>
            Export
          </Button>
          <Button colorScheme="blue" onClick={() => {
            setEditingDomain(null);
            onOpen();
          }}>
            Add Domain
          </Button>
        </HStack>
      </HStack>

      <Box overflowX="auto">
        <Table variant="simple" bg={bgColor} borderWidth="1px" borderColor={borderColor}>
          <Thead>
            <Tr>
              <Th>
                <Checkbox
                  isChecked={selectedDomains.length === domains.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedDomains(domains.map(d => d.id));
                    } else {
                      setSelectedDomains([]);
                    }
                  }}
                />
              </Th>
              <Th cursor="pointer" onClick={() => handleSort('name')}>
                Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </Th>
              <Th cursor="pointer" onClick={() => handleSort('registrar')}>
                Registrar {sortConfig.key === 'registrar' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </Th>
              <Th>Status</Th>
              <Th cursor="pointer" onClick={() => handleSort('registrationDate')}>
                Registration Date {sortConfig.key === 'registrationDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </Th>
              <Th cursor="pointer" onClick={() => handleSort('expiryDate')}>
                Expiry Date {sortConfig.key === 'expiryDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </Th>
              <Th>Auto Renew</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {domains.map((domain) => (
              <Tr key={domain.id}>
                <Td>
                  <Checkbox
                    isChecked={selectedDomains.includes(domain.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDomains([...selectedDomains, domain.id]);
                      } else {
                        setSelectedDomains(selectedDomains.filter(id => id !== domain.id));
                      }
                    }}
                  />
                </Td>
                <Td>{domain.name}</Td>
                <Td>{domain.registrar}</Td>
                <Td>
                  <Badge colorScheme={getStatusColor(domain.status)}>
                    {domain.status}
                  </Badge>
                </Td>
                <Td>{format(new Date(domain.registrationDate), 'yyyy-MM-dd')}</Td>
                <Td>{format(new Date(domain.expiryDate), 'yyyy-MM-dd')}</Td>
                <Td>{domain.autoRenew ? 'Yes' : 'No'}</Td>
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
          </Tbody>
        </Table>
      </Box>

      <HStack mt={4} justify="center">
        <Button
          isDisabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Previous
        </Button>
        <Text>
          Page {currentPage} of {totalPages}
        </Text>
        <Button
          isDisabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Next
        </Button>
      </HStack>

      <Drawer isOpen={isFilterOpen} placement="right" onClose={onFilterClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Filter Domains</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Registrar</FormLabel>
                <Select
                  value={filters.registrar}
                  onChange={(e) => setFilters(prev => ({ ...prev, registrar: e.target.value }))}
                >
                  <option value="">All</option>
                  <option value="GoDaddy">GoDaddy</option>
                  <option value="Namecheap">Namecheap</option>
                  <option value="Google Domains">Google Domains</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Auto Renew</FormLabel>
                <Select
                  value={filters.autoRenew}
                  onChange={(e) => setFilters(prev => ({ ...prev, autoRenew: e.target.value }))}
                >
                  <option value="">All</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Select>
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Expiring Soon</FormLabel>
                <Switch
                  isChecked={filters.expiringSoon}
                  onChange={(e) => setFilters(prev => ({ ...prev, expiringSoon: e.target.checked }))}
                />
              </FormControl>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <DomainForm
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
        domain={editingDomain}
      />
    </Box>
  );
};

export default DomainList; 