import React from 'react';
import { Users, Clock, CheckCircle, AlertTriangle, PlayCircle, PauseCircle } from 'lucide-react';
import { TaskAssignment, Employee } from '../types';
import { formatDate } from '../utils/dateUtils';

interface TeamStatusOverviewProps {
  assignments: TaskAssignment[];
  employees: Employee[];
}

export const TeamStatusOverview: React.FC<TeamStatusOverviewProps> = ({ assignments, employees }) => {
  const today = formatDate(new Date());
  const todaysAssignments = assignments.filter(a => a.date === today);
  const activeEmployees = employees.filter(emp => emp.isActive);

  const statusCounts = {
    not_started: todaysAssignments.filter(a => a.status === 'not_started').length,
    in_progress: todaysAssignments.filter(a => a.status === 'in_progress').length,
    completed: todaysAssignments.filter(a => a.status === 'completed').length,
    paused: todaysAssignments.filter(a => a.status === 'paused').length
  };

  const completionRate = todaysAssignments.length > 0 
    ? Math.round((statusCounts.completed / todaysAssignments.length) * 100) 
    : 0;

  const employeesWorking = new Set(
    todaysAssignments
      .filter(a => a.status === 'in_progress')
      .map(a => a.employeeId)
  ).size;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Team Status Overview</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Not Started</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{statusCounts.not_started}</div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <PlayCircle className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">In Progress</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{statusCounts.in_progress}</div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-600">Completed</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{statusCounts.completed}</div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <PauseCircle className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-600">Paused</span>
          </div>
          <div className="text-2xl font-bold text-yellow-600">{statusCounts.paused}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-indigo-600 mb-1">Team Completion Rate</div>
          <div className="text-2xl font-bold text-indigo-900 mb-2">{completionRate}%</div>
          <div className="w-full bg-indigo-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(completionRate, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-purple-600 mb-1">Active Employees</div>
          <div className="text-2xl font-bold text-purple-900">{employeesWorking}/{activeEmployees.length}</div>
          <div className="text-xs text-purple-600">Currently working</div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-orange-600 mb-1">Total Tasks Today</div>
          <div className="text-2xl font-bold text-orange-900">{todaysAssignments.length}</div>
          <div className="text-xs text-orange-600">Assigned tasks</div>
        </div>
      </div>
    </div>
  );
};