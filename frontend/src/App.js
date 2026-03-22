import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import ClientList from './components/ClientList';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/layout/Navbar';
import ResponsiveLayout from './components/layout/ResponsiveLayout';

const App = () => {
  return (
    <Router>
      <Box minH="100vh" bg="gray.50">
        <Navbar />
        <ResponsiveLayout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/clients" element={<ClientList />} />
            <Route path="/" element={<Login />} />
          </Routes>
        </ResponsiveLayout>
      </Box>
    </Router>
  );
};

export default App;
