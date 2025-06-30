export interface PermissionResource {
  name: string;
  path?: string;
  children?: PermissionResource[];
}

export const permissionResources: PermissionResource[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
  },
  {
    name: 'User',
    path: '/user-management',
    children: [
      { 
        name: 'User List', 
        path: '/user-management/list'
      },
      { 
        name: 'Invitation', 
        path: '/user-management/invitations'
      },
    ],
  },
  {
    name: 'Creator',
    path: '/academic-management',
    children: [
      { 
        name: 'Creator Management', 
        path: '/academic-management/students'
      },
      { 
        name: 'Account Management', 
        path: '/academic-management/account-managers'
      },
      { 
        name: 'Brand Management', 
        path: '/corporate-management/brands'
      },
    ],
  },
  {
    name: 'Roles & Permissions',
    path: '/roles-permissions',
    children: [
      { 
        name: 'Role Management', 
        path: '/roles-permissions/roles'
      },
      { 
        name: 'User Type', 
        path: '/roles-permissions/user-type'
      },
    ],
  },
  {
    name: 'Content',
    path: '/content',
  },
  {
    name: 'Campaign',
    path: '/campaign',
  },
  {
    name: 'Analytics',
    path: '/analytics',
  },
];

export const allResources = permissionResources.map(r => r.name);
export const permissionActions = ['View', 'Create', 'Edit', 'Delete'] as const;
export type PermissionAction = (typeof permissionActions)[number]; 