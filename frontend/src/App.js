import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/dashboard/Dashboard';
import ClientList from './components/clients/ClientList';
import ClientDetails from './components/clients/ClientDetails';
import DomainList from './components/domains/DomainList';
import WebsiteList from './components/websites/WebsiteList';
import EmailList from './components/emails/EmailList';
import Settings from './components/settings/Settings';
import Navbar from './components/layout/Navbar';
import ResponsiveLayout from './components/layout/ResponsiveLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Box minH="100vh" bg="gray.50">
        <Navbar />
        <ResponsiveLayout>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/clients" element={<ProtectedRoute><ClientList /></ProtectedRoute>} />
            <Route path="/clients/:id" element={<ProtectedRoute><ClientDetails /></ProtectedRoute>} />
            <Route path="/domains" element={<ProtectedRoute><DomainList /></ProtectedRoute>} />
            <Route path="/websites" element={<ProtectedRoute><WebsiteList /></ProtectedRoute>} />
            <Route path="/emails" element={<ProtectedRoute><EmailList /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ResponsiveLayout>
      </Box>
    </Router>
  );
};

export default App;

