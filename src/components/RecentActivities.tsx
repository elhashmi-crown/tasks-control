import React from 'react';
import { Activity, Clock, CheckCircle, PlayCircle, PauseCircle, User } from 'lucide-react';
import { TaskAssignment, Task, Employee } from '../types';
import { formatTime, formatDate } from '../utils/dateUtils';

interface RecentActivitiesProps {
  assignments: TaskAssignment[];
  tasks: Task[];
  employees: Employee[];
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ assignments, tasks, employees }) => {
  const today = formatDate(new Date());
  
  // Get recent activities (last 10 status changes)
  const recentActivities = assignments
    .filter(a => a.date === today)
    .map(assignment => {
      const task = tasks.find(t => t.id === assignment.taskId);
      const employee = employees.find(e => e.id === assignment.employeeId);
      
      const activities = [];
      
      if (assignment.startedAt) {
        activities.push({
          id: `${assignment.id}-started`,
          type: 'started',
          timestamp: new Date(assignment.startedAt),
          assignment,
          task,
          employee
        });
      }
      
      if (assignment.completedAt) {
        activities.push({
          id: `${assignment.id}-completed`,
          type: 'completed',
          timestamp: new Date(assignment.completedAt),
          assignment,
          task,
          employee
        });
      }
      
      return activities;
    })
    .flat()
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 10);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'started':
        return <PlayCircle className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'paused':
        return <PauseCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityText = (activity: any) => {
    const employeeName = activity.employee?.name || 'Unknown Employee';
    const taskName = activity.task?.name || 'Unknown Task';
    
    switch (activity.type) {
      case 'started':
        return `${employeeName} started "${taskName}"`;
      case 'completed':
        return `${employeeName} completed "${taskName}"`;
      case 'paused':
        return `${employeeName} paused "${taskName}"`;
      default:
        return `${employeeName} updated "${taskName}"`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {recentActivities.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No recent activities today</p>
          </div>
        ) : (
          recentActivities.map(activity => (
            <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 mt-0.5">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {getActivityText(activity)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatTime(activity.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};