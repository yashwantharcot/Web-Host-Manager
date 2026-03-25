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
import { EditIcon, DeleteIcon, AddIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { websiteService } from '../../services/api';
import WebsiteForm from './WebsiteForm';

const WebsiteList = ({ clientId, websites: initialWebsites, onUpdate }) => {
  const [websites, setWebsites] = useState(initialWebsites || []);
  const [loading, setLoading] = useState(!initialWebsites);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedWebsite, setSelectedWebsite] = useState(null);
  const toast = useToast();

  const fetchWebsites = useCallback(async () => {
    if (initialWebsites && !clientId) return; // Use initial data if provided and no clientId
    
    setLoading(true);
    try {
      const data = clientId 
        ? await websiteService.getWebsitesByClient(clientId)
        : await websiteService.getAllWebsites();
      setWebsites(data || []);
    } catch (error) {
      toast({
        title: 'Error fetching websites',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [clientId, initialWebsites, toast]);

  useEffect(() => {
    if (!initialWebsites || clientId) {
      fetchWebsites();
    }
  }, [clientId, initialWebsites, fetchWebsites]);

  const handleEdit = (website) => {
    setSelectedWebsite(website);
    onOpen();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this website?')) {
      try {
        await websiteService.deleteWebsite(id);
        toast({ title: 'Website deleted', status: 'success' });
        if (onUpdate) onUpdate();
        fetchWebsites();
      } catch (error) {
        toast({ title: 'Error deleting website', description: error.message, status: 'error' });
      }
    }
  };

  const handleFormSuccess = () => {
    onClose();
    if (onUpdate) onUpdate();
    fetchWebsites();
  };

  const handleOpenWebsite = (url) => {
    if (!url) return;
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(fullUrl, '_blank');
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
          <Text fontSize="2xl" fontWeight="bold">Websites</Text>
          <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={() => { setSelectedWebsite(null); onOpen(); }}>
            Add Website
          </Button>
        </HStack>

        <Box overflowX="auto" borderWidth="1px" borderRadius="lg" bg="white">
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>Name</Th>
                <Th>URL</Th>
                <Th>Hosting</Th>
                <Th>Expiry</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {websites.map((website) => (
                <Tr key={website.id} _hover={{ bg: 'gray.50' }}>
                  <Td fontWeight="medium">{website.name}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <Text isTruncated maxW="200px">{website.url}</Text>
                      <IconButton
                        size="xs"
                        icon={<ExternalLinkIcon />}
                        onClick={() => handleOpenWebsite(website.url)}
                        aria-label="Open website"
                        variant="ghost"
                      />
                    </HStack>
                  </Td>
                  <Td>{website.hostingProvider || 'N/A'}</Td>
                  <Td>{website.expiryDate ? new Date(website.expiryDate).toLocaleDateString() : 'N/A'}</Td>
                  <Td>
                    <Badge colorScheme={website.status === 'Active' ? 'green' : 'red'}>
                      {website.status}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton size="sm" icon={<EditIcon />} onClick={() => handleEdit(website)} aria-label="Edit website" />
                      <IconButton size="sm" icon={<DeleteIcon />} colorScheme="red" onClick={() => handleDelete(website.id)} aria-label="Delete website" />
                    </HStack>
                  </Td>
                </Tr>
              ))}
              {websites.length === 0 && (
                <Tr>
                  <Td colSpan={6} textAlign="center" py={10}>
                    <Text color="gray.500">No websites found</Text>
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
          <ModalHeader>{selectedWebsite ? 'Edit Website' : 'Add New Website'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <WebsiteForm
              websiteId={selectedWebsite?.id}
              clientId={clientId}
              initialData={selectedWebsite}
              onSuccess={handleFormSuccess}
              onCancel={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default WebsiteList;