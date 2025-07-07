import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Box,
  Typography,
  useTheme,
  Dialog,
  DialogContent,
  styled
} from '@mui/material';
import {
  AccountCircle,
  Logout,
  Settings,
  Person,
  Close as CloseIcon,
  Notifications as NotificationsIcon,
  FiberManualRecord,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  InfoOutlined,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import FuturisticProfile from '../profile/FuturisticProfile';
import { User } from '../../services/userService';
import { motion, AnimatePresence } from 'framer-motion';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
}));

const ProfileMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { user: authUser, logout, updateUser } = useAuth();
  const user = authUser;
  const theme = useTheme();
  const [notifications] = useState([
    {
      id: 1,
      title: 'KYC Document Approved',
      message: 'Your PAN Card has been verified. You can now access all features.',
      time: '2 min ago',
      dateTime: '2025-06-28T20:26:00',
      icon: <CheckCircleIcon color="success" />,
      unread: true,
      type: 'success',
    },
    {
      id: 2,
      title: 'KYC Document Rejected',
      message: 'Aadhar Card was rejected. Please re-upload with correct details.',
      time: '1 hour ago',
      dateTime: '2025-06-28T19:20:00',
      icon: <CancelIcon color="error" />,
      unread: false,
      type: 'error',
    },
    {
      id: 3,
      title: 'Welcome to Creator Marketplace',
      message: 'Your account is set up. Start your KYC to unlock all features.',
      time: 'Yesterday',
      dateTime: '2025-06-27T10:00:00',
      icon: <InfoOutlined color="info" />,
      unread: false,
      type: 'info',
    },
  ]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const handleProfile = () => {
    handleClose();
    setProfileOpen(true);
  };

  const handleSettings = () => {
    handleClose();
    // Navigate to settings page
  };

  const handleProfileClose = () => {
    setProfileOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        sx={{ color: theme.palette.primary.main }}
      >
        {user?.profileImage ? (
          <Avatar 
            src={user.profileImage} 
            alt={user?.name || 'User'} 
            sx={{ width: 40, height: 40 }}
          />
        ) : (
          <AccountCircle sx={{ fontSize: 40 }} />
        )}
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{ ml: 1 }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {user?.name || 'User'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setNotificationsOpen(true); handleClose(); }}>
          <ListItemIcon>
            <NotificationsIcon color="primary" fontSize="small" />
          </ListItemIcon>
          <ListItemText>Notifications</ListItemText>
          {notifications.some(n => n.unread) && <FiberManualRecord color="warning" sx={{ fontSize: 14, ml: 1 }} />}
        </MenuItem>
        <MenuItem onClick={handleSettings}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      <StyledDialog
        open={profileOpen}
        onClose={handleProfileClose}
        fullWidth
        maxWidth="lg"
      >
        <DialogContent sx={{ position: 'relative', p: 0 }}>
          <IconButton 
            onClick={handleProfileClose} 
            sx={{ position: 'absolute', top: 8, right: 8, color: 'white', zIndex: 1 }}
          >
            <CloseIcon />
          </IconButton>
          {user ? (
            (typeof user.role === "object" ? user.role?.name : user.role) === "Creator"
              ? <FuturisticProfile user={user} onUpdateUser={updateUser} />
              : <FuturisticProfile user={user} onUpdateUser={updateUser} hideCategoriesSection={true} />
          ) : (
            <Box sx={{ p: 6, textAlign: 'center', color: '#fff', minWidth: 400 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Profile not available
              </Typography>
              <Typography variant="body1">
                This profile view is only available for valid accounts.
              </Typography>
            </Box>
          )}
        </DialogContent>
      </StyledDialog>

      <StyledDialog
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent sx={{
          p: 0,
          background: 'linear-gradient(135deg, #f8fafc 80%, #e9eefa 100%)',
          borderRadius: 5,
          minHeight: 420,
          maxHeight: 600,
          overflowY: 'auto',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
          backdropFilter: 'blur(16px)',
          position: 'relative',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, pb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#6C63FF', letterSpacing: 1 }}>
              Notifications
            </Typography>
            <IconButton onClick={() => setNotificationsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <Box sx={{ p: 3, pt: 2 }}>
            {notifications.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <NotificationsIcon sx={{ fontSize: 64, color: '#6C63FF', mb: 2, opacity: 0.3 }} />
                <Typography variant="h6" color="text.secondary">No notifications yet</Typography>
              </Box>
            ) : (
              notifications.map((n, idx) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.08, type: 'spring', stiffness: 120 }}
                  style={{ width: '100%' }}
                >
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    mb: 3,
                    p: 2.5,
                    borderRadius: 3,
                    background: n.unread ? 'linear-gradient(90deg, #fff 80%, #f3f6fa 100%)' : '#f8fafc',
                    boxShadow: n.unread ? '0 2px 12px 0 rgba(108,99,255,0.06)' : 'none',
                    borderLeft: n.unread ? '4px solid #6C63FF' : '4px solid #e9eefa',
                    transition: 'background 0.2s',
                  }}>
                    <Box sx={{ mt: 0.5 }}>{n.icon}</Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: n.unread ? '#6C63FF' : '#222' }}>{n.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{n.message}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {n.time} &nbsp;|&nbsp; {new Date(n.dateTime).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                    {n.unread && <FiberManualRecord color="warning" sx={{ fontSize: 16, mt: 0.5 }} />}
                  </Box>
                </motion.div>
              ))
            )}
          </Box>
        </DialogContent>
      </StyledDialog>
    </Box>
  );
};

export default ProfileMenu; 