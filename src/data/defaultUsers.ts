import { User } from '../types';

export const defaultUsers: User[] = [
  {
    id: 'user-leader-1',
    email: 'tam.elhashmy@gmail.com',
    name: 'Tamer',
    role: 'team_leader',
    phone: '+201202677818',
    department: 'Revenue Management',
    twoFactorEnabled: false,
    preferences: {
      theme: 'light',
      notifications: true,
      emailNotifications: true,
      smsNotifications: false,
      whatsappNotifications: true,
      language: 'en'
    },
    lastLogin: new Date(),
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'user-emp-1',
    email: 'Mazen@crownbs.com',
    name: 'Mazen Ali',
    role: 'employee',
    employeeId: 'emp-1',
    phone: '+201202677818',
    department: 'Revenue Analysis',
    twoFactorEnabled: false,
    preferences: {
      theme: 'light',
      notifications: true,
      emailNotifications: true,
      smsNotifications: true,
      whatsappNotifications: true,
      language: 'en'
    },
    lastLogin: new Date(),
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'user-emp-2',
    email: 'Monica@crownbs.com',
    name: 'Monica Ali',
    role: 'employee',
    employeeId: 'emp-2',
    phone: '+201202677818',
    department: 'Reservations',
    twoFactorEnabled: true,
    preferences: {
      theme: 'light',
      notifications: false,
      emailNotifications: false,
      smsNotifications: false,
      whatsappNotifications: false,
      language: 'en'
    },
    lastLogin: new Date(),
    createdAt: new Date('2024-02-01')
  },
  {
    id: 'user-emp-3',
    email: 'Mostafa@crownbs.com',
    name: 'Mostafa 3rif',
    role: 'employee',
    employeeId: 'emp-3',
    phone: '+201202677818',
    department: 'Payments',
    twoFactorEnabled: false,
    preferences: {
      theme: 'light',
      notifications: true,
      emailNotifications: true,
      smsNotifications: true,
      whatsappNotifications: true,
      language: 'en'
    },
    lastLogin: new Date(),
    createdAt: new Date('2024-02-15')
  },
  {
    id: 'user-emp-4',
    email: 'Khaled@crownbs.com',
    name: 'Khaled Zatot',
    role: 'employee',
    employeeId: 'emp-4',
    phone: '+201202677818',
    department: 'Occupancy Analysis',
    twoFactorEnabled: false,
    preferences: {
      theme: 'light',
      notifications: true,
      emailNotifications: true,
      smsNotifications: false,
      whatsappNotifications: false,
      language: 'en'
    },
    lastLogin: new Date(),
    createdAt: new Date('2024-03-01')
  },
  {
    id: 'user-emp-5',
    email: 'lisa@hospitality.com',
    name: 'Lisa Thompson',
    role: 'employee',
    employeeId: 'emp-5',
    phone: '+1-555-0106',
    department: 'Reconciliation',
    twoFactorEnabled: false,
    preferences: {
      theme: 'light',
      notifications: false,
      emailNotifications: false,
      smsNotifications: false,
      whatsappNotifications: false,
      language: 'en'
    },
    lastLogin: new Date(),
    createdAt: new Date('2024-03-15')
  }
];