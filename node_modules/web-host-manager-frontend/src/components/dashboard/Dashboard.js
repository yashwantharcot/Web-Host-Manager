import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardBody,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
  SimpleGrid,
  Select,
  HStack,
  Button,
} from '@chakra-ui/react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { domainService } from '../../services/domainService';
import { clientService } from '../../services/clientService';
import { websiteService } from '../../services/websiteService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDomains: 0,
    activeDomains: 0,
    expiringDomains: 0,
    totalClients: 0,
    totalWebsites: 0,
  });
  const [timeRange, setTimeRange] = useState('30');
  const [loading, setLoading] = useState(true);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [domains, clients, websites] = await Promise.all([
        domainService.getAll(),
        clientService.getAll(),
        websiteService.getAll(),
      ]);

      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const expiringDomains = domains.filter(domain => {
        const expiryDate = new Date(domain.expiryDate);
        return expiryDate <= thirtyDaysFromNow && expiryDate > now;
      });

      setStats({
        totalDomains: domains.length,
        activeDomains: domains.filter(d => d.status === 'active').length,
        expiringDomains: expiringDomains.length,
        totalClients: clients.length,
        totalWebsites: websites.length,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const domainStatusData = {
    labels: ['Active', 'Expired', 'Pending', 'Suspended'],
    datasets: [
      {
        label: 'Domain Status Distribution',
        data: [stats.activeDomains, 0, 0, 0], // Replace with actual data
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <Box p={4}>
      <HStack mb={6} justify="space-between">
        <Heading size="lg">Dashboard</Heading>
        <Select
          width="200px"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </Select>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={6}>
        <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel>Total Domains</StatLabel>
              <StatNumber>{stats.totalDomains}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel>Active Domains</StatLabel>
              <StatNumber>{stats.activeDomains}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel>Expiring Domains</StatLabel>
              <StatNumber>{stats.expiringDomains}</StatNumber>
              <StatHelpText>
                <StatArrow type="decrease" />
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel>Total Clients</StatLabel>
              <StatNumber>{stats.totalClients}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel>Total Websites</StatLabel>
              <StatNumber>{stats.totalWebsites}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
        <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Heading size="md" mb={4}>Domain Status Distribution</Heading>
            <Box height="300px">
              <Bar data={domainStatusData} options={chartOptions} />
            </Box>
          </CardBody>
        </Card>

        <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Heading size="md" mb={4}>Domain Expiration Trend</Heading>
            <Box height="300px">
              <Line data={domainStatusData} options={chartOptions} />
            </Box>
          </CardBody>
        </Card>
      </Grid>
    </Box>
  );
};

export default Dashboard; 