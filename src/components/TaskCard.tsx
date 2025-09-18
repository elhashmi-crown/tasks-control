import React from 'react';
import { Clock, User, PlayCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { TaskAssignment, Task, Employee } from '../types';
import { formatTime, formatDuration, isOverdue } from '../utils/dateUtils';

interface TaskCardProps {
  assignment: TaskAssignment;
  task: Task;
  employee: Employee | null;
  isLeaderView?: boolean;
  onStartTask?: (assignmentId: string) => void;
  onCompleteTask?: (assignmentId: string, notes: string) => void;
  onPauseTask?: (assignmentId: string) => void;
  onUpdateNotes?: (assignmentId: string, notes: string) => void;
  onSendNotification?: (taskId: string, employeeId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  assignment,
  task,
  employee,
  isLeaderView = false,
  onStartTask,
  onCompleteTask,
  onPauseTask,
  onUpdateNotes
  onSendNotification
}) => {
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'urgent': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-blue-500 bg-blue-50';
      case 'low': return 'border-green-500 bg-green-50';
    }
  };

  const getStatusIcon = () => {
    switch (assignment.status) {
      case 'not_started':
        return <Clock className="w-5 h-5 text-gray-500" />;
      case 'in_progress':
        return <PlayCircle className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'paused':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const handleCompleteTask = () => {
    const notes = prompt('Add completion notes (optional):') || '';
    onCompleteTask?.(assignment.id, notes);
  };

  const isTaskOverdue = isOverdue(assignment);

  return (
    <div className={`rounded-lg border-2 p-4 shadow-sm transition-all hover:shadow-md ${getPriorityColor()} ${
      isTaskOverdue ? 'ring-2 ring-red-300' : ''
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            assignment.status === 'not_started' ? 'bg-gray-100 text-gray-700' :
            assignment.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
            assignment.status === 'completed' ? 'bg-green-100 text-green-700' :
            assignment.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
            task.priority === 'urgent' ? 'bg-red-100 text-red-700' :
            task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
            task.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
            'bg-green-100 text-green-700'
          }`}>
            {assignment.status.replace('_', ' ').toUpperCase()}
          </span>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            task.priority === 'urgent' ? 'bg-red-100 text-red-700' :
            task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
            task.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
            'bg-green-100 text-green-700'
          }`}>
            {task.priority.toUpperCase()}
          </span>
          {isTaskOverdue && (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-700">
              OVERDUE
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500">
          Est. {formatDuration(task.estimatedMinutes)}
        </span>
      </div>

      <h3 className="font-semibold text-gray-900 mb-2">{task.name}</h3>
      <p className="text-sm text-gray-600 mb-3">{task.description}</p>

      <div className="flex items-center gap-2 mb-3">
        <User className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-700">
          {employee?.name || 'Unassigned'}
        </span>
      </div>

      {assignment.startedAt && (
        <div className="text-xs text-gray-500 mb-2">
          Started: {formatTime(new Date(assignment.startedAt))}
        </div>
      )}

      {assignment.completedAt && assignment.actualMinutes && (
        <div className="text-xs text-green-600 mb-2">
          Completed in {formatDuration(assignment.actualMinutes)}
        </div>
      )}

      {!isLeaderView && (
        <div className="flex gap-2">
          {assignment.status === 'not_started' && (
            <button
              onClick={() => onStartTask?.(assignment.id)}
              className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Start Task
            </button>
          )}
          
          {assignment.status === 'in_progress' && (
            <>
              <button
                onClick={handleCompleteTask}
                className="flex-1 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
              >
                Complete
              </button>
              <button
                onClick={() => onPauseTask?.(assignment.id)}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-yellow-100 rounded-md hover:bg-yellow-200 transition-colors"
              >
                Pause
              </button>
            </>
          )}
          
          {assignment.status === 'paused' && (
            <button
              onClick={() => onStartTask?.(assignment.id)}
              className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Resume
            </button>
          )}
        </div>
      )}

      {isLeaderView && employee && assignment.status !== 'completed' && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <button
            onClick={() => onSendNotification?.(task.id, employee.id)}
            className="w-full px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
          >
            Send Notification
          </button>
        </div>
      )}

      {assignment.notes && (
        <div className="mt-3 p-2 bg-white bg-opacity-50 rounded text-xs text-gray-700">
          <strong>Notes:</strong> {assignment.notes}
        </div>
      )}
    </div>
  );
};