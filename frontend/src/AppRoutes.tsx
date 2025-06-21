import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './components/home/Home';
import Dashboard from './components/corporate/Dashboard';
import { EmployeeDashboard } from './components/dashboard/EmployeeDashboard';
import Profile from './components/profile/Profile';
import AuthGuard from './components/layout/AuthGuard';
import PublicRoute from './components/layout/PublicRoute';
import UserManagement from './components/corporate/UserManagement';
import InvitationManagement from './components/corporate/InvitationManagement';
import StudentCourseAllocation from './components/academic/StudentCourseAllocation';
import CorporateDashboard from './components/corporate/CorporateDashboard';
import RoleManagement from './components/roles/RoleManagement';
import UserTypeManagement from './components/roles/UserTypeManagement';
import Creator from './components/academic/Creator';
import AccountManagement from './components/academic/AccountManagement';
import BrandManagement from './components/brand/BrandManagement';
import CreatorProfile from './components/academic/CreatorProfile';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes are wrapped in PublicRoute to handle redirection */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Home />} />
      </Route>

      {/* Protected routes are wrapped in AuthGuard */}
      <Route element={<AuthGuard />}>
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
          <Route path="user-type" element={<UserTypeManagement />} />
          <Route index element={<Navigate to="roles" replace />} />
        </Route>

        {/* User Type Management Route */}
        <Route path="/user-types" element={<UserTypeManagement />} />

        {/* Creator Profile Route */}
        <Route path="/creators/:id" element={<CreatorProfile />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}; 