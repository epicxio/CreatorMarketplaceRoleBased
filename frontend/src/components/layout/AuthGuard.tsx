import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProtectedLayout from './ProtectedLayout';
import { Box, CircularProgress } from '@mui/material';

const AuthGuard: React.FC = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is Creator and not already on /get-to-know, redirect them
  if (user?.role?.name === 'Creator' && location.pathname !== '/get-to-know') {
    return <Navigate to="/get-to-know" replace />;
  }

  return <ProtectedLayout />;
};

export default AuthGuard; 