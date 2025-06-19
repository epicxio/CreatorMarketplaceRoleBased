import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  styled,
  Avatar,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Group as GroupIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  minHeight: '100vh',
  '& .MuiPaper-root': {
    width: '100%',
    maxWidth: '2000px',
    ml: 0,
    mr: 0.5,
    my: 0,
    p: { xs: 2, sm: 2.5 },
  },
}));

const RoleCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const PermissionChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.9)',
  },
}));

const PermissionToggle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  margin: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const PermissionLabel = styled(Typography)(({ theme }) => ({
  flex: 1,
  marginLeft: theme.spacing(1),
}));

const PermissionSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase': {
    '&.Mui-checked': {
      color: theme.palette.primary.main,
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
  '& .MuiSwitch-track': {
    backgroundColor: theme.palette.grey[400],
  },
}));

const UserTypeToggle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  margin: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const UserTypeLabel = styled(Typography)(({ theme }) => ({
  flex: 1,
  marginLeft: theme.spacing(1),
}));

const UserCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  margin: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const UserInfo = styled(Box)(({ theme }) => ({
  flex: 1,
  marginLeft: theme.spacing(1),
}));

interface User {
  id: string;
  name: string;
  type: 'employee' | 'teacher' | 'student' | 'parent' | 'superadmin' | 'admin' | 'creator' | 'accountmanager' | 'brand';
  email: string;
  department?: string;
  grade?: string;
  class?: string;
}

// Update mockUsers to include users for each new user type:
const mockUsers: User[] = [
  { id: 'SA001', name: 'Alice Root', type: 'superadmin', email: 'alice.root@platform.com' },
  { id: 'AD001', name: 'Bob Admin', type: 'admin', email: 'bob.admin@platform.com' },
  { id: 'CR001', name: 'Cathy Creator', type: 'creator', email: 'cathy.creator@platform.com' },
  { id: 'AM001', name: 'Andy Manager', type: 'accountmanager', email: 'andy.manager@platform.com' },
  { id: 'BR001', name: 'BrandX', type: 'brand', email: 'contact@brandx.com' },
  // ... (optionally keep a few legacy users for reference) ...
];

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  usersCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userTypes: string[];
  assignedUsers: string[];
  system?: boolean;
}

