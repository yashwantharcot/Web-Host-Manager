import React, { useState, useEffect } from 'react';
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
} from '@chakra-ui/react';
import { websiteService } from '../../services/api';

const WebsiteForm = ({ websiteId, clientId, initialData, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    url: '',
    loginUrl: '',
    username: '',
    password: '',
    hostingProvider: '',
    expiryDate: '',
    renewalCharge: '',
    status: 'Active',
    clientId: clientId || '',
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
      if (websiteId) {
        await websiteService.updateWebsite(websiteId, formData);
        toast({ title: 'Website updated successfully', status: 'success' });
      } else {
        await websiteService.createWebsite(formData);
        toast({ title: 'Website created successfully', status: 'success' });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: 'Error saving website',
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
              <FormLabel>Website Name</FormLabel>
              <Input name="name" value={formData.name} onChange={handleChange} placeholder="My Awesome Website" />
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl isRequired>
              <FormLabel>URL</FormLabel>
              <Input name="url" value={formData.url} onChange={handleChange} placeholder="https://example.com" />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Login URL</FormLabel>
              <Input name="loginUrl" value={formData.loginUrl} onChange={handleChange} placeholder="https://example.com/wp-admin" />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Hosting Provider</FormLabel>
              <Input name="hostingProvider" value={formData.hostingProvider} onChange={handleChange} placeholder="HostGator, Bluehost etc." />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input name="username" value={formData.username} onChange={handleChange} placeholder="admin" />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="******" />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Expiry Date</FormLabel>
              <Input type="date" name="expiryDate" value={formData.expiryDate ? formData.expiryDate.split('T')[0] : ''} onChange={handleChange} />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Renewal Charge ($)</FormLabel>
              <NumberInput min={0} value={formData.renewalCharge} onChange={(valueString) => setFormData(prev => ({ ...prev, renewalCharge: valueString }))}>
                <NumberInputField placeholder="0.00" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </GridItem>
        </Grid>
        <Box w="100%" display="flex" justifyContent="flex-end" gap={4} pt={4}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" colorScheme="blue" isLoading={loading}>
            {websiteId ? 'Update' : 'Create'}
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default WebsiteForm;