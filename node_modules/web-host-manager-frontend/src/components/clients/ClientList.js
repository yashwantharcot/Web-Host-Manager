import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { clientService } from '../../services/api';
import ClientForm from './ClientForm';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await clientService.getAllClients();
      setClients(data);
    } catch (err) {
      setError('Failed to load clients. Please try again.');
      console.error('Error loading clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (clientData) => {
    try {
      await clientService.addClient(clientData);
      loadClients();
      setOpenForm(false);
      showSnackbar('Client added successfully');
    } catch (err) {
      showSnackbar(err.response?.data?.error || 'Failed to add client', 'error');
    }
  };

  const handleUpdateClient = async (clientData) => {
    try {
      await clientService.updateClient(selectedClient.id, clientData);
      loadClients();
      setOpenForm(false);
      setSelectedClient(null);
      showSnackbar('Client updated successfully');
    } catch (err) {
      showSnackbar(err.response?.data?.error || 'Failed to update client', 'error');
    }
  };

  const handleDeleteClient = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await clientService.deleteClient(id);
        loadClients();
        showSnackbar('Client deleted successfully');
      } catch (err) {
        showSnackbar(err.response?.data?.error || 'Failed to delete client', 'error');
      }
    }
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setOpenForm(true);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Clients</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedClient(null);
            setOpenForm(true);
          }}
        >
          Add Client
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.company}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => handleEditClient(client)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClient(client.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedClient(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <ClientForm
          onSubmit={selectedClient ? handleUpdateClient : handleAddClient}
          initialData={selectedClient}
        />
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClientList; 