// Update mockRoles to:
const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Full platform access and system configuration',
    permissions: ['all'],
    usersCount: 1,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-03-15',
    userTypes: ['employee'],
    assignedUsers: ['EMP001'],
    system: true,
  },
  {
    id: '2',
    name: 'Admin',
    description: 'Manage users, roles, and platform settings',
    permissions: ['user:create', 'user:edit', 'user:delete', 'role:create', 'role:edit', 'role:delete'],
    usersCount: 2,
    isActive: true,
    createdAt: '2024-01-10',
    updatedAt: '2024-03-10',
    userTypes: ['employee'],
    assignedUsers: ['EMP002'],
    system: true,
  },
  {
    id: '3',
    name: 'Creator',
    description: 'Create and manage content, campaigns, and collaborations',
    permissions: ['content:read', 'content:write', 'content:delete', 'campaign:create', 'campaign:edit'],
    usersCount: 10,
    isActive: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-03-12',
    userTypes: ['student'],
    assignedUsers: ['STD001', 'STD002'],
    system: true,
  },
  {
    id: '4',
    name: 'Account Manager',
    description: 'Manage creators, brands, and campaigns',
    permissions: ['creator:manage', 'brand:manage', 'campaign:manage'],
    usersCount: 3,
    isActive: true,
    createdAt: '2024-01-20',
    updatedAt: '2024-03-14',
    userTypes: ['employee'],
    assignedUsers: ['EMP003'],
    system: true,
  },
  {
    id: '5',
    name: 'Brand',
    description: 'Manage brand profile, products, and collaborations',
    permissions: ['brand:profile', 'brand:product', 'brand:collab'],
    usersCount: 5,
    isActive: true,
    createdAt: '2024-01-25',
    updatedAt: '2024-03-13',
    userTypes: ['employee'],
    assignedUsers: [],
    system: true,
  },
  // ... dynamic roles can be added below ...
];

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenDialog = (role?: Role) => {
    if (role) {
      setSelectedRole(role);
    } else {
      setSelectedRole({
        id: '',
        name: '',
        description: '',
        permissions: [],
        usersCount: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userTypes: [],
        assignedUsers: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRole(null);
  };

  const handleSaveRole = () => {
    if (selectedRole) {
      if (selectedRole.id) {
        // Update existing role
        setRoles(roles.map(role => 
          role.id === selectedRole.id ? selectedRole : role
        ));
      } else {
        // Add new role
        const newRole = {
          ...selectedRole,
          id: (roles.length + 1).toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setRoles([...roles, newRole]);
      }
    }
    handleCloseDialog();
  };

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter(role => role.id !== roleId));
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <StyledPaper>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Role Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage user roles and permissions across the platform
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search Roles"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SecurityIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Create New Role
            </Button>
          </Grid>
        </Grid>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Role Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell>Users</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRoles
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        <SecurityIcon />
                      </Avatar>
                      <Typography variant="subtitle1">{role.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {role.permissions.map((permission, index) => (
                        <PermissionChip
                          key={index}
                          label={permission}
                          size="small"
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <GroupIcon sx={{ mr: 1, color: 'action.active' }} />
                      {role.usersCount}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={role.isActive ? <CheckCircleIcon /> : <CancelIcon />}
                      label={role.isActive ? 'Active' : 'Inactive'}
                      color={role.isActive ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => handleOpenDialog(role)}>
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Role">
                        <IconButton size="small" onClick={() => handleOpenDialog(role)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      {role.system ? (
                        <Tooltip title="System Role">
                          <IconButton size="small" disabled>
                            <SecurityIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Delete Role">
                          <IconButton size="small" onClick={() => handleDeleteRole(role.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRoles.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedRole?.id ? 'Edit Role' : 'Create New Role'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Role Name"
                  value={selectedRole?.name || ''}
                  onChange={(e) => setSelectedRole({ ...selectedRole!, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={selectedRole?.description || ''}
                  onChange={(e) => setSelectedRole({ ...selectedRole!, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={selectedRole?.isActive || false}
                      onChange={(e) => setSelectedRole({ ...selectedRole!, isActive: e.target.checked })}
                    />
                  }
                  label="Active"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Permissions
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 1,
                  maxHeight: '300px',
                  overflowY: 'auto',
                  p: 1,
                  backgroundColor: 'background.paper',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}>
                  {[
                    { label: 'Content Management', permissions: ['content:read', 'content:write', 'content:delete'] },
                    { label: 'Course Management', permissions: ['course:create', 'course:edit', 'course:view'] },
                    { label: 'Analytics Access', permissions: ['analytics:view', 'reports:generate'] },
                    { label: 'User Management', permissions: ['user:create', 'user:edit', 'user:delete'] },
                    { label: 'Role Management', permissions: ['role:create', 'role:edit', 'role:delete'] },
                  ].map((group) => (
                    <Box key={group.label} sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                        {group.label}
                      </Typography>
                      {group.permissions.map((permission) => (
                        <PermissionToggle key={permission}>
                          <PermissionLabel variant="body2">
                            {permission.split(':')[1].charAt(0).toUpperCase() + permission.split(':')[1].slice(1)}
                          </PermissionLabel>
                          <PermissionSwitch
                            size="small"
                            checked={selectedRole?.permissions.includes(permission) || false}
                            onChange={() => {
                              const permissions = selectedRole?.permissions || [];
                              const newPermissions = permissions.includes(permission)
                                ? permissions.filter(p => p !== permission)
                                : [...permissions, permission];
                              setSelectedRole({ ...selectedRole!, permissions: newPermissions });
                            }}
                          />
                        </PermissionToggle>
                      ))}
                    </Box>
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  User Types
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 1,
                  p: 1,
                  backgroundColor: 'background.paper',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}>
                  {[
                    { type: 'superadmin', label: 'Super Admin', icon: <SecurityIcon /> },
                    { type: 'admin', label: 'Admin', icon: <SecurityIcon /> },
                    { type: 'creator', label: 'Creator', icon: <PersonIcon /> },
                    { type: 'accountmanager', label: 'Account Manager', icon: <GroupIcon /> },
                    { type: 'brand', label: 'Brand', icon: <WorkIcon /> },
                  ].map((userType) => (
                    <UserTypeToggle key={userType.type}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 24, height: 24 }}>
                        {userType.icon}
                      </Avatar>
                      <UserTypeLabel variant="body2">
                        {userType.label}
                      </UserTypeLabel>
                      <PermissionSwitch
                        size="small"
                        checked={selectedRole?.userTypes.includes(userType.type) || false}
                        onChange={() => {
                          const userTypes = selectedRole?.userTypes || [];
                          const newUserTypes = userTypes.includes(userType.type)
                            ? userTypes.filter(t => t !== userType.type)
                            : [...userTypes, userType.type];
                          setSelectedRole({ ...selectedRole!, userTypes: newUserTypes });
                        }}
                      />
                    </UserTypeToggle>
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Assign Users
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 2,
                  p: 1,
                  backgroundColor: 'background.paper',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}>
                  {selectedRole?.userTypes.map((userType) => {
                    const usersOfType = mockUsers.filter(user => user.type === userType);
                    return (
                      <Box key={userType} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                          {userType.charAt(0).toUpperCase() + userType.slice(1)}s
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: 1,
                          maxHeight: '200px',
                          overflowY: 'auto',
                          p: 1,
                          backgroundColor: 'background.default',
                          borderRadius: 1,
                        }}>
                          {usersOfType.map((user) => (
                            <UserCard key={user.id}>
                              <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                                {user.name.charAt(0)}
                              </Avatar>
                              <UserInfo>
                                <Typography variant="body2" fontWeight="medium">
                                  {user.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {user.email}
                                  {user.department && ` • ${user.department}`}
                                  {user.grade && ` • Grade ${user.grade}`}
                                  {user.class && ` • Class ${user.class}`}
                                </Typography>
                              </UserInfo>
                              <PermissionSwitch
                                size="small"
                                checked={selectedRole?.assignedUsers.includes(user.id) || false}
                                onChange={() => {
                                  const assignedUsers = selectedRole?.assignedUsers || [];
                                  const newAssignedUsers = assignedUsers.includes(user.id)
                                    ? assignedUsers.filter(id => id !== user.id)
                                    : [...assignedUsers, user.id];
                                  setSelectedRole({ ...selectedRole!, assignedUsers: newAssignedUsers });
                                }}
                              />
                            </UserCard>
                          ))}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveRole} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </StyledPaper>
  );
};

export default RoleManagement;