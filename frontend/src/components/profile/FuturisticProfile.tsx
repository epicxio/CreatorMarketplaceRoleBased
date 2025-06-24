import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Grid,
  Button,
  Chip,
  IconButton,
  styled,
  TextField
} from '@mui/material';
import {
  Person,
  Email,
  Shield,
  CameraAlt,
  Save,
  Cancel,
  Edit as EditIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { AvatarSelectionModal } from '../common/AvatarSelectionModal';
import { CameraCaptureModal } from '../common/CameraCaptureModal';
import { AvatarChoiceModal } from '../common/AvatarChoiceModal';
import { User } from '../../services/userService';

const FuturisticBox = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  color: #fff;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(108, 99, 255, 0.15) 0%, rgba(108, 99, 255, 0) 70%);
    animation: rotate 15s linear infinite;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const ProfileHeader = styled(FuturisticBox)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 2rem;
`;

const ProfileAvatarContainer = styled(Box)`
  position: relative;
  margin-bottom: 1rem;

  &:hover .edit-icon {
    opacity: 1;
  }
`;

const ProfileAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
  border: 4px solid #6C63FF;
  box-shadow: 0 0 20px rgba(108, 99, 255, 0.5);
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const EditIconOverlay = styled(Box)`
  position: absolute;
  bottom: 0;
  right: 0;
  background: #6C63FF;
  border-radius: 50%;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;

  &.edit-icon {
    pointer-events: auto;
  }
`;

const InfoCard = styled(FuturisticBox)`
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const InfoIcon = styled(Box)`
  background: rgba(108, 99, 255, 0.2);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6C63FF;
`;

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6C63FF',
    },
    color: '#fff',
    background: 'rgba(0,0,0,0.2)',
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#6C63FF',
  }
});

interface FuturisticProfileProps {
  user: User | null;
  onUpdateUser: (data: Partial<User>) => Promise<void>;
}

const FuturisticProfile: React.FC<FuturisticProfileProps> = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [choiceModalOpen, setChoiceModalOpen] = useState(false);
  const [initialAvatarTab, setInitialAvatarTab] = useState(0);

  useEffect(() => {
    setEditedUser(user);
  }, [user]);

  const handleEditToggle = async () => {
    if (isEditing) {
      if(editedUser && user && onUpdateUser) {
        const updatedData: Partial<User> = {};
        if (editedUser.name !== user.name) {
          updatedData.name = editedUser.name;
        }
        if (editedUser.profileImage !== user.profileImage) {
          updatedData.profileImage = editedUser.profileImage;
        }

        if (Object.keys(updatedData).length > 0) {
          try {
            await onUpdateUser(updatedData);
          } catch (error) {
            console.error("Failed to update user:", error);
          }
        }
      }
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleAvatarSelect = (url: string) => {
    setEditedUser(prev => prev ? { ...prev, profileImage: url } : null);
  };

  const handlePhotoCapture = (imageSrc: string) => {
    setEditedUser(prev => prev ? { ...prev, profileImage: imageSrc } : null);
  };

  const handleChooseLibrary = () => {
    setChoiceModalOpen(false);
    setInitialAvatarTab(0);
    setAvatarModalOpen(true);
  };

  const handleTakePhoto = () => {
    setChoiceModalOpen(false);
    setCameraModalOpen(true);
  };

  const handleUpload = () => {
    setChoiceModalOpen(false);
    setInitialAvatarTab(4);
    setAvatarModalOpen(true);
  };

  if (!user) {
    return (
      <Box sx={{ p: 3, color: '#fff' }}>
        <Typography>Loading user profile...</Typography>
      </Box>
    );
  }

  const assignedScreens = user.assignedScreens || ['Dashboard'];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, margin: '0 auto', color: '#fff' }}>
      <ProfileHeader>
        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
          {isEditing ? (
            <>
              <IconButton onClick={handleEditToggle} sx={{ color: 'white' }}>
                <Save />
              </IconButton>
              <IconButton onClick={handleCancel} sx={{ color: 'rgba(255,255,255,0.7)' }}>
                <Cancel />
              </IconButton>
            </>
          ) : (
            <IconButton onClick={handleEditToggle} sx={{ color: 'white' }}>
              <EditIcon />
            </IconButton>
          )}
        </Box>
        <ProfileAvatarContainer onClick={() => isEditing && setChoiceModalOpen(true)}>
          <ProfileAvatar 
            alt={user.name} 
            src={editedUser?.profileImage || user.profileImage || undefined}
          />
          {isEditing && (
            <EditIconOverlay className="edit-icon">
              <CameraAlt sx={{ color: '#fff' }} />
            </EditIconOverlay>
          )}
        </ProfileAvatarContainer>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
          {isEditing ? (
            <StyledTextField 
              name="name"
              value={editedUser?.name || ''}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
            />
          ) : (
            user.name
          )}
        </Typography>
        <Chip 
          icon={<Shield />} 
          label={user.role?.name || 'No Role'} 
          variant="outlined" 
          sx={{
            color: '#fff',
            borderColor: '#6C63FF',
            background: 'rgba(108, 99, 255, 0.2)',
            fontWeight: 'bold'
          }}
        />
      </ProfileHeader>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <InfoCard>
              <InfoIcon>
                <Email fontSize="large"/>
              </InfoIcon>
              <Box>
                <Typography variant="h6" gutterBottom>Email Address</Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>{user.email}</Typography>
              </Box>
            </InfoCard>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <InfoCard>
              <InfoIcon>
                <Person fontSize="large"/>
              </InfoIcon>
              <Box>
                <Typography variant="h6" gutterBottom>Role</Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>{user.role?.name || 'N/A'}</Typography>
              </Box>
            </InfoCard>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={6}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <FuturisticBox>
              <Typography variant="h6" gutterBottom>Assigned Screens</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {assignedScreens.map((screen: string) => (
                  <Chip 
                    key={screen} 
                    label={screen}
                    sx={{ 
                      background: 'rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }} 
                  />
                ))}
              </Box>
            </FuturisticBox>
          </motion.div>
        </Grid>
        <Grid item xs={12}>
          <InfoCard>
            <InfoIcon><Person /></InfoIcon>
            <Box>
              <Typography variant="h6">User Type</Typography>
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                {user.userType?.name || 'N/A'}
              </Typography>
            </Box>
          </InfoCard>
        </Grid>
      </Grid>
      
      <AvatarSelectionModal 
        open={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        onSelectAvatar={handleAvatarSelect}
        initialTab={initialAvatarTab}
      />

      <CameraCaptureModal
        open={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        onCapture={handlePhotoCapture}
      />

      <AvatarChoiceModal
        open={choiceModalOpen}
        onClose={() => setChoiceModalOpen(false)}
        onChooseLibrary={handleChooseLibrary}
        onTakePhoto={handleTakePhoto}
        onUpload={handleUpload}
      />
    </Box>
  );
};

export default FuturisticProfile; 