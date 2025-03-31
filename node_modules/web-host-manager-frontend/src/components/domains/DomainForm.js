import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Switch,
  Textarea,
  VStack,
  useToast,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import domainService from '../../services/domainService';
import clientService from '../../services/clientService';
import websiteService from '../../services/websiteService';

const DomainForm = ({ domainId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    registrar: '',
    registrationDate: '',
    expiryDate: '',
    autoRenew: false,
    renewalCharge: '',
    status: 'active',
    dnsRecords: '',
    notes: '',
    clientId: '',
    websiteId: '',
  });

  const [clients, setClients] = useState([]);
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch clients
        const clientsData = await clientService.getAllClients();
        setClients(clientsData);

        // If editing, fetch domain data
        if (domainId) {
          const domainData = await domainService.getDomainById(domainId);
          setFormData({
            ...domainData,
            registrationDate: domainData.registrationDate.split('T')[0],
            expiryDate: domainData.expiryDate.split('T')[0],
          });

          // Fetch websites for the selected client
          if (domainData.clientId) {
            const websitesData = await websiteService.getWebsitesByClient(domainData.clientId);
            setWebsites(websitesData);
          }
        }
      } catch (error) {
        toast({
          title: 'Error fetching data',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchData();
  }, [domainId, toast]);

  const handleClientChange = async (clientId) => {
    setFormData(prev => ({ ...prev, clientId, websiteId: '' }));
    try {
      const websitesData = await websiteService.getWebsitesByClient(clientId);
      setWebsites(websitesData);
    } catch (error) {
      toast({
        title: 'Error fetching websites',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (domainId) {
        await domainService.updateDomain(domainId, formData);
        toast({
          title: 'Domain updated successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        await domainService.createDomain(formData);
        toast({
          title: 'Domain created successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: 'Error saving domain',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={4}>
      <VStack spacing={4}>
        <Grid templateColumns="repeat(2, 1fr)" gap={4} w="100%">
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Domain Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="example.com"
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired>
              <FormLabel>Registrar</FormLabel>
              <Input
                name="registrar"
                value={formData.registrar}
                onChange={handleChange}
                placeholder="e.g., GoDaddy, Namecheap"
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired>
              <FormLabel>Registration Date</FormLabel>
              <Input
                type="date"
                name="registrationDate"
                value={formData.registrationDate}
                onChange={handleChange}
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired>
              <FormLabel>Expiry Date</FormLabel>
              <Input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel>Auto Renew</FormLabel>
              <Switch
                name="autoRenew"
                isChecked={formData.autoRenew}
                onChange={handleChange}
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel>Renewal Charge</FormLabel>
              <Input
                type="number"
                name="renewalCharge"
                value={formData.renewalCharge}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired>
              <FormLabel>Status</FormLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </Select>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired>
              <FormLabel>Client</FormLabel>
              <Select
                name="clientId"
                value={formData.clientId}
                onChange={(e) => handleClientChange(e.target.value)}
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel>Website</FormLabel>
              <Select
                name="websiteId"
                value={formData.websiteId}
                onChange={handleChange}
                isDisabled={!formData.clientId}
              >
                <option value="">Select a website</option>
                {websites.map((website) => (
                  <option key={website.id} value={website.id}>
                    {website.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </GridItem>
        </Grid>

        <FormControl>
          <FormLabel>DNS Records</FormLabel>
          <Textarea
            name="dnsRecords"
            value={formData.dnsRecords}
            onChange={handleChange}
            placeholder="Enter DNS records (one per line)"
            rows={4}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Notes</FormLabel>
          <Textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Enter any additional notes"
            rows={4}
          />
        </FormControl>

        <Box w="100%" display="flex" justifyContent="flex-end" gap={4}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={loading}
          >
            {domainId ? 'Update Domain' : 'Create Domain'}
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default DomainForm; 