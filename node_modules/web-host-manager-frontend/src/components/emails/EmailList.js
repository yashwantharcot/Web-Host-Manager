import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Email as EmailIcon } from '@mui/icons-material';
import { emailService } from '../../services/api';
import EmailForm from './EmailForm';

const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'suspended':
      return 'warning';
    case 'expired':
      return 'error';
    case 'cancelled':
      return 'default';
    default:
      return 'default';
  }
};

const EmailList = ({ clientId, emailAccounts, onUpdate }) => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const handleAddEmail = async (emailData) => {
    try {
      await emailService.addEmailAccount(clientId, emailData);
      setOpenForm(false);
      onUpdate();
    } catch (error) {
      console.error('Error adding email account:', error);
    }
  };

  const handleUpdateEmail = async (emailData) => {
    try {
      await emailService.updateEmailAccount(clientId, selectedEmail.id, emailData);
      setOpenForm(false);
      setSelectedEmail(null);
      onUpdate();
    } catch (error) {
      console.error('Error updating email account:', error);
    }
  };

  const handleDeleteEmail = async (emailId) => {
    if (window.confirm('Are you sure you want to delete this email account?')) {
      try {
        await emailService.deleteEmailAccount(clientId, emailId);
        onUpdate();
      } catch (error) {
        console.error('Error deleting email account:', error);
      }
    }
  };

  const handleEditClick = (email) => {
    setSelectedEmail(email);
    setOpenForm(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" component="h2">
          Email Accounts
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedEmail(null);
            setOpenForm(true);
          }}
        >
          Add Email Account
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email Address</TableCell>
              <TableCell>Hosting Provider</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Quota</TableCell>
              <TableCell>Auto Renew</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {emailAccounts.map((email) => (
              <TableRow key={email.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon fontSize="small" />
                    {email.email}
                  </Box>
                </TableCell>
                <TableCell>{email.hostingProvider}</TableCell>
                <TableCell>
                  <Chip
                    label={email.status}
                    color={getStatusColor(email.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{email.quota} MB</TableCell>
                <TableCell>
                  <Chip
                    label={email.autoRenew ? 'Yes' : 'No'}
                    color={email.autoRenew ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(email)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteEmail(email.id)}
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
          setSelectedEmail(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <EmailForm 
          onSubmit={selectedEmail ? handleUpdateEmail : handleAddEmail}
          initialData={selectedEmail}
        />
      </Dialog>
    </Box>
  );
};

export default EmailList; 