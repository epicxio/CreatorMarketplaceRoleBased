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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip,
  styled,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { UserRole } from '../../types/rbac';

const StyledPaper = styled(Paper)(({ theme }) => ({
  margin: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
}));

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  grade?: string;
  organization: string;
  status: 'active' | 'inactive';
}

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'john@school.com',
    role: 'school_admin',
    organization: 'ABC School',
    status: 'active',
  },
  {
    id: '2',
    name: 'Sarah Teacher',
    email: 'sarah@school.com',
    role: 'teacher',
    grade: '10th',
    organization: 'ABC School',
    status: 'active',
  },
  {
    id: '3',
    name: 'Mike Corp',
    email: 'mike@corp.com',
    role: 'corporate_admin',
    organization: 'XYZ Corp',
    status: 'active',
  },
  {
    id: '4',
    name: 'Lisa HRBP',
    email: 'lisa@corp.com',
    role: 'hrbp',
    department: 'HR',
    organization: 'XYZ Corp',
    status: 'active',
  },
];

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filter, setFilter] = useState('');

  const handleAddUser = () => {
    setSelectedUser(null);
    setOpenDialog(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleSendInvite = (email: string) => {
    console.log('Sending invite to:', email);
  };

  const handleSave = (userData: Partial<User>) => {
    if (selectedUser) {
      setUsers(users.map(user => 
        user.id === selectedUser.id ? { ...user, ...userData } : user
      ));
    } else {
      const newUser: User = {
        id: String(users.length + 1),
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || 'student',
        organization: userData.organization || '',
        status: 'active',
        ...(userData.department && { department: userData.department }),
        ...(userData.grade && { grade: userData.grade }),
      };
      setUsers([...users, newUser]);
    }
    setOpenDialog(false);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(filter.toLowerCase()) ||
    user.email.toLowerCase().includes(filter.toLowerCase()) ||
    user.role.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <StyledPaper elevation={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">User Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddUser}
        >
          Add User
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search users..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Organization</TableCell>
              <TableCell>Department/Grade</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={user.role.includes('admin') ? 'primary' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{user.organization}</TableCell>
                <TableCell>{user.department || user.grade || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={user.status}
                    color={user.status === 'active' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => handleEditUser(user)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => handleDeleteUser(user.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Send Invite">
                    <IconButton size="small" onClick={() => handleSendInvite(user.email)}>
                      <EmailIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <UserDialog
        open={openDialog}
        user={selectedUser}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
      />
    </StyledPaper>
  );
};

interface UserDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (userData: Partial<User>) => void;
}

const UserDialog: React.FC<UserDialogProps> = ({ open, user, onClose, onSave }) => {
  const [userData, setUserData] = useState<Partial<User>>(user || {});

  React.useEffect(() => {
    setUserData(user || {});
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(userData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{user ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Name"
              value={userData.name || ''}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              required
            />
            <TextField
              label="Email"
              type="email"
              value={userData.email || ''}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              required
            />
            <FormControl required>
              <InputLabel>Role</InputLabel>
              <Select
                value={userData.role || ''}
                label="Role"
                onChange={(e) => setUserData({ ...userData, role: e.target.value as UserRole })}
              >
                <MenuItem value="school_admin">School Admin</MenuItem>
                <MenuItem value="corporate_admin">Corporate Admin</MenuItem>
                <MenuItem value="department_head">Department Head</MenuItem>
                <MenuItem value="hrbp">HRBP</MenuItem>
                <MenuItem value="teacher">Teacher</MenuItem>
                <MenuItem value="parent">Parent</MenuItem>
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="employee">Employee</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Organization"
              value={userData.organization || ''}
              onChange={(e) => setUserData({ ...userData, organization: e.target.value })}
              required
            />
            {(userData.role === 'department_head' || userData.role === 'hrbp' || userData.role === 'employee') && (
              <TextField
                label="Department"
                value={userData.department || ''}
                onChange={(e) => setUserData({ ...userData, department: e.target.value })}
              />
            )}
            {(userData.role === 'teacher' || userData.role === 'student') && (
              <TextField
                label="Grade"
                value={userData.grade || ''}
                onChange={(e) => setUserData({ ...userData, grade: e.target.value })}
              />
            )}
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

export default UserList; 