import React, { useState } from 'react';
import { X, User, Calendar, Clock, AlertTriangle, UserX } from 'lucide-react';
import { Task, Employee } from '../types';

interface TaskAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  employees: Employee[];
  assignedTasks: string[];
  onAssign: (taskId: string, employeeId: string) => void;
  onUnassign?: (taskId: string) => void;
  onReassign?: (taskId: string, newEmployeeId: string) => void;
  currentAssignment?: { employeeId: string; employeeName: string } | null;
}

export const TaskAssignmentModal: React.FC<TaskAssignmentModalProps> = ({
  isOpen,
  onClose,
  task,
  employees,
  assignedTasks,
  onAssign
  onUnassign,
  onReassign,
  currentAssignment
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [showUnassignedOnly, setShowUnassignedOnly] = useState(true);

  if (!isOpen || !task) return null;

  const availableEmployees = employees.filter(emp => emp.isActive);
  const isTaskAssigned = currentAssignment !== null;
  const isReassigning = isTaskAssigned && selectedEmployee && selectedEmployee !== currentAssignment?.employeeId;

  const handleAssign = () => {
    if (selectedEmployee) {
      if (isTaskAssigned && onReassign) {
        onReassign(task.id, selectedEmployee);
      } else {
        onAssign(task.id, selectedEmployee);
      }
      setSelectedEmployee('');
      onClose();
    }
  };

  const handleUnassign = () => {
    if (onUnassign && isTaskAssigned) {
      onUnassign(task.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {isTaskAssigned ? 'Reassign Task' : 'Assign Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Current Assignment Info */}
          {isTaskAssigned && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Currently assigned to: {currentAssignment?.employeeName}</span>
              </div>
            </div>
          )}

          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">{task.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{task.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Est. {task.estimatedMinutes}min</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span className={`font-medium ${
                  task.priority === 'urgent' ? 'text-red-600' :
                  task.priority === 'high' ? 'text-orange-600' :
                  task.priority === 'medium' ? 'text-blue-600' :
                  'text-green-600'
                }`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            {!isTaskAssigned && (
              <div className="mb-3">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={showUnassignedOnly}
                    onChange={(e) => setShowUnassignedOnly(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Show only employees without current tasks
                </label>
              </div>
            )}
            
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {isTaskAssigned ? 'Reassign to Employee' : 'Assign to Employee'}
            </label>
            <div className="space-y-2">
              {availableEmployees
                .filter(employee => {
                  if (isTaskAssigned) return true; // Show all when reassigning
                  if (!showUnassignedOnly) return true; // Show all if checkbox unchecked
                  // Show only employees without current tasks
                  return !assignedTasks.includes(employee.id);
                })
                .map(employee => {
                  const hasCurrentTask = assignedTasks.includes(employee.id);
                  const isCurrentAssignee = employee.id === currentAssignment?.employeeId;
                  
                  return (
                    <label
                      key={employee.id}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        isCurrentAssignee ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="employee"
                        value={employee.id}
                        checked={selectedEmployee === employee.id}
                        onChange={(e) => setSelectedEmployee(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex items-center gap-2 flex-1">
                        <User className="w-4 h-4 text-gray-400" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.role}</div>
                        </div>
                        {hasCurrentTask && !isCurrentAssignee && (
                          <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                            <AlertTriangle className="w-3 h-3" />
                            Busy
                          </div>
                        )}
                        {isCurrentAssignee && (
                          <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                            Current
                          </div>
                        )}
                      </div>
                    </label>
                  );
                })}
            </div>
            
            {availableEmployees.filter(employee => {
              if (isTaskAssigned) return true;
              if (!showUnassignedOnly) return true;
              return !assignedTasks.includes(employee.id);
            }).length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <User className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No available employees found</p>
                {!isTaskAssigned && showUnassignedOnly && (
                  <button
                    onClick={() => setShowUnassignedOnly(false)}
                    className="text-blue-600 hover:text-blue-800 text-sm mt-1"
                  >
                    Show all employees
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            
            {isTaskAssigned && onUnassign && (
              <button
                onClick={handleUnassign}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
              >
                <UserX className="w-4 h-4" />
                Unassign
              </button>
            )}
            
            <button
              onClick={handleAssign}
              disabled={!selectedEmployee}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isTaskAssigned ? 'Reassign Task' : 'Assign Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={!selectedEmployee}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Assign Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};