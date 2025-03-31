import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import {
  People as PeopleIcon,
  Language as LanguageIcon,
  Email as EmailIcon,
  Domain as DomainIcon
} from '@mui/icons-material';
import { clientService } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = React.useState({
    totalClients: 0,
    totalWebsites: 0,
    totalDomains: 0,
    totalEmailAccounts: 0
  });

  React.useEffect(() => {
    const loadStats = async () => {
      try {
        const clients = await clientService.getAllClients();
        const totalWebsites = clients.reduce((sum, client) => sum + (client.websites?.length || 0), 0);
        const totalDomains = clients.reduce((sum, client) => sum + (client.domains?.length || 0), 0);
        const totalEmailAccounts = clients.reduce((sum, client) => sum + (client.emailAccounts?.length || 0), 0);

        setStats({
          totalClients: clients.length,
          totalWebsites,
          totalDomains,
          totalEmailAccounts
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    loadStats();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ mr: 2, color }}>
            {icon}
          </Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => navigate('/clients')}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/clients')}
        >
          View All Clients
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Clients"
            value={stats.totalClients}
            icon={<PeopleIcon fontSize="large" />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Websites"
            value={stats.totalWebsites}
            icon={<LanguageIcon fontSize="large" />}
            color="secondary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Domains"
            value={stats.totalDomains}
            icon={<DomainIcon fontSize="large" />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Email Accounts"
            value={stats.totalEmailAccounts}
            icon={<EmailIcon fontSize="large" />}
            color="info.main"
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <Typography color="textSecondary">
          Activity tracking coming soon...
        </Typography>
      </Paper>
    </Box>
  );
};

export default Dashboard; 