import React, { useState } from 'react';
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
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Tooltip,
  styled,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { UserRole } from '../../types/rbac';

const StyledPaper = styled(Paper)(({ theme }) => ({
  margin: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
}));

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  type: 'school' | 'corporate' | 'system';
  permissions: string[];
  isCustom: boolean;
}

// Mock permissions data
const mockPermissions: Permission[] = [
  {
    id: 'user_view',
    name: 'View Users',
    description: 'Can view user list and details',
    module: 'User Management',
  },
  {
    id: 'user_create',
    name: 'Create Users',
    description: 'Can create new users',
    module: 'User Management',
  },
  {
    id: 'user_edit',
    name: 'Edit Users',
    description: 'Can edit existing users',
    module: 'User Management',
  },
  {
    id: 'user_delete',
    name: 'Delete Users',
    description: 'Can delete users',
    module: 'User Management',
  },
  {
    id: 'course_view',
    name: 'View Courses',
    description: 'Can view course list and details',
    module: 'Course Management',
  },
  {
    id: 'course_create',
    name: 'Create Courses',
    description: 'Can create new courses',
    module: 'Course Management',
  },
  {
    id: 'course_assign',
    name: 'Assign Courses',
    description: 'Can assign courses to users',
    module: 'Course Management',
  },
  {
    id: 'analytics_view',
    name: 'View Analytics',
    description: 'Can view analytics dashboard',
    module: 'Analytics',
  },
];

// Mock roles data
const mockRoles: Role[] = [
  {
    id: '1',
    name: 'School Administrator',
    description: 'Full access to school management features',
    type: 'school',
    permissions: ['user_view', 'user_create', 'user_edit', 'user_delete', 'course_view', 'course_create', 'course_assign'],
    isCustom: false,
  },
  {
    id: '2',
    name: 'Corporate Administrator',
    description: 'Full access to brand management features',
    type: 'corporate',
    permissions: ['user_view', 'user_create', 'user_edit', 'user_delete', 'course_view', 'course_create', 'analytics_view'],
    isCustom: false,
  },
  {
    id: '3',
    name: 'Department Head',
    description: 'Access to department management',
    type: 'corporate',
    permissions: ['user_view', 'user_edit', 'course_view', 'course_assign'],
    isCustom: false,
  },
];

const RolesPermissions: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [permissions] = useState<Permission[]>(mockPermissions);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openPermissionDialog, setOpenPermissionDialog] = useState(false);

  const handleAddRole = () => {
    setSelectedRole(null);
    setOpenDialog(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setOpenDialog(true);
  };

  const handleDeleteRole = (roleId: string) => {
    if (!roles.find(r => r.id === roleId)?.isCustom) {
      alert('Cannot delete system-defined roles');
      return;
    }
    setRoles(roles.filter(role => role.id !== roleId));
  };

  const handleManagePermissions = (role: Role) => {
    setSelectedRole(role);
    setOpenPermissionDialog(true);
  };

  const handleSaveRole = (roleData: Partial<Role>) => {
    if (selectedRole) {
      setRoles(roles.map(role =>
        role.id === selectedRole.id ? { ...role, ...roleData } : role
      ));
    } else {
      const newRole: Role = {
        id: String(roles.length + 1),
        name: roleData.name || '',
        description: roleData.description || '',
        type: roleData.type || 'school',
        permissions: roleData.permissions || [],
        isCustom: true,
      };
      setRoles([...roles, newRole]);
    }
    setOpenDialog(false);
  };

  const handleSavePermissions = (permissions: string[]) => {
    if (selectedRole) {
      setRoles(roles.map(role =>
        role.id === selectedRole.id ? { ...role, permissions } : role
      ));
    }
    setOpenPermissionDialog(false);
  };

  return (
    <StyledPaper elevation={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Roles & Permissions</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddRole}
        >
          Create Custom Role
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        System-defined roles cannot be modified or deleted. You can create custom roles for specific needs.
      </Alert>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Role Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {role.name}
                    {!role.isCustom && (
                      <Chip
                        label="System"
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>
                  <Chip
                    label={role.type}
                    size="small"
                    color={role.type === 'school' ? 'info' : 'secondary'}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {role.permissions.slice(0, 3).map((permId) => (
                      <Chip
                        key={permId}
                        label={permissions.find(p => p.id === permId)?.name}
                        size="small"
                      />
                    ))}
                    {role.permissions.length > 3 && (
                      <Chip
                        label={`+${role.permissions.length - 3} more`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Tooltip title="Manage Permissions">
                    <IconButton
                      size="small"
                      onClick={() => handleManagePermissions(role)}
                    >
                      <SecurityIcon />
                    </IconButton>
                  </Tooltip>
                  {role.isCustom && (
                    <>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleEditRole(role)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteRole(role.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <RoleDialog
        open={openDialog}
        role={selectedRole}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveRole}
      />

      <PermissionDialog
        open={openPermissionDialog}
        role={selectedRole}
        permissions={permissions}
        onClose={() => setOpenPermissionDialog(false)}
        onSave={handleSavePermissions}
      />
    </StyledPaper>
  );
};

interface RoleDialogProps {
  open: boolean;
  role: Role | null;
  onClose: () => void;
  onSave: (roleData: Partial<Role>) => void;
}

const RoleDialog: React.FC<RoleDialogProps> = ({ open, role, onClose, onSave }) => {
  const [roleData, setRoleData] = useState<Partial<Role>>(role || {});

  React.useEffect(() => {
    setRoleData(role || {});
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(roleData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{role ? 'Edit Role' : 'Create Role'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Role Name"
              value={roleData.name || ''}
              onChange={(e) => setRoleData({ ...roleData, name: e.target.value })}
              required
            />
            <TextField
              label="Description"
              value={roleData.description || ''}
              onChange={(e) => setRoleData({ ...roleData, description: e.target.value })}
              multiline
              rows={2}
              required
            />
            <FormControlLabel
              control={
                <Switch
                  checked={roleData.type === 'corporate'}
                  onChange={(e) => setRoleData({
                    ...roleData,
                    type: e.target.checked ? 'corporate' : 'school'
                  })}
                />
              }
              label="Corporate Role"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

interface PermissionDialogProps {
  open: boolean;
  role: Role | null;
  permissions: Permission[];
  onClose: () => void;
  onSave: (permissions: string[]) => void;
}

const PermissionDialog: React.FC<PermissionDialogProps> = ({
  open,
  role,
  permissions,
  onClose,
  onSave,
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  React.useEffect(() => {
    if (role) {
      setSelectedPermissions(role.permissions);
    }
  }, [role]);

  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSave = () => {
    onSave(selectedPermissions);
  };

  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.module]) {
      acc[perm.module] = [];
    }
    acc[perm.module].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Manage Permissions - {role?.name}
        {!role?.isCustom && (
          <Typography variant="caption" color="error" display="block">
            Warning: Modifying system role permissions may affect system functionality
          </Typography>
        )}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {Object.entries(groupedPermissions).map(([module, perms]) => (
            <Box key={module} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>{module}</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {perms.map((perm) => (
                  <FormControlLabel
                    key={perm.id}
                    control={
                      <Switch
                        checked={selectedPermissions.includes(perm.id)}
                        onChange={() => handleTogglePermission(perm.id)}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2">{perm.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {perm.description}
                        </Typography>
                      </Box>
                    }
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      p: 1,
                      width: '100%',
                    }}
                  />
                ))}
              </Box>
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save Permissions</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RolesPermissions; 