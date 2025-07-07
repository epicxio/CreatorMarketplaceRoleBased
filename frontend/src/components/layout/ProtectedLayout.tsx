import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, styled } from '@mui/material';
import { Security } from '@mui/icons-material';
import Sidebar, { MenuItem } from './Sidebar';
import TopSubMenu from './TopSubMenu';
import { useTheme } from '../../contexts/ThemeContext';
import { menuHierarchy } from '../../config/navigation';
import { permissionResources } from '../../config/permissions';

const DRAWER_WIDTH = 64;

const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `${DRAWER_WIDTH}px`,
}));

const ProtectedLayout: React.FC = () => {
  const { toggleTheme } = useTheme();
  const [activeMenu, setActiveMenu] = useState<MenuItem | null>(null);
  const location = useLocation();

  useEffect(() => {
    const parentMenu = menuHierarchy.find(item =>
      item.children?.some(child => location.pathname.startsWith(child.path))
    );

    if (parentMenu) {
      const resource = permissionResources.find(p => p.name === parentMenu.resource);
      const Icon = resource ? resource.IconComponent : Security;
      
      const childrenWithIcons = parentMenu.children?.map(child => {
        const childResource = permissionResources.find(p => p.name === child.resource);
        const ChildIcon = childResource ? childResource.IconComponent : Icon;
        return { ...child, title: child.title, icon: <ChildIcon /> };
      });
      
      setActiveMenu({
        ...parentMenu,
        title: resource?.name || parentMenu.resource,
        icon: <Icon />,
        children: childrenWithIcons,
      });
    } else {
      setActiveMenu(null);
    }
  }, [location]);

  const handleMenuSelect = (menu: MenuItem) => {
    setActiveMenu(menu);
  };

  return (
    <Box sx={{ display: 'flex' }}>
        <Sidebar onThemeToggle={toggleTheme} onMenuSelect={handleMenuSelect} />
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100vh' }}>
          <TopSubMenu activeMenu={activeMenu} />
        <Main sx={{ flexGrow: 1, overflow: 'auto' }}>
            <Outlet />
        </Main>
      </Box>
    </Box>
  );
};

export default ProtectedLayout; 