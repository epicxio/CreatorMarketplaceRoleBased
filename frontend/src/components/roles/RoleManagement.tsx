import React, { useState, useEffect, useMemo } from 'react';
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
  Tooltip,
  styled,
  Avatar,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  Checkbox,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
  ExpandMore as ExpandMoreIcon,
  PersonOutline,
  ArticleOutlined,
  CampaignOutlined,
  StorefrontOutlined,
  StarOutline,
  AnalyticsOutlined,
  WorkOutline,
  ManageAccountsOutlined,
  AdminPanelSettingsOutlined,
  ShieldOutlined,
  VisibilityOutlined,
  AddCircleOutline,
  DeleteOutline,
  EditOutlined,
} from '@mui/icons-material';
import roleService, { Role, CreateRoleData, Permission } from '../../services/roleService';
import userService, { User } from '../../services/userService';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: theme.palette.text.primary,
}));

const userTypeIcons: { [key: string]: React.ReactElement } = {
    employee: <WorkOutline color="primary" />,
    creator: <StarOutline color="primary" />,
    brand: <StorefrontOutlined color="primary" />,
    accountmanager: <ManageAccountsOutlined color="primary" />,
    admin: <AdminPanelSettingsOutlined color="primary" />,
    superadmin: <ShieldOutlined color="primary" />,
};

const permissionIcons: { [key: string]: React.ReactElement } = {
    User: <PersonOutline />,
    Role: <SecurityIcon />,
    Content: <ArticleOutlined />,
    Campaign: <CampaignOutlined />,
    Brand: <StorefrontOutlined />,
    Creator: <StarOutline />,
    Analytics: <AnalyticsOutlined />,
    'Roles & Permissions': <SecurityIcon />,
    'User Types': <PersonOutline />,
    'Permission Management': <SecurityIcon />,
    'Access Control': <SecurityIcon />,
    'Audit Logs': <AnalyticsOutlined />,
};

