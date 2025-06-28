// permissions.js (backend version, no React or icons)

const permissionResources = [
  { name: 'Dashboard', path: '/dashboard' },
  {
    name: 'User',
    path: '/user-management',
    children: [
      { name: 'User List', path: '/user-management/list' },
      { name: 'Invitation', path: '/user-management/invitations' },
    ],
  },
  {
    name: 'Creator',
    path: '/academic-management',
    children: [
      { name: 'Creator Management', path: '/academic-management/students' },
      { name: 'Account Management', path: '/academic-management/account-managers' },
      { name: 'Brand Management', path: '/corporate-management/brands' },
    ],
  },
  {
    name: 'Roles & Permissions',
    path: '/roles-permissions',
    children: [
      { name: 'Role Management', path: '/roles-permissions/roles' },
      { name: 'User Type', path: '/roles-permissions/user-type' },
    ],
  },
  { name: 'Content', path: '/content' },
  { name: 'Campaign', path: '/campaign' },
  { name: 'Analytics', path: '/analytics' },
  { name: 'Brand', path: '/corporate-management/brands' },
  { name: 'Role', path: '/roles-permissions/roles' },
  { name: 'User Types', path: '/roles-permissions/user-type' },
  { name: 'KYC', path: '/kyc' },
];

const allResources = [
  // Parent resources
  ...permissionResources.map(r => r.name),
  // Child resources
  ...permissionResources
    .filter(r => r.children)
    .flatMap(r => r.children.map(child => child.name))
];

const permissionActions = ['View', 'Create', 'Edit', 'Delete'];

module.exports = {
  permissionResources,
  allResources,
  permissionActions
}; 