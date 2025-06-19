import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Home } from './components/home/Home';
import { Login } from './components/auth/Login';
import Dashboard from './components/corporate/Dashboard';
import { EmployeeDashboard } from './components/dashboard/EmployeeDashboard';
import Profile from './components/profile/Profile';
import ProtectedLayout from './components/layout/ProtectedLayout';
import UserManagement from './components/corporate/UserManagement';
import InvitationManagement from './components/corporate/InvitationManagement';
import CourseAllocation from './components/corporate/CourseAllocation';
import StudentCourseAllocation from './components/academic/StudentCourseAllocation';
import CorporateDashboard from './components/corporate/CorporateDashboard';
import RoleManagement from './components/roles/RoleManagement';
import Creator from './components/academic/Creator';
import AccountManagement from './components/academic/AccountManagement';
import BrandManagement from './components/brand/BrandManagement';
import CreatorProfile from './components/academic/CreatorProfile';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={!isAuthenticated ? <Home /> : <Navigate to="/dashboard" />} />
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />

      {/* Protected routes */}
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/employee" element={<EmployeeDashboard />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* User Management Routes */}
        <Route path="/user-management/*">
          <Route path="list" element={<UserManagement />} />
          <Route path="invitations" element={<InvitationManagement />} />
          <Route path="invites" element={<InvitationManagement />} />
          <Route index element={<Navigate to="list" replace />} />
        </Route>
        
        {/* Brand Management Routes */}
        <Route path="/corporate-management/*">
          <Route index element={<CorporateDashboard />} />
          <Route path="dashboard" element={<CorporateDashboard />} />
          <Route path="brands" element={<BrandManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="users/list" element={<UserManagement />} />
        </Route>
        
        {/* Creator Management Routes */}
        <Route path="/academic-management/*">
          <Route path="students" element={<Creator />} />
          <Route path="account-managers" element={<AccountManagement />} />
          <Route path="course-allocation" element={<StudentCourseAllocation />} />
          <Route path="*" element={<Navigate to="students" replace />} />
        </Route>
        
        {/* Roles & Permissions Routes */}
        <Route path="/roles-permissions/*">
          <Route path="roles" element={<RoleManagement />} />
          <Route index element={<Navigate to="roles" replace />} />
        </Route>

        {/* Creator Profile Route */}
        <Route path="/creators/:id" element={<CreatorProfile />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
