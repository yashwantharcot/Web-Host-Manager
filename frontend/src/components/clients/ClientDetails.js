import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Dialog,
  Paper,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { clientService } from '../../services/api';
import ClientForm from './ClientForm';
import WebsiteList from '../websites/WebsiteList';
import DomainList from '../domains/DomainList';
import EmailList from '../emails/EmailList';

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    loadClient();
  }, [id]);

  const loadClient = async () => {
    try {
      setLoading(true);
      const data = await clientService.getClient(id);
      setClient(data);
      setError(null);
    } catch (err) {
      setError('Failed to load client details');
      console.error('Error loading client:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClient = async (clientData) => {
    try {
      await clientService.updateClient(id, clientData);
      setOpenForm(false);
      loadClient();
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  const handleDeleteClient = async () => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await clientService.deleteClient(id);
        navigate('/clients');
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!client) {
    return (
      <Box p={3}>
        <Alert severity="warning">Client not found</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/clients')}
          >
            Back to Clients
          </Button>
          <Typography variant="h5" component="h1">
            Client Details
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenForm(true)}
            sx={{ mr: 1 }}
          >
            Edit Client
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteClient}
          >
            Delete Client
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Name
                </Typography>
                <Typography>{client.name}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Email
                </Typography>
                <Typography>{client.email}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Phone
                </Typography>
                <Typography>{client.phone}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Address
                </Typography>
                <Typography>{client.address}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Additional Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Notes
                </Typography>
                <Typography>{client.notes || 'No notes available'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Created At
                </Typography>
                <Typography>
                  {new Date(client.createdAt).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Last Updated
                </Typography>
                <Typography>
                  {new Date(client.updatedAt).toLocaleDateString()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <WebsiteList
            clientId={id}
            websites={client.websites || []}
            onUpdate={loadClient}
          />
        </Grid>

        <Grid item xs={12}>
          <DomainList
            clientId={id}
            domains={client.domains || []}
            onUpdate={loadClient}
          />
        </Grid>

        <Grid item xs={12}>
          <EmailList
            clientId={id}
            emailAccounts={client.emailAccounts || []}
            onUpdate={loadClient}
          />
        </Grid>
      </Grid>

      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
      >
        <ClientForm
          onSubmit={handleUpdateClient}
          initialData={client}
        />
      </Dialog>
    </Box>
  );
};

export default ClientDetails; 