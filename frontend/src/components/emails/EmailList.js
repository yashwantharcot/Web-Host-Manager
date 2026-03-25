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
import { EditIcon, DeleteIcon, AddIcon, EmailIcon } from '@chakra-ui/icons';
import { emailService } from '../../services/api';
import EmailForm from './EmailForm';

const EmailList = ({ clientId, emailAccounts: initialEmails, onUpdate }) => {
  const [emails, setEmails] = useState(initialEmails || []);
  const [loading, setLoading] = useState(!initialEmails);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEmail, setSelectedEmail] = useState(null);
  const toast = useToast();

  const fetchEmails = useCallback(async () => {
    if (initialEmails && !clientId) return;
    
    setLoading(true);
    try {
      const data = clientId 
        ? await emailService.getEmailAccountsByClient(clientId)
        : await emailService.getAllEmailAccounts();
      setEmails(data || []);
    } catch (error) {
      toast({
        title: 'Error fetching email accounts',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [clientId, initialEmails, toast]);

  useEffect(() => {
    if (!initialEmails || clientId) {
      fetchEmails();
    }
  }, [clientId, initialEmails, fetchEmails]);

  const handleEdit = (email) => {
    setSelectedEmail(email);
    onOpen();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this email account?')) {
      try {
        await emailService.deleteEmailAccount(id);
        toast({ title: 'Email account deleted', status: 'success' });
        if (onUpdate) onUpdate();
        fetchEmails();
      } catch (error) {
        toast({ title: 'Error deleting email account', description: error.message, status: 'error' });
      }
    }
  };

  const handleFormSuccess = () => {
    onClose();
    if (onUpdate) onUpdate();
    fetchEmails();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'green';
      case 'suspended':
        return 'yellow';
      case 'expired':
        return 'red';
      case 'cancelled':
        return 'gray';
      default:
        return 'gray';
    }
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
          <Text fontSize="2xl" fontWeight="bold">Email Accounts</Text>
          <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={() => { setSelectedEmail(null); onOpen(); }}>
            Add Account
          </Button>
        </HStack>

        <Box overflowX="auto" borderWidth="1px" borderRadius="lg" bg="white">
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>Email Address</Th>
                <Th>Hosting</Th>
                <Th>Quota</Th>
                <Th>Auto Renew</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {emails.map((email) => (
                <Tr key={email.id} _hover={{ bg: 'gray.50' }}>
                  <Td fontWeight="medium">
                    <HStack spacing={2}>
                      <EmailIcon color="gray.400" />
                      <Text>{email.email}</Text>
                    </HStack>
                  </Td>
                  <Td>{email.hostingProvider || 'N/A'}</Td>
                  <Td>{email.quota ? `${email.quota} MB` : 'N/A'}</Td>
                  <Td>
                    <Badge colorScheme={email.autoRenew ? 'green' : 'gray'}>
                      {email.autoRenew ? 'Yes' : 'No'}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(email.status)}>
                      {email.status}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton size="sm" icon={<EditIcon />} onClick={() => handleEdit(email)} aria-label="Edit email" />
                      <IconButton size="sm" icon={<DeleteIcon />} colorScheme="red" onClick={() => handleDelete(email.id)} aria-label="Delete email" />
                    </HStack>
                  </Td>
                </Tr>
              ))}
              {emails.length === 0 && (
                <Tr>
                  <Td colSpan={6} textAlign="center" py={10}>
                    <Text color="gray.500">No email accounts found</Text>
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
          <ModalHeader>{selectedEmail ? 'Edit Account' : 'Add New Account'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <EmailForm
              emailId={selectedEmail?.id}
              clientId={clientId}
              initialData={selectedEmail}
              onSuccess={handleFormSuccess}
              onCancel={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EmailList;