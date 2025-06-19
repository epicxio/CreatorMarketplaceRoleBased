import React, { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';
import { Navbar } from '../common/Navbar';
import Sidebar from './Sidebar';
import TopSubMenu from './TopSubMenu';
import { useTheme } from '../../contexts/ThemeContext';

const ProtectedLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { toggleTheme } = useTheme();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState<any>(null);

  const handleMenuSelect = (menu: any) => {
    setActiveMenu(menu);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar onThemeToggle={toggleTheme} onMenuSelect={handleMenuSelect} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            mt: '64px', // Space for navbar
            ml: '240px', // Space for sidebar
            width: 'calc(100% - 240px)', // Adjust width to account for sidebar
            maxWidth: '1400px', // Add max-width to limit the content width
            mx: 'auto', // Center the content
          }}
        >
          <TopSubMenu activeMenu={activeMenu} />
          <Box sx={{ p: 3 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProtectedLayout; 