import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  VStack,
  Heading,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Divider,
  useToast,
  Spinner,
  Center,
  Card,
  CardHeader,
  CardBody,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { authService, settingsService } from '../../services/api';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      browser: true,
      renewalReminders: true,
      expiryWarnings: true
    },
    display: {
      darkMode: false,
      compactMode: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30
    }
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const loadSettingsAndUser = useCallback(async () => {
    try {
      setLoading(true);
      const [currentUser, currentSettings] = await Promise.all([
        authService.getCurrentUser(),
        settingsService.getSettings().catch(() => null) // Fallback if settings API not implemented
      ]);
      
      setUser(currentUser);
      if (currentSettings) {
        setSettings(currentSettings);
      }
    } catch (error) {
      console.error('Error loading settings/user:', error);
      toast({
        title: 'Error loading settings',
        description: error.message,
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadSettingsAndUser();
  }, [loadSettingsAndUser]);

  const handleToggleChange = (category, setting) => (e) => {
    const isChecked = e.target.checked;
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: isChecked
      }
    }));
  };

  const handleNumberChange = (category, setting) => (valueString) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: parseInt(valueString) || 0
      }
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await settingsService.updateSettings(settings);
      toast({
        title: 'Settings saved',
        status: 'success',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error saving settings',
        description: error.message,
        status: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Center minH="400px">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Settings</Heading>

        <Card variant="outline" bg="white">
          <CardHeader>
            <Heading size="md">User Profile</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl isReadOnly>
                <FormLabel>Name</FormLabel>
                <Input value={user?.name || ''} />
              </FormControl>
              <FormControl isReadOnly>
                <FormLabel>Email</FormLabel>
                <Input value={user?.email || ''} />
              </FormControl>
              <FormControl isReadOnly>
                <FormLabel>Username</FormLabel>
                <Input value={user?.username || ''} />
              </FormControl>
              <FormControl isReadOnly>
                <FormLabel>Role</FormLabel>
                <Input value={user?.role || ''} />
              </FormControl>
            </SimpleGrid>
          </CardBody>
        </Card>

        <Card variant="outline" bg="white">
          <CardHeader>
            <Heading size="md">Notifications</Heading>
          </CardHeader>
          <CardBody>
            <VStack align="stretch" spacing={4}>
              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <FormLabel mb="0">Email Notifications</FormLabel>
                <Switch isChecked={settings.notifications.email} onChange={handleToggleChange('notifications', 'email')} />
              </FormControl>
              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <FormLabel mb="0">Browser Notifications</FormLabel>
                <Switch isChecked={settings.notifications.browser} onChange={handleToggleChange('notifications', 'browser')} />
              </FormControl>
              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <FormLabel mb="0">Renewal Reminders</FormLabel>
                <Switch isChecked={settings.notifications.renewalReminders} onChange={handleToggleChange('notifications', 'renewalReminders')} />
              </FormControl>
              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <FormLabel mb="0">Expiry Warnings</FormLabel>
                <Switch isChecked={settings.notifications.expiryWarnings} onChange={handleToggleChange('notifications', 'expiryWarnings')} />
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        <Card variant="outline" bg="white">
          <CardHeader>
            <Heading size="md">Display & Security</Heading>
          </CardHeader>
          <CardBody>
            <VStack align="stretch" spacing={6}>
              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <FormLabel mb="0">Dark Mode</FormLabel>
                <Switch isChecked={settings.display.darkMode} onChange={handleToggleChange('display', 'darkMode')} />
              </FormControl>
              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <FormLabel mb="0">Compact Mode</FormLabel>
                <Switch isChecked={settings.display.compactMode} onChange={handleToggleChange('display', 'compactMode')} />
              </FormControl>
              <Divider />
              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <FormLabel mb="0">Two-Factor Authentication</FormLabel>
                <Switch isChecked={settings.security.twoFactorAuth} onChange={handleToggleChange('security', 'twoFactorAuth')} />
              </FormControl>
              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <FormLabel mb="0">Session Timeout (minutes)</FormLabel>
                <NumberInput 
                  maxW="100px" 
                  min={5} 
                  max={1440} 
                  value={settings.security.sessionTimeout} 
                  onChange={handleNumberChange('security', 'sessionTimeout')}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        <Box display="flex" justifyContent="flex-end">
          <Button colorScheme="blue" size="lg" isLoading={saving} onClick={handleSaveSettings}>
            Save All Settings
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default Settings;