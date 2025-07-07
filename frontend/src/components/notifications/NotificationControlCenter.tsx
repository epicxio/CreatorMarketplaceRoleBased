import React, { useState, useEffect } from 'react';
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
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  styled,
  Avatar,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  NotificationsActive as PushIcon,
  Computer as InAppIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  Settings as SettingsIcon,
  History as HistoryIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
}));

const ChannelChip = styled(Chip)<{ active: boolean }>(({ theme, active }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: active ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.1)',
  color: active ? theme.palette.primary.contrastText : theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : 'rgba(255, 255, 255, 0.2)',
  },
}));

interface NotificationType {
  id: string;
  title: string;
  messageTemplate: string;
  roles: string[];
  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
    inApp: boolean;
  };
  isActive: boolean;
  priority: 'low' | 'medium' | 'high';
  schedule?: {
    enabled: boolean;
    time?: string;
    days?: string[];
  };
}

interface NotificationLog {
  id: string;
  notificationType: string;
  userId: string;
  userName: string;
  role: string;
  channel: string;
  status: 'success' | 'failed' | 'pending';
  sentAt: Date;
  deliveredAt?: Date;
  errorMessage?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`notification-tabpanel-${index}`}
      aria-labelledby={`notification-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const channelIcons = {
  email: <EmailIcon />,
  sms: <SmsIcon />,
  push: <PushIcon />,
  inApp: <InAppIcon />,
  whatsapp: <WhatsAppIcon style={{ color: '#25D366' }} />,
};

const channelColors = {
  email: '#1976d2',
  sms: '#2e7d32',
  push: '#ed6c02',
  inApp: '#9c27b0',
  whatsapp: '#25D366',
};

const roles = ['Creator', 'Brand', 'Account Manager', 'Employee', 'Admin'];
const channels = ['email', 'whatsapp', 'sms', 'push', 'inApp'];

const NotificationControlCenter: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [notificationTypes, setNotificationTypes] = useState<NotificationType[]>([
    {
      id: '1',
      title: 'Course Assigned',
      messageTemplate: 'Hello {{userName}}, you have been assigned to {{courseTitle}}. Please complete it by {{dueDate}}.',
      roles: ['Creator', 'Employee'],
      channels: { email: true, sms: false, push: true, inApp: true },
      isActive: true,
      priority: 'medium',
    },
    {
      id: '2',
      title: 'KYC Approved',
      messageTemplate: 'Congratulations {{userName}}! Your KYC verification has been approved. You can now access all features.',
      roles: ['Creator', 'Brand', 'Admin'],
      channels: { email: true, sms: false, push: true, inApp: false },
      isActive: true,
      priority: 'high',
    },
    {
      id: '3',
      title: 'Campaign Invite',
      messageTemplate: 'Hi {{userName}}, you have received a new campaign invitation from {{brandName}}. Click here to view details.',
      roles: ['Creator', 'Brand', 'Account Manager'],
      channels: { email: true, sms: true, push: false, inApp: true },
      isActive: true,
      priority: 'medium',
    },
  ]);

  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>([
    {
      id: '1',
      notificationType: 'Course Assigned',
      userId: 'user123',
      userName: 'John Doe',
      role: 'Creator',
      channel: 'email',
      status: 'success',
      sentAt: new Date('2024-12-15T10:30:00'),
      deliveredAt: new Date('2024-12-15T10:30:05'),
    },
    {
      id: '2',
      notificationType: 'KYC Approved',
      userId: 'user456',
      userName: 'Jane Smith',
      role: 'Brand',
      channel: 'push',
      status: 'success',
      sentAt: new Date('2024-12-15T09:15:00'),
      deliveredAt: new Date('2024-12-15T09:15:02'),
    },
    {
      id: '3',
      notificationType: 'Campaign Invite',
      userId: 'user789',
      userName: 'Bob Johnson',
      role: 'Creator',
      channel: 'sms',
      status: 'failed',
      sentAt: new Date('2024-12-15T08:45:00'),
      errorMessage: 'Invalid phone number',
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingNotification, setEditingNotification] = useState<NotificationType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleChannelToggle = (notificationId: string, channel: string) => {
    setNotificationTypes(prev => prev.map(notification => {
      if (notification.id === notificationId) {
        return {
          ...notification,
          channels: {
            ...notification.channels,
            [channel]: !notification.channels[channel as keyof typeof notification.channels],
          },
        };
      }
      return notification;
    }));
  };

  const handleRoleToggle = (notificationId: string, role: string) => {
    setNotificationTypes(prev => prev.map(notification => {
      if (notification.id === notificationId) {
        const newRoles = notification.roles.includes(role)
          ? notification.roles.filter(r => r !== role)
          : [...notification.roles, role];
        return { ...notification, roles: newRoles };
      }
      return notification;
    }));
  };

  const handleActiveToggle = (notificationId: string) => {
    setNotificationTypes(prev => prev.map(notification => {
      if (notification.id === notificationId) {
        return { ...notification, isActive: !notification.isActive };
      }
      return notification;
    }));
  };

  const handleAddNotification = () => {
    setEditingNotification({
      id: Date.now().toString(),
      title: '',
      messageTemplate: '',
      roles: [],
      channels: { email: false, sms: false, push: false, inApp: false },
      isActive: true,
      priority: 'medium',
    });
    setOpenDialog(true);
  };

  const handleEditNotification = (notification: NotificationType) => {
    setEditingNotification(notification);
    setOpenDialog(true);
  };

  const handleSaveNotification = () => {
    if (editingNotification) {
      if (editingNotification.id && notificationTypes.find(n => n.id === editingNotification.id)) {
        // Update existing
        setNotificationTypes(prev => prev.map(n => 
          n.id === editingNotification.id ? editingNotification : n
        ));
      } else {
        // Add new
        setNotificationTypes(prev => [...prev, editingNotification]);
      }
    }
    setOpenDialog(false);
    setEditingNotification(null);
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotificationTypes(prev => prev.filter(n => n.id !== notificationId));
  };

  const filteredNotificationTypes = notificationTypes.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || notification.roles.includes(roleFilter);
    return matchesSearch && matchesRole;
  });

  const filteredLogs = notificationLogs.filter(log => {
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'failed':
        return <ErrorIcon color="error" />;
      case 'pending':
        return <ScheduleIcon color="warning" />;
      default:
        return <ViewIcon color="action" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'failed':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleExportLogs = () => {
    const csvContent = [
      ['ID', 'Notification Type', 'User', 'Role', 'Channel', 'Status', 'Sent At', 'Delivered At', 'Error'],
      ...filteredLogs.map(log => [
        log.id,
        log.notificationType,
        log.userName,
        log.role,
        log.channel,
        log.status,
        log.sentAt.toLocaleString(),
        log.deliveredAt?.toLocaleString() || '',
        log.errorMessage || '',
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notification_logs.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <StyledPaper>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <NotificationsIcon />
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
              Notification Control Center
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage notification preferences and monitor delivery status
            </Typography>
          </Box>
        </Box>

        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Notification Types" icon={<SettingsIcon />} iconPosition="start" />
          <Tab label="Logs & Monitoring" icon={<HistoryIcon />} iconPosition="start" />
          <Tab label="Analytics" icon={<AnalyticsIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {/* Notification Types Management */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search notification types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Filter by Role</InputLabel>
              <Select
                value={roleFilter}
                label="Filter by Role"
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="all">All Roles</MenuItem>
                {roles.map(role => (
                  <MenuItem key={role} value={role}>{role}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNotification}
          >
            Add Notification Type
          </Button>
        </Box>

        <Grid container spacing={3}>
          {filteredNotificationTypes.map((notification) => (
            <Grid item xs={12} md={6} lg={4} key={notification.id}>
              <Card sx={{ height: '100%', position: 'relative' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {notification.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditNotification(notification)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteNotification(notification.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {notification.messageTemplate}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Roles:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {roles.map(role => (
                        <Chip
                          key={role}
                          label={role}
                          size="small"
                          variant={notification.roles.includes(role) ? 'filled' : 'outlined'}
                          color={notification.roles.includes(role) ? 'primary' : 'default'}
                          onClick={() => handleRoleToggle(notification.id, role)}
                          sx={{ cursor: 'pointer' }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Channels:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {channels.map(channel => (
                        <Tooltip key={channel} title={`Toggle ${channel} notifications`}>
                          <ChannelChip
                            icon={channelIcons[channel as keyof typeof channelIcons]}
                            label={channel}
                            active={notification.channels[channel as keyof typeof notification.channels]}
                            onClick={() => handleChannelToggle(notification.id, channel)}
                            sx={{ cursor: 'pointer' }}
                          />
                        </Tooltip>
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notification.isActive}
                          onChange={() => handleActiveToggle(notification.id)}
                          size="small"
                        />
                      }
                      label="Active"
                    />
                    <Chip
                      label={notification.priority}
                      size="small"
                      color={notification.priority === 'high' ? 'error' : notification.priority === 'medium' ? 'warning' : 'default'}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/* Logs & Monitoring */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={statusFilter}
                label="Filter by Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="success">Success</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportLogs}
          >
            Export to CSV
          </Button>
        </Box>

        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Notification Type</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Channel</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Sent At</TableCell>
                <TableCell>Delivered At</TableCell>
                <TableCell>Error</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.notificationType}</TableCell>
                    <TableCell>{log.userName}</TableCell>
                    <TableCell>{log.role}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {channelIcons[log.channel as keyof typeof channelIcons]}
                        {log.channel}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getStatusIcon(log.status)}
                        <Chip
                          label={log.status}
                          size="small"
                          color={getStatusColor(log.status) as any}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>{log.sentAt.toLocaleString()}</TableCell>
                    <TableCell>{log.deliveredAt?.toLocaleString() || '-'}</TableCell>
                    <TableCell>
                      {log.errorMessage && (
                        <Tooltip title={log.errorMessage}>
                          <Typography variant="body2" color="error" sx={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {log.errorMessage}
                          </Typography>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredLogs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {/* Analytics */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Delivery Success Rate
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CircularProgress
                    variant="determinate"
                    value={85}
                    size={60}
                    color="success"
                  />
                  <Box>
                    <Typography variant="h4">85%</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Success Rate
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Channel Performance
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {channels.map(channel => (
                    <Box key={channel} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {channelIcons[channel as keyof typeof channelIcons]}
                        <Typography variant="body2">{channel}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={Math.random() * 100}
                          sx={{ width: 100, height: 8, borderRadius: 4 }}
                        />
                        <Typography variant="body2">
                          {Math.floor(Math.random() * 100)}%
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Add/Edit Notification Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingNotification?.id && notificationTypes.find(n => n.id === editingNotification.id)
            ? 'Edit Notification Type'
            : 'Add Notification Type'
          }
        </DialogTitle>
        <DialogContent>
          {editingNotification && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notification Title"
                    value={editingNotification.title}
                    onChange={(e) => setEditingNotification({
                      ...editingNotification,
                      title: e.target.value
                    })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Message Template"
                    value={editingNotification.messageTemplate}
                    onChange={(e) => setEditingNotification({
                      ...editingNotification,
                      messageTemplate: e.target.value
                    })}
                    helperText="Use variables like {{userName}}, {{courseTitle}}, {{brandName}}"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Select Roles:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {roles.map(role => (
                      <Chip
                        key={role}
                        label={role}
                        variant={editingNotification.roles.includes(role) ? 'filled' : 'outlined'}
                        color={editingNotification.roles.includes(role) ? 'primary' : 'default'}
                        onClick={() => {
                          const newRoles = editingNotification.roles.includes(role)
                            ? editingNotification.roles.filter(r => r !== role)
                            : [...editingNotification.roles, role];
                          setEditingNotification({
                            ...editingNotification,
                            roles: newRoles
                          });
                        }}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Select Channels:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {channels.map(channel => (
                      <FormControlLabel
                        key={channel}
                        control={
                          <Switch
                            checked={editingNotification.channels[channel as keyof typeof editingNotification.channels]}
                            onChange={(e) => setEditingNotification({
                              ...editingNotification,
                              channels: {
                                ...editingNotification.channels,
                                [channel]: e.target.checked
                              }
                            })}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {channelIcons[channel as keyof typeof channelIcons]}
                            {channel}
                          </Box>
                        }
                      />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={editingNotification.priority}
                      label="Priority"
                      onChange={(e) => setEditingNotification({
                        ...editingNotification,
                        priority: e.target.value as 'low' | 'medium' | 'high'
                      })}
                    >
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editingNotification.isActive}
                        onChange={(e) => setEditingNotification({
                          ...editingNotification,
                          isActive: e.target.checked
                        })}
                      />
                    }
                    label="Active"
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveNotification} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </StyledPaper>
  );
};

export default NotificationControlCenter; 