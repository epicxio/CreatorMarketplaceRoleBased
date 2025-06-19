import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  styled,
  IconButton,
  Tooltip,
  Box,
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  Dashboard,
  People,
  School,
  Business,
  Assignment,
  Assessment,
  Settings,
  Group,
  PersonAdd,
  MenuBook,
  Analytics,
  SupervisorAccount,
  FamilyRestroom,
  Class,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { getMenuByRole } from '../../config/menuConfig';
import { MenuItem } from '../../types/rbac';

const StyledList = styled(List)(({ theme }) => ({
  width: '100%',
  maxWidth: 360,
  backgroundColor: 'transparent',
  padding: theme.spacing(1),
}));

const StyledListItem = styled(ListItem)<{ depth?: number }>(({ theme, depth = 0 }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(0.5),
  paddingLeft: theme.spacing(2 + depth * 2),
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateX(5px)',
  },
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: 40,
  color: theme.palette.primary.main,
}));

const iconMap: { [key: string]: React.ElementType } = {
  Dashboard,
  People,
  School,
  Business,
  Assignment,
  Assessment,
  Settings,
  Group,
  PersonAdd,
  MenuBook,
  Analytics,
  SupervisorAccount,
  FamilyRestroom,
  Class,
};

interface MenuItemProps {
  item: MenuItem;
  depth?: number;
  open?: boolean;
  onToggle?: () => void;
}

const MenuItemComponent: React.FC<MenuItemProps> = ({
  item,
  depth = 0,
  open,
  onToggle,
}) => {
  const navigate = useNavigate();
  const Icon = item.icon && iconMap[item.icon] ? iconMap[item.icon] : Dashboard;

  const handleClick = () => {
    if (item.children) {
      onToggle?.();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <>
      <StyledListItem
        depth={depth}
        onClick={handleClick}
        sx={{
          backgroundColor: open ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
          cursor: 'pointer',
        }}
      >
        <Tooltip title={item.label} placement="right">
          <StyledListItemIcon>
            <Icon />
          </StyledListItemIcon>
        </Tooltip>
        <ListItemText
          primary={item.label}
          sx={{
            '& .MuiTypography-root': {
              fontWeight: depth === 0 ? 500 : 400,
              fontSize: depth === 0 ? '0.95rem' : '0.9rem',
            },
          }}
        />
        {item.children && (open ? <ExpandLess /> : <ExpandMore />)}
      </StyledListItem>
      {item.children && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map((child) => (
              <MenuItemComponent
                key={child.id}
                item={child}
                depth={depth + 1}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

const RBACMenu: React.FC = () => {
  const { user } = useAuth();
  const [openMenus, setOpenMenus] = React.useState<{ [key: string]: boolean }>({});

  const menuItems = React.useMemo(() => {
    return user ? getMenuByRole(user.role) : [];
  }, [user]);

  const handleToggle = (itemId: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  return (
    <Box
      sx={{
        height: '100%',
        backgroundColor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
        },
      }}
    >
      <StyledList>
        {menuItems.map((item) => (
          <MenuItemComponent
            key={item.id}
            item={item}
            open={openMenus[item.id]}
            onToggle={() => handleToggle(item.id)}
          />
        ))}
      </StyledList>
    </Box>
  );
};

export default RBACMenu; 