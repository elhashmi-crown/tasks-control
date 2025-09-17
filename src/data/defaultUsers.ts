import { User } from '../types';

export const defaultUsers: User[] = [
  {
    id: 'user-leader-1',
    email: 'tamer@hospitality.com',
    name: 'Tamer',
    role: 'team_leader',
    phone: '+1-555-0101',
    department: 'Revenue Management',
    twoFactorEnabled: false,
    preferences: {
      theme: 'light',
      notifications: true,
      emailNotifications: true,
      smsNotifications: false,
      language: 'en'
    },
    lastLogin: new Date(),
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'user-emp-1',
    email: 'sarah@hospitality.com',
    name: 'Sarah Johnson',
    role: 'employee',
    employeeId: 'emp-1',
    phone: '+1-555-0102',
    department: 'Revenue Analysis',
    twoFactorEnabled: false,
    preferences: {
      theme: 'light',
      notifications: true,
      emailNotifications: true,
      smsNotifications: true,
      language: 'en'
    },
    lastLogin: new Date(),
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'user-emp-2',
    email: 'michael@hospitality.com',
    name: 'Michael Chen',
    role: 'employee',
    employeeId: 'emp-2',
    phone: '+1-555-0103',
    department: 'Reservations',
    twoFactorEnabled: true,
    preferences: {
      theme: 'light',
      notifications: false,
      emailNotifications: false,
      smsNotifications: false,
      language: 'en'
    },
    lastLogin: new Date(),
    createdAt: new Date('2024-02-01')
  },
  {
    id: 'user-emp-3',
    email: 'emma@hospitality.com',
    name: 'Emma Williams',
    role: 'employee',
    employeeId: 'emp-3',
    phone: '+1-555-0104',
    department: 'Payments',
    twoFactorEnabled: false,
    preferences: {
      theme: 'light',
      notifications: true,
      emailNotifications: true,
      smsNotifications: true,
      language: 'en'
    },
    lastLogin: new Date(),
    createdAt: new Date('2024-02-15')
  },
  {
    id: 'user-emp-4',
    email: 'david@hospitality.com',
    name: 'David Rodriguez',
    role: 'employee',
    employeeId: 'emp-4',
    phone: '+1-555-0105',
    department: 'Occupancy Analysis',
    twoFactorEnabled: false,
    preferences: {
      theme: 'light',
      notifications: true,
      emailNotifications: true,
      smsNotifications: false,
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
      language: 'en'
    },
    lastLogin: new Date(),
    createdAt: new Date('2024-03-15')
  }
];