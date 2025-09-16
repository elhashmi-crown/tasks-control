import { Task } from '../types';

export const defaultTasks: Task[] = [
  {
    id: 'task-1',
    name: "Yesterday's Reservations Update",
    description: 'Update and verify all reservations from previous day',
    category: 'reservations',
    estimatedMinutes: 30,
    priority: 'high',
    isRecurring: true
  },
  {
    id: 'task-2',
    name: "Tomorrow's Bookings Preparation",
    description: 'Prepare and organize upcoming bookings for next day',
    category: 'reservations',
    estimatedMinutes: 45,
    priority: 'high',
    isRecurring: true
  },
  {
    id: 'task-3',
    name: 'Card Payments',
    description: 'Process and update all card payment transactions',
    category: 'payments',
    estimatedMinutes: 25,
    priority: 'medium',
    isRecurring: true
  },
  {
    id: 'task-4',
    name: 'Cash Payments',
    description: 'Record and verify all cash payment transactions',
    category: 'payments',
    estimatedMinutes: 20,
    priority: 'medium',
    isRecurring: true
  },
  {
    id: 'task-5',
    name: 'Revenue Reconciliation',
    description: 'Reconcile daily revenue with all payment methods',
    category: 'reconciliation',
    estimatedMinutes: 40,
    priority: 'urgent',
    isRecurring: true
  },
  {
    id: 'task-6',
    name: 'Check Cliq Messages',
    description: 'Review and respond to all Cliq system messages',
    category: 'admin',
    estimatedMinutes: 15,
    priority: 'medium',
    isRecurring: true
  },
  {
    id: 'task-7',
    name: 'Xero',
    description: 'Update financial records in Xero accounting system',
    category: 'reconciliation',
    estimatedMinutes: 35,
    priority: 'high',
    isRecurring: true
  },
  {
    id: 'task-8',
    name: 'Hotels Occupancy & Tracking',
    description: 'Update occupancy rates and tracking metrics',
    category: 'tracking',
    estimatedMinutes: 30,
    priority: 'high',
    isRecurring: true
  },
  {
    id: 'task-9',
    name: 'Pending Payments',
    description: 'Review and update all pending payment statuses',
    category: 'payments',
    estimatedMinutes: 25,
    priority: 'medium',
    isRecurring: true
  },
  {
    id: 'task-10',
    name: 'Green Gables Sheet',
    description: 'Update Green Gables property tracking sheet',
    category: 'tracking',
    estimatedMinutes: 20,
    priority: 'medium',
    isRecurring: true
  },
  {
    id: 'task-11',
    name: 'Pay out Booking',
    description: 'Process payout bookings and commissions',
    category: 'payments',
    estimatedMinutes: 30,
    priority: 'medium',
    isRecurring: true
  },
  {
    id: 'task-12',
    name: 'In&Out End of Day',
    description: 'Complete end of day In&Out reconciliation process',
    category: 'reconciliation',
    estimatedMinutes: 45,
    priority: 'urgent',
    isRecurring: true
  }
];