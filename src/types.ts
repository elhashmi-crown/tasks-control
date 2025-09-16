export interface Employee {
  id: string;
  name: string;
  role: string;
  isActive: boolean;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  category: 'reservations' | 'payments' | 'reconciliation' | 'tracking' | 'admin';
  estimatedMinutes: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRecurring: boolean;
}

export interface TaskAssignment {
  id: string;
  taskId: string;
  employeeId: string;
  assignedBy: string;
  assignedAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  notes: string;
  actualMinutes?: number;
  date: string; // YYYY-MM-DD format
}

export interface PerformanceMetric {
  employeeId: string;
  employeeName: string;
  totalTasks: number;
  completedTasks: number;
  averageCompletionTime: number;
  efficiencyScore: number; // Based on actual vs estimated time
  onTimeRate: number; // Percentage of tasks completed on time
  qualityScore: number; // Based on notes and feedback
}

export interface DailyReport {
  date: string;
  assignments: TaskAssignment[];
  summary: {
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    averageCompletionTime: number;
  };
  employeeMetrics: PerformanceMetric[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'team_leader' | 'employee';
  employeeId?: string; // Only for employee users
  avatar?: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
  };
  lastLogin: Date;
  createdAt: Date;
}