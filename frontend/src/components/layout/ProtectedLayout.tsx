import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { Navbar } from '../common/Navbar';
import Sidebar from './Sidebar';
import TopSubMenu from './TopSubMenu';
import { useTheme } from '../../contexts/ThemeContext';

const ProtectedLayout: React.FC = () => {
  const { toggleTheme } = useTheme();
  const [activeMenu, setActiveMenu] = useState<any>(null);

  const handleMenuSelect = (menu: any) => {
    setActiveMenu(menu);
  };

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