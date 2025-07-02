import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const PublicRoute: React.FC = () => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Debug: log the user object to check the role name
  console.log('User object:', user);

  if (isAuthenticated) {
    if (user?.role?.name === 'Creator') {
      return <Navigate to="/get-to-know" />;
    }
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default PublicRoute; 