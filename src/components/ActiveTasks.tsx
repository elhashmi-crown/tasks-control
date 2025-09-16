import React from 'react';
import { PlayCircle, User, Clock, AlertTriangle } from 'lucide-react';
import { TaskAssignment, Task, Employee } from '../types';
import { formatTime, formatDuration, isOverdue } from '../utils/dateUtils';

interface ActiveTasksProps {
  assignments: TaskAssignment[];
  tasks: Task[];
  employees: Employee[];
}

export const ActiveTasks: React.FC<ActiveTasksProps> = ({ assignments, tasks, employees }) => {
  const activeTasks = assignments.filter(a => a.status === 'in_progress');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-blue-600 bg-blue-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getElapsedTime = (startedAt: Date) => {
    const now = new Date();
    const elapsed = Math.floor((now.getTime() - startedAt.getTime()) / (1000 * 60));
    return formatDuration(elapsed);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <PlayCircle className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Active Tasks</h2>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
          {activeTasks.length} running
        </span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activeTasks.length === 0 ? (
          <div className="text-center py-8">
            <PlayCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No tasks currently in progress</p>
          </div>
        ) : (
          activeTasks.map(assignment => {
            const task = tasks.find(t => t.id === assignment.taskId);
            const employee = employees.find(e => e.id === assignment.employeeId);
            const taskOverdue = isOverdue(assignment);
            
            if (!task || !employee) return null;

            return (
              <div key={assignment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{task.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>{employee.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                    {taskOverdue && (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        OVERDUE
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>Started: {assignment.startedAt ? formatTime(new Date(assignment.startedAt)) : 'N/A'}</span>
                    </div>
                    <div className="text-blue-600 font-medium">
                      Running: {assignment.startedAt ? getElapsedTime(new Date(assignment.startedAt)) : 'N/A'}
                    </div>
                  </div>
                  <div className="text-gray-500">
                    Est: {formatDuration(task.estimatedMinutes)}
                  </div>
                </div>

                {assignment.notes && (
                  <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-gray-700">
                    <strong>Notes:</strong> {assignment.notes}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};