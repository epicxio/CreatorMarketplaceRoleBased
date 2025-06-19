import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  styled,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
//import { defaultMenuItems, schoolAdminMenuItems, corporateAdminMenuItems } from '../../config/menuConfig';
import { defaultMenuItems, corporateAdminMenuItems } from '../../config/menuConfig';
import { MenuItem, UserRole, Permission } from '../../types/rbac';
import { useAuth } from '../../contexts/AuthContext';

const StyledPaper = styled(Paper)(({ theme }) => ({
  margin: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  padding: theme.spacing(1.5),
}));

const StyledHeaderCell = styled(StyledTableCell)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  fontWeight: 600,
}));

const ActionChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  '&.active': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

interface PermissionState {
  [menuId: string]: {
    [role in UserRole]?: {
      view: boolean;
      edit: boolean;
      create: boolean;
      delete: boolean;
      assign: boolean;
    };
  };
}

const PermissionManager: React.FC = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<PermissionState>({});
  const [selectedRole, setSelectedRole] = useState<UserRole>('school_admin');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isDirty, setIsDirty] = React.useState(false);

  useEffect(() => {
    // Initialize permissions from menu items
    const initialPermissions: PermissionState = {};
    const allMenuItems = [
      ...defaultMenuItems,
     // ...schoolAdminMenuItems,
      ...corporateAdminMenuItems,
    ];

    const processMenuItem = (item: MenuItem) => {
      if (item.actions) {
        initialPermissions[item.id] = {
          school_admin: {
            view: item.actions.view,
            edit: item.actions.edit,
            create: item.actions.create,
            delete: item.actions.delete,
            assign: item.actions.assign ?? false,
          },
          corporate_admin: {
            view: item.actions.view,
            edit: item.actions.edit,
            create: item.actions.create,
            delete: item.actions.delete,
            assign: item.actions.assign ?? false,
          },
          department_head: {
            view: false,
            edit: false,
            create: false,
            delete: false,
            assign: false,
          },
          hrbp: {
            view: false,
            edit: false,
            create: false,
            delete: false,
            assign: false,
          },
          teacher: {
            view: false,
            edit: false,
            create: false,
            delete: false,
            assign: false,
          },
          parent: {
            view: false,
            edit: false,
            create: false,
            delete: false,
            assign: false,
          },
          student: {
            view: false,
            edit: false,
            create: false,
            delete: false,
            assign: false,
          },
          employee: {
            view: false,
            edit: false,
            create: false,
            delete: false,
            assign: false,
          },
        };
      }

      if (item.children) {
        item.children.forEach(processMenuItem);
      }
    };

    allMenuItems.forEach(processMenuItem);
    setPermissions(initialPermissions);
  }, []);

  const handlePermissionChange = (
    menuId: string,
    role: UserRole,
    action: Permission,
    checked: boolean
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [menuId]: {
        ...prev[menuId],
        [role]: {
          ...prev[menuId]?.[role],
          [action]: checked,
        },
      },
    }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      // TODO: Implement API call to save permissions
      console.log('Saving permissions:', permissions);
      setIsDirty(false);
    } catch (error) {
      console.error('Error saving permissions:', error);
    }
  };

  const handleReset = () => {
    // TODO: Implement reset functionality
    setIsDirty(false);
  };

  const renderMenuItems = (items: MenuItem[], depth = 0) => {
    return items.map((item) => (
      <React.Fragment key={item.id}>
        <TableRow>
          <StyledTableCell sx={{ paddingLeft: `${depth * 2 + 1}rem` }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2">{item.label}</Typography>
              {item.children && (
                <Tooltip title="This menu has sub-items">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </StyledTableCell>
          {(['school_admin', 'corporate_admin', 'department_head', 'hrbp'] as UserRole[]).map((role) => (
            <StyledTableCell key={role}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(['view', 'edit', 'create', 'delete', 'assign'] as Permission[]).map((action) => (
                  <ActionChip
                    key={action}
                    label={action}
                    size="small"
                    onClick={() => handlePermissionChange(
                      item.id,
                      role,
                      action,
                      !permissions[item.id]?.[role]?.[action]
                    )}
                    className={permissions[item.id]?.[role]?.[action] ? 'active' : ''}
                  />
                ))}
              </Box>
            </StyledTableCell>
          ))}
        </TableRow>
        {item.children && renderMenuItems(item.children, depth + 1)}
      </React.Fragment>
    ));
  };

  return (
    <StyledPaper elevation={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Menu Permission Management</Typography>
        <Box>
          <Button
            startIcon={<RefreshIcon />}
            onClick={handleReset}
            sx={{ mr: 1 }}
            disabled={!isDirty}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={!isDirty}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledHeaderCell>Menu Item</StyledHeaderCell>
              <StyledHeaderCell>School Admin</StyledHeaderCell>
              <StyledHeaderCell>Corporate Admin</StyledHeaderCell>
              <StyledHeaderCell>Department Head</StyledHeaderCell>
              <StyledHeaderCell>HRBP</StyledHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderMenuItems(defaultMenuItems)}
          </TableBody>
        </Table>
      </TableContainer>
    </StyledPaper>
  );
};

export default PermissionManager; 