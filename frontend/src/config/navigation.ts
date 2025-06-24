export const menuHierarchy = [
    {
        resource: 'Dashboard',
        path: '/dashboard',
    },
    {
        resource: 'User',
        path: '/user-management',
        children: [
            { title: 'User List', path: '/user-management/list', resource: 'User' },
            { title: 'Invitations', path: '/user-management/invitations', resource: 'User' },
        ],
    },
    {
        resource: 'Creator',
        path: '/academic-management',
        children: [
            { title: 'Creator Management', path: '/academic-management/students', resource: 'Creator' },
            { title: 'Account Management', path: '/academic-management/account-managers', resource: 'User' },
            { title: 'Brand Management', path: '/corporate-management/brands', resource: 'Brand' },
        ],
    },
    {
        resource: 'Roles & Permissions',
        path: '/roles-permissions',
        children: [
            { title: 'Role Management', path: '/roles-permissions/roles', resource: 'Role' },
            { title: 'User Types', path: '/roles-permissions/user-type', resource: 'User Types' },
        ],
    },
    {
        resource: 'Content',
        path: '/content',
    },
    {
        resource: 'Campaign',
        path: '/campaigns',
    },
    {
        resource: 'Analytics',
        path: '/analytics',
    },
]; 