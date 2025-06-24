import React from 'react';
import {
  PersonOutline,
  Security as SecurityIcon,
  ArticleOutlined,
  CampaignOutlined,
  StorefrontOutlined,
  StarOutline,
  AnalyticsOutlined,
  DashboardOutlined,
  LockOpenOutlined,
  HistoryOutlined,
  GroupWorkOutlined,
} from '@mui/icons-material';

export interface PermissionResource {
  name: string;
  IconComponent: React.ElementType;
  path?: string;
  children?: PermissionResource[];
}

export const permissionResources: PermissionResource[] = [
  {
    name: 'Dashboard',
    IconComponent: DashboardOutlined,
    path: '/dashboard',
  },
  {
    name: 'User',
    IconComponent: PersonOutline,
    path: '/user-management',
    children: [
      { 
        name: 'User List', 
        IconComponent: PersonOutline,
        path: '/user-management/list'
      },
      { 
        name: 'Invitation', 
        IconComponent: PersonOutline,
        path: '/user-management/invitations'
      },
    ],
  },
  {
    name: 'Creator',
    IconComponent: StarOutline,
    path: '/academic-management',
    children: [
      { 
        name: 'Creator Management', 
        IconComponent: StarOutline,
        path: '/academic-management/students'
      },
      { 
        name: 'Account Management', 
        IconComponent: GroupWorkOutlined,
        path: '/academic-management/account-managers'
      },
      { 
        name: 'Brand Management', 
        IconComponent: StorefrontOutlined,
        path: '/corporate-management/brands'
      },
    ],
  },
  {
    name: 'Roles & Permissions',
    IconComponent: SecurityIcon,
    path: '/roles-permissions',
    children: [
      { 
        name: 'Role Management', 
        IconComponent: SecurityIcon,
        path: '/roles-permissions/roles'
      },
      { 
        name: 'User Type', 
        IconComponent: GroupWorkOutlined,
        path: '/roles-permissions/user-type'
      },
    ],
  },
  {
    name: 'Content',
    IconComponent: ArticleOutlined,
    path: '/content',
  },
  {
    name: 'Campaign',
    IconComponent: CampaignOutlined,
    path: '/campaign',
  },
  {
    name: 'Analytics',
    IconComponent: AnalyticsOutlined,
    path: '/analytics',
  },
];

export const allResources = permissionResources.map(r => r.name);
export const permissionActions = ['View', 'Create', 'Edit', 'Delete'] as const;
export type PermissionAction = (typeof permissionActions)[number];