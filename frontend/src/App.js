import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ChakraProvider } from '@chakra-ui/react';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Layout from './components/layout/Layout';
import ClientList from './components/clients/ClientList';
import ClientForm from './components/clients/ClientForm';
import WebsiteList from './components/websites/WebsiteList';
import WebsiteForm from './components/websites/WebsiteForm';
import DomainList from './components/domains/DomainList';
import DomainForm from './components/domains/DomainForm';
import Dashboard from './components/dashboard/Dashboard';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ChakraProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="clients" element={<ClientList />} />
              <Route path="clients/new" element={<ClientForm />} />
              <Route path="clients/:id/edit" element={<ClientForm />} />
              <Route path="websites" element={<WebsiteList />} />
              <Route path="websites/new" element={<WebsiteForm />} />
              <Route path="websites/:id/edit" element={<WebsiteForm />} />
              <Route path="domains" element={<DomainList />} />
              <Route path="domains/new" element={<DomainForm />} />
              <Route path="domains/:id/edit" element={<DomainForm />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </ChakraProvider>
  );
}

export default App; 