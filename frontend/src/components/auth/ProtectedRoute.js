import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Center, Spinner } from '@chakra-ui/react';
import { authService } from '../../services/api';


const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          if (requireAdmin && !authService.isAdmin()) {
            setAuthenticated(false);
          } else {
            setAuthenticated(true);
          }
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [requireAdmin]);

  if (loading) {
    return (
      <Center minHeight="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
 