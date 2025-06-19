import { MenuItem, UserRole } from '../types/rbac';
import {
  Dashboard,
  People,
  School,
  Business,
  Assignment,
  Assessment,
  Settings,
  Group,
  PersonAdd,
  MenuBook,
  Analytics,
  SupervisorAccount,
  FamilyRestroom,
  Class,
  ManageAccounts
} from '@mui/icons-material';

export const defaultMenuItems: MenuItem[] = [
  {
    id: 'dashboard_analytics',
    label: 'Dashboard & Analytics',
    icon: 'Dashboard',
    actions: {
      view: true,
      edit: false,
      create: false,
      delete: false,
      assign: false
    },
    children: [
      {
        id: 'main_dashboard',
        label: 'Main Dashboard',
        path: '/dashboard',
        icon: 'Dashboard',
        actions: {
          view: true,
          edit: false,
          create: false,
          delete: false,
          assign: false
        }
      },
      {
        id: 'analytics_dashboard',
        label: 'Analytics Dashboard',
        path: '/analytics',
        icon: 'Analytics',
        actions: {
          view: true,
          edit: false,
          create: false,
          delete: false,
          assign: false
        }
      }
    ]
  },
  {
    id: 'user_management',
    label: 'User Management',
    icon: 'People',
    actions: {
      view: true,
      edit: true,
      create: true,
      delete: true,
      assign: true
    },
    children: [
      {
        id: 'users_list',
        label: 'Users List',
        path: '/users',
        icon: 'Group',
        actions: {
          view: true,
          edit: true,
          create: true,
          delete: true,
          assign: true
        }
      },
      {
        id: 'roles',
        label: 'Roles & Permissions',
        path: '/roles',
        actions: {
          view: true,
          edit: true,
          create: true,
          delete: true,
          assign: true
        }
      },
      {
        id: 'permissions',
        label: 'Menu Permissions',
        path: '/permissions',
        icon: 'Security',
        actions: {
          view: true,
          edit: true,
          create: true,
          delete: true,
          assign: true
        }
      }
    ]
  },
  {
    id: 'department_management',
    label: 'Department Management',
    icon: 'Business',
    path: '/department-management',
    actions: {
      view: true,
      edit: true,
      create: true,
      delete: true,
      assign: true
    }
  }
];

// export const schoolAdminMenuItems: MenuItem[] = [
//   ...defaultMenuItems,
//   {
//     id: 'school_management',
//     label: 'School Management',
//     icon: 'School',
//     actions: {
//       view: true,
//       edit: true,
//       create: true,
//       delete: true,
//       assign: true
//     },
//     children: [
//       {
//         id: 'teacher_management',
//         label: 'Teacher Management',
//         path: '/teacher-management',
//         icon: 'SupervisorAccount',
//         actions: {
//           view: true,
//           edit: true,
//           create: true,
//           delete: true,
//           assign: true
//         }
//       },
//       {
//         id: 'parent_management',
//         label: 'Parent Management',
//         path: '/parent-management',
//         icon: 'FamilyRestroom',
//         actions: {
//           view: true,
//           edit: true,
//           create: true,
//           delete: true,
//           assign: true
//         }
//       },
//       {
//         id: 'student_management',
//         label: 'Student Management',
//         path: '/student-management',
//         icon: 'School',
//         actions: {
//           view: true,
//           edit: true,
//           create: true,
//           delete: true,
//           assign: true
//         }
//       }
//     ]
//   }
// ];

export const corporateAdminMenuItems: MenuItem[] = [
  ...defaultMenuItems,
  {
    id: 'employee_management',
    label: 'Employee Management',
    icon: 'Group',
    actions: {
      view: true,
      edit: true,
      create: true,
      delete: true,
      assign: true
    },
    children: [
      {
        id: 'employees',
        label: 'Employees',
        path: '/employees',
        actions: {
          view: true,
          edit: true,
          create: true,
          delete: true,
          assign: true
        }
      },
      {
        id: 'hrbp',
        label: 'HRBP Management',
        path: '/hrbp',
        actions: {
          view: true,
          edit: true,
          create: true,
          delete: true,
          assign: true
        }
      }
    ]
  },
  {
    id: 'course_management',
    label: 'Course Management',
    icon: 'MenuBook',
    actions: {
      view: true,
      edit: true,
      create: true,
      delete: true,
      assign: true
    },
    children: [
      {
        id: 'courses',
        label: 'Courses',
        path: '/courses',
        actions: {
          view: true,
          edit: true,
          create: true,
          delete: true,
          assign: true
        }
      },
      {
        id: 'department_courses',
        label: 'Department Courses',
        path: '/department-courses',
        actions: {
          view: true,
          edit: true,
          create: true,
          delete: true,
          assign: true
        }
      }
    ]
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: 'Analytics',
    path: '/analytics',
    actions: {
      view: true,
      edit: false,
      create: false,
      delete: false,
      assign: false
    }
  }
];

export const getMenuByRole = (role: UserRole): MenuItem[] => {
  switch (role) {
    // case 'school_admin':
    //   return schoolAdminMenuItems;
    case 'corporate_admin':
      return corporateAdminMenuItems;
    case 'department_head':
      return defaultMenuItems.filter(item => 
        ['dashboard', 'department_management'].includes(item.id)
      );
    case 'hrbp':
      return defaultMenuItems.filter(item =>
        ['dashboard', 'user_management'].includes(item.id)
      );
    // case 'teacher':
    //   return [
    //     {
    //       id: 'dashboard',
    //       label: 'Dashboard',
    //       icon: 'Dashboard',
    //       path: '/dashboard',
    //       actions: {
    //         view: true,
    //         edit: false,
    //         create: false,
    //         delete: false,
    //         assign: false
    //       }
    //     },
    //     {
    //       id: 'students',
    //       label: 'My Students',
    //       icon: 'School',
    //       path: '/my-students',
    //       actions: {
    //         view: true,
    //         edit: true,
    //         create: false,
    //         delete: false,
    //         assign: false
    //       }
    //     }
    //   ];
    // case 'parent':
    //   return [
    //     {
    //       id: 'dashboard',
    //       label: 'Dashboard',
    //       icon: 'Dashboard',
    //       path: '/dashboard',
    //       actions: {
    //         view: true,
    //         edit: false,
    //         create: false,
    //         delete: false,
    //         assign: false
    //       }
    //     },
    //     {
    //       id: 'children',
    //       label: 'My Children',
    //       icon: 'FamilyRestroom',
    //       path: '/my-children',
    //       actions: {
    //         view: true,
    //         edit: false,
    //         create: false,
    //         delete: false,
    //         assign: false
    //       }
    //     }
    //   ];
    default:
      return [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: 'Dashboard',
          path: '/dashboard',
          actions: {
            view: true,
            edit: false,
            create: false,
            delete: false,
            assign: false
          }
        }
      ];
  }
}; 