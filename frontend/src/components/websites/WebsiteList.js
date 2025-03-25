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
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Launch as LaunchIcon
} from '@mui/icons-material';
import { websiteService } from '../../services/api';
import WebsiteForm from './WebsiteForm';

const WebsiteList = () => {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState(null);

  useEffect(() => {
    loadWebsites();
  }, []);

  const loadWebsites = async () => {
    try {
      const data = await websiteService.getAllWebsites();
      setWebsites(data);
    } catch (error) {
      console.error('Error loading websites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWebsite = async (websiteData) => {
    try {
      await websiteService.addWebsite(websiteData);
      loadWebsites();
      setOpenForm(false);
    } catch (error) {
      console.error('Error adding website:', error);
    }
  };

  const handleUpdateWebsite = async (websiteData) => {
    try {
      await websiteService.updateWebsite(selectedWebsite.id, websiteData);
      loadWebsites();
      setOpenForm(false);
      setSelectedWebsite(null);
    } catch (error) {
      console.error('Error updating website:', error);
    }
  };

  const handleDeleteWebsite = async (id) => {
    if (window.confirm('Are you sure you want to delete this website?')) {
      try {
        await websiteService.deleteWebsite(id);
        loadWebsites();
      } catch (error) {
        console.error('Error deleting website:', error);
      }
    }
  };

  const handleEditWebsite = (website) => {
    setSelectedWebsite(website);
    setOpenForm(true);
  };

  const handleOpenWebsite = (url) => {
    window.open(url, '_blank');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Websites</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedWebsite(null);
            setOpenForm(true);
          }}
        >
          Add Website
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Hosting Provider</TableCell>
              <TableCell>Expiry Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {websites.map((website) => (
              <TableRow key={website.id}>
                <TableCell>{website.name}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {website.url}
                    <Tooltip title="Open website">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenWebsite(website.url)}
                      >
                        <LaunchIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell>{website.clientName}</TableCell>
                <TableCell>{website.hostingProvider}</TableCell>
                <TableCell>{new Date(website.expiryDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip
                    label={website.status}
                    color={website.status === 'Active' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => handleEditWebsite(website)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteWebsite(website.id)}
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
          setSelectedWebsite(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <WebsiteForm
          onSubmit={selectedWebsite ? handleUpdateWebsite : handleAddWebsite}
          initialData={selectedWebsite}
        />
      </Dialog>
    </Box>
  );
};

export default WebsiteList; 