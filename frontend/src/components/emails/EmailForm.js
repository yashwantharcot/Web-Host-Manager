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
  Select,
  Switch,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { emailService } from '../../services/api';

const EmailForm = ({ emailId, clientId, initialData, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState(initialData || {
    email: '',
    password: '',
    hostingProvider: '',
    quota: '',
    status: 'active',
    autoRenew: false,
    renewalCharge: '',
    notes: '',
    clientId: clientId || '',
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        password: '', // Don't show password in edit mode
      });
    }
  }, [initialData]);

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
      if (emailId) {
        await emailService.updateEmailAccount(emailId, formData);
        toast({ title: 'Email account updated successfully', status: 'success' });
      } else {
        await emailService.createEmailAccount(formData);
        toast({ title: 'Email account created successfully', status: 'success' });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: 'Error saving email account',
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
              <FormLabel>Email Address</FormLabel>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="user@example.com"
              />
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl isRequired={!emailId}>
              <FormLabel>Password</FormLabel>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={emailId ? "Leave blank to keep current" : "******"}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Hosting Provider</FormLabel>
              <Input
                name="hostingProvider"
                value={formData.hostingProvider}
                onChange={handleChange}
                placeholder="Google, Outlook, Private etc."
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
                <option value="suspended">Suspended</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Quota (MB)</FormLabel>
              <NumberInput min={0} value={formData.quota} onChange={(val) => setFormData(prev => ({ ...prev, quota: val }))}>
                <NumberInputField name="quota" placeholder="1024" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>Renewal Charge ($)</FormLabel>
              <NumberInput min={0} value={formData.renewalCharge} onChange={(val) => setFormData(prev => ({ ...prev, renewalCharge: val }))}>
                <NumberInputField name="renewalCharge" placeholder="0.00" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Auto Renew</FormLabel>
              <Switch
                name="autoRenew"
                isChecked={formData.autoRenew}
                onChange={handleChange}
              />
            </FormControl>
          </GridItem>
        </Grid>
        <FormControl>
          <FormLabel>Notes</FormLabel>
          <Textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional details..."
            rows={3}
          />
        </FormControl>
        <Box w="100%" display="flex" justifyContent="flex-end" gap={4} pt={4}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" colorScheme="blue" isLoading={loading}>
            {emailId ? 'Update' : 'Create'}
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default EmailForm;