const actionIcons: { [key: string]: React.ReactElement } = {
  Create: <AddCircleOutline color="success" />,
  View: <VisibilityOutlined color="info" />,
  Edit: <EditOutlined color="warning" />,
  Delete: <DeleteOutline color="error" />,
};

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
  const [availableUserTypes, setAvailableUserTypes] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [formData, setFormData] = useState<CreateRoleData>({
    name: '',
    description: '',
    permissions: [],
    userTypes: [],
    assignedUsers: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [rolesData, permissionsData, userTypesData, usersData] = await Promise.all([
        roleService.getRoles(),
        roleService.getPermissions(),
        roleService.getUserTypes(),
        userService.getUsers()
      ]);
      setRoles(rolesData);
      setAvailablePermissions(permissionsData);
      setAvailableUserTypes(userTypesData);
      setUsers(usersData);
    } catch (err) {
      setError('Failed to fetch required data. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const groupedPermissions = useMemo(() => {
    return availablePermissions.reduce((acc, permission) => {
      const resource = permission.resource || 'General';
      acc[resource] = acc[resource] || [];
      acc[resource].push(permission);
      return acc;
    }, {} as Record<string, Permission[]>);
  }, [availablePermissions]);

  const handleAddRole = () => {
    setSelectedRole(null);
    setFormData({
      name: '',
      description: '',
      permissions: [],
      userTypes: [],
      assignedUsers: []
    });
    setOpenDialog(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions ? role.permissions.map(p => p._id) : [],
      userTypes: role.userTypes,
      assignedUsers: role.assignedUsers,
    });
    setOpenDialog(true);
  };

  const handleDeleteRole = async (roleId: string) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await roleService.deleteRole(roleId);
        await fetchData();
      } catch (err) {
        setError('Failed to delete role. Please try again.');
        console.error('Error deleting role:', err);
      }
    }
  };

  const handlePermissionChange = (permissionId: string) => {
    setFormData(prev => {
      const newPermissions = prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId];
      return { ...prev, permissions: newPermissions };
    });
  };

  const handleUserTypeChange = (userType: string) => {
    const newUserTypes = formData.userTypes.includes(userType)
      ? formData.userTypes.filter(ut => ut !== userType)
      : [...formData.userTypes, userType];
    setFormData({ ...formData, userTypes: newUserTypes });
  };

  const handleAssignUserChange = (userId: string) => {
    const newAssignedUsers = formData.assignedUsers.includes(userId)
      ? formData.assignedUsers.filter(id => id !== userId)
      : [...formData.assignedUsers, userId];
    setFormData({ ...formData, assignedUsers: newAssignedUsers });
  };

  const handleSaveRole = async () => {
    try {
      if (selectedRole) {
        await roleService.updateRole(selectedRole._id, formData);
      } else {
        await roleService.createRole(formData);
      }
      setOpenDialog(false);
      await fetchData();
    } catch (err) {
      setError('Failed to save role. Please try again.');
      console.error('Error saving role:', err);
    }
  };
  
  const usersToDisplay = users.filter(user => user.userType && formData.userTypes.includes(user.userType.name));

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <StyledPaper>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Available Roles</Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddRole}
            >
              Add New Role
            </Button>
          </Grid>
        </Grid>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {roles.map((role) => (
          <Grid item xs={12} md={6} lg={4} key={role._id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <SecurityIcon />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" component="h2">
                      {role.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {role.description}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Permissions: {role.permissions?.length || 0}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    label={role.isActive ? 'Active' : 'Inactive'}
                    color={role.isActive ? 'success' : 'default'}
                    size="small"
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Edit Role">
                      <IconButton size="small" onClick={() => handleEditRole(role)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Role">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteRole(role._id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Role Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}><TextField fullWidth label="Role Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} multiline rows={3} required /></Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>Permissions</Typography>
              {Object.entries(groupedPermissions).sort(([a], [b]) => a.localeCompare(b)).map(([resource, perms]) => (
                <Accordion key={resource}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {permissionIcons[resource] || <SecurityIcon color="primary" />}
                      <Typography>{resource.charAt(0).toUpperCase() + resource.slice(1)}</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 1 }}>
                    <FormGroup>
                      {perms.map(permission => (
                        <FormControlLabel
                          key={permission._id}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            py: 0.5,
                            mx: 0,
                          }}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {actionIcons[permission.action] || <SecurityIcon fontSize="small" />}
                              <Typography sx={{ ml: 1.5 }}>{permission.action}</Typography>
                            </Box>
                          }
                          labelPlacement="start"
                          control={
                            <Switch
                              checked={formData.permissions.includes(permission._id)}
                              onChange={() => handlePermissionChange(permission._id)}
                            />
                          }
                        />
                      ))}
                    </FormGroup>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>User Types</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {availableUserTypes.map((userType) => (
                  <Paper
                    key={userType}
                    variant="outlined"
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 1.5,
                      borderRadius: '8px'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {userTypeIcons[userType.toLowerCase()] || <SecurityIcon color="primary" />}
                      <Typography>{userType.charAt(0).toUpperCase() + userType.slice(1)}</Typography>
                    </Box>
                    <Switch
                      checked={formData.userTypes.includes(userType)}
                      onChange={() => handleUserTypeChange(userType)}
                    />
                  </Paper>
                ))}
              </Box>
            </Grid>
            {formData.userTypes.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>Assign Users</Typography>
                <Box sx={{ maxHeight: 300, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 1, p: 0.5 }}>
                  {usersToDisplay.map(user => (
                    <Paper
                      key={user._id}
                      variant="outlined"
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1.5,
                        borderRadius: '8px'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {user.userType && userTypeIcons[user.userType.name.toLowerCase()] || <PersonOutline color="primary" />}
                        <Box>
                          <Typography>{user.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                        </Box>
                      </Box>
                      <Switch
                        checked={formData.assignedUsers.includes(user._id)}
                        onChange={() => handleAssignUserChange(user._id)}
                      />
                    </Paper>
                  ))}
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveRole} variant="contained">{selectedRole ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </StyledPaper>
  );
};

export default RoleManagement; 