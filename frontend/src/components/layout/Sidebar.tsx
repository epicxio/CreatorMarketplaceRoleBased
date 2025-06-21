import React from 'react';
import {
  Drawer,
  List,
  ListItemIcon,
  ListItemButton,
  Tooltip,
  Box,
  useTheme,
  styled,
  Divider,
} from '@mui/material';
import {
  Dashboard,
  People,
  Business,
  MenuBook,
  Security,
  Brightness4,
  Brightness7,
  Store as StoreIcon,
  ManageAccounts,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { DRAWER_WIDTH } from '../../constants/layout';
import { useAuth } from '../../context/AuthContext';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  '& .MuiDrawer-paper': {
    width: DRAWER_WIDTH,
    backgroundColor: theme.palette.mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
    borderRight: `1px solid ${theme.palette.divider}`,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));

const StyledListItem = styled(ListItemButton)(({ theme }) => ({
  minHeight: 48,
  justifyContent: 'center',
  padding: theme.spacing(1),
  margin: theme.spacing(0.5, 0.5),
  borderRadius: theme.shape.borderRadius,
  '&.Mui-selected': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.05)',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.15)'
        : 'rgba(0, 0, 0, 0.08)',
    },
  },
  '& .MuiListItemIcon-root': {
    minWidth: 'auto',
    color: theme.palette.primary.main,
  },
}));

interface MenuItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  resource: string;
  children?: MenuItem[];
}

interface SidebarProps {
  onThemeToggle: () => void;
  onMenuSelect: (menu: MenuItem) => void;
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <Dashboard />,
    resource: 'Dashboard',
    children: [
      {
        title: 'Main Dashboard',
        path: '/dashboard',
        icon: <Dashboard />,
        resource: 'Dashboard',
      },
      {
        title: 'Analytics Dashboard',
        path: '/dashboard/analytics',
        icon: <Dashboard />,
        resource: 'Analytics',
      },
    ],
  },
  {
    title: 'User Management',
    path: '/user-management',
    icon: <People />,
    resource: 'User',
    children: [
      {
        title: 'User List',
        path: '/user-management/list',
        icon: <People />,
        resource: 'User',
      },
      {
        title: 'Invitations',
        path: '/user-management/invitations',
        icon: <People />,
        resource: 'User',
      },
    ],
  },
  // {
  //   title: 'Brand Management',
  //   path: '/corporate-management/brands',
  //   icon: <StoreIcon />,
  // },
  // {
  //   title: 'Corporate Management',
  //   path: '/corporate-management',
  //   icon: <Business />,
  //   children: [
  //     {
  //       title: 'Employee Management',
  //       path: '/corporate-management/employees',
  //       icon: <People />,
  //     },
  //     {
  //       title: 'Department Management',
  //       path: '/corporate-management/departments',
  //       icon: <Business />,
  //     },
  //     {
  //       title: 'Course Allocation',
  //       path: '/corporate-management/course-allocation',
  //       icon: <MenuBook />,
  //     },
  //   ],
  // },
  {
    title: 'Creator Management',
    path: '/academic-management',
    icon: <MenuBook />,
    resource: 'Creator',
    children: [
      {
        title: 'Creator Management',
        path: '/academic-management/students',
        icon: <People />,
        resource: 'Creator',
      },
      {
        title: 'Account Management',
        path: '/academic-management/account-managers',
        icon: <People />,
        resource: 'User',
      },
      {
        title: 'Brand Management',
        path: '/corporate-management/brands',
        icon: <StoreIcon />,
        resource: 'Brand',
      },
      {
        title: 'Student Course Allocation',
        path: '/academic-management/course-allocation',
        icon: <MenuBook />,
        resource: 'Creator',
      },
    ],
  },
  {
    title: 'Roles & Permissions',
    path: '/roles-permissions',
    icon: <Security />,
    resource: 'Role',
    children: [
      {
        title: 'Role Management',
        path: '/roles-permissions/roles',
        icon: <Security />,
        resource: 'Role',
      },
      {
        title: 'User Types',
        path: '/roles-permissions/user-type',
        icon: <ManageAccounts />,
        resource: 'User Types',
      },
      {
        title: 'Permission Management',
        path: '/roles-permissions/permissions',
        icon: <Security />,
        resource: 'Permission Management',
      },
      {
        title: 'Access Control',
        path: '/roles-permissions/access-control',
        icon: <Security />,
        resource: 'Access Control',
      },
      {
        title: 'Audit Logs',
        path: '/roles-permissions/audit-logs',
        icon: <Security />,
        resource: 'Audit Logs',
      },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ onThemeToggle, onMenuSelect }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  const accessibleMenuItems = menuItems.filter(item => hasPermission(item.resource, 'View'));

  const handleMenuClick = (item: MenuItem) => {
    if (item.children) {
      onMenuSelect(item);
    } else {
      navigate(item.path);
    }
  };

  const isSelected = (item: MenuItem) => {
    return location.pathname.startsWith(item.path);
  };

  return (
    <StyledDrawer variant="permanent">
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <List sx={{ flexGrow: 1, pt: '64px' }}>
          {accessibleMenuItems.map((item) => (
            <Tooltip key={item.title} title={item.title} placement="right">
              <StyledListItem
                onClick={() => handleMenuClick(item)}
                selected={isSelected(item)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
              </StyledListItem>
            </Tooltip>
          ))}
        </List>
        <Divider />
        <Box sx={{ p: 1 }}>
          <Tooltip title="Toggle theme" placement="right">
            <StyledListItem onClick={onThemeToggle}>
              <ListItemIcon>
                {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </ListItemIcon>
            </StyledListItem>
          </Tooltip>
        </Box>
      </Box>
    </StyledDrawer>
  );
};

export default Sidebar; 