import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Grid,
  GridItem,
  Textarea,
} from '@chakra-ui/react';
import { clientService } from '../../services/api';

const ClientForm = ({ clientId, initialData, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (clientId) {
        await clientService.updateClient(clientId, formData);
        toast({ title: 'Client updated successfully', status: 'success' });
      } else {
        await clientService.createClient(formData);
        toast({ title: 'Client created successfully', status: 'success' });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: 'Error saving client',
        description: error.message,
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4}>
        <Grid templateColumns="repeat(2, 1fr)" gap={4} w="100%">
          <GridItem colSpan={2}>
            <FormControl isRequired>
              <FormLabel>Client Name</FormLabel>
              <Input name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Company</FormLabel>
              <Input name="company" value={formData.company} onChange={handleChange} placeholder="Acme Inc." />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>Phone</FormLabel>
              <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 890" />
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl>
              <FormLabel>Address</FormLabel>
              <Textarea name="address" value={formData.address} onChange={handleChange} placeholder="123 Main St..." rows={2} />
            </FormControl>
          </GridItem>
        </Grid>
        <Box w="100%" display="flex" justifyContent="flex-end" gap={4} pt={4}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" colorScheme="blue" isLoading={loading}>
            {clientId ? 'Update' : 'Create'}
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default ClientForm;