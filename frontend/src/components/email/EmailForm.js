import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Snackbar
} from '@mui/material';
import emailService from '../../services/emailService';
import clientService from '../../services/clientService';
import websiteService from '../../services/websiteService';

const EmailForm = ({ open, onClose, email, onSave }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    type: 'webmail',
    status: 'active',
    clientId: '',
    websiteId: '',
    notes: ''
  });
  const [clients, setClients] = useState([]);
  const [websites, setWebsites] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (email) {
      setFormData(email);
    }
    loadClients();
  }, [email]);

  useEffect(() => {
    if (formData.clientId) {
      loadWebsites(formData.clientId);
    }
  }, [formData.clientId]);

  const loadClients = async () => {
    try {
      const data = await clientService.getAllClients();
      setClients(data);
    } catch (error) {
      setError('Error loading clients. Please try again.');
      console.error('Error loading clients:', error);
    }
  };

  const loadWebsites = async (clientId) => {
    try {
      const data = await websiteService.getWebsitesByClient(clientId);
      setWebsites(data);
    } catch (error) {
      setError('Error loading websites. Please try again.');
      console.error('Error loading websites:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (email) {
        await emailService.updateEmail(email.id, formData);
        setSuccess('Email account updated successfully');
      } else {
        await emailService.createEmail(formData);
        setSuccess('Email account created successfully');
      }
      onSave();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred. Please try again.');
      console.error('Error saving email:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{email ? 'Edit Email Account' : 'Add Email Account'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                error={!!error && error.includes('email')}
                helperText={error && error.includes('email') ? error : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required={!email}
                error={!!error && error.includes('password')}
                helperText={error && error.includes('password') ? error : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="Type"
                >
                  <MenuItem value="webmail">Webmail</MenuItem>
                  <MenuItem value="pop3">POP3</MenuItem>
                  <MenuItem value="imap">IMAP</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Client</InputLabel>
                <Select
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleChange}
                  label="Client"
                  required
                  error={!!error && error.includes('client')}
                >
                  {clients.map(client => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.name}
                    </MenuItem>
                  ))}
                </Select>
                {error && error.includes('client') && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {error}
                  </Alert>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Website</InputLabel>
                <Select
                  name="websiteId"
                  value={formData.websiteId}
                  onChange={handleChange}
                  label="Website"
                  required
                  error={!!error && error.includes('website')}
                >
                  {websites.map(website => (
                    <MenuItem key={website.id} value={website.id}>
                      {website.name}
                    </MenuItem>
                  ))}
                </Select>
                {error && error.includes('website') && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {error}
                  </Alert>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : (email ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </form>
      <Snackbar 
        open={!!success} 
        autoHideDuration={3000} 
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess('')} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default EmailForm; 