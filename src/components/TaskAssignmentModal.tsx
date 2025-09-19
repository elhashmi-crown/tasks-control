import React, { useState, useEffect } from 'react';
import { X, User, Clock, AlertTriangle } from 'lucide-react';
import { Task, Employee, TaskAssignment } from '../types';

interface TaskAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (taskId: string, employeeId: string) => void;
  tasks: Task[];
  employees: Employee[];
  assignments: TaskAssignment[];
}

export const TaskAssignmentModal: React.FC<TaskAssignmentModalProps> = ({
  isOpen,
  onClose,
  onAssign,
  tasks,
  employees,
  assignments
}) => {
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [showAllEmployees, setShowAllEmployees] = useState(false);

  // Get unassigned tasks
  const unassignedTasks = tasks.filter(task => 
    !assignments.some(assignment => {
      const today = new Date().toISOString().split('T')[0];
      return assignment.taskId === task.id && 
             assignment.date === today && 
             assignment.status !== 'completed';
    })
  );

  // Get employee availability
  const getEmployeeStatus = (employeeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const activeAssignments = assignments.filter(assignment => 
      assignment.employeeId === employeeId && 
      assignment.date === today &&
      (assignment.status === 'in_progress' || assignment.status === 'not_started')
    );
    return activeAssignments.length >= 3 ? 'busy' : 'available'; // Allow multiple tasks per employee
  };

  // Get available employees (not busy) or all employees if showAllEmployees is true
  const availableEmployees = showAllEmployees 
    ? employees 
    : employees.filter(employee => getEmployeeStatus(employee.id) === 'available');

  const handleAssign = () => {
    if (selectedTask && selectedEmployee) {
      onAssign(selectedTask, selectedEmployee);
      setSelectedTask('');
      setSelectedEmployee('');
      onClose();
    }
  };

  const resetForm = () => {
    setSelectedTask('');
    setSelectedEmployee('');
    setShowAllEmployees(false);
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Assign Task</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Task Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Task ({unassignedTasks.length} unassigned)
            </label>
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a task...</option>
              {unassignedTasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.name} ({task.priority} priority)
                </option>
              ))}
            </select>
          </div>

          {/* Employee Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Employee ({availableEmployees.length} available)
              </label>
              <button
                onClick={() => setShowAllEmployees(!showAllEmployees)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {showAllEmployees ? 'Show available only' : 'Show all employees'}
              </button>
            </div>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose an employee...</option>
              {availableEmployees.map((employee) => {
                const status = getEmployeeStatus(employee.id);
                return (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} - {employee.department} ({status})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Employee Status Legend */}
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-xs text-gray-600 mb-2">Employee Status:</div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Busy</span>
              </div>
            </div>
          </div>

          {/* Warning for busy employee */}
          {selectedEmployee && getEmployeeStatus(selectedEmployee) === 'busy' && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                This employee is currently busy with other tasks
              </span>
            </div>
          )}

          {/* Current Assignment Info */}
          {selectedTask && (
            <div className="bg-blue-50 p-3 rounded-md">
              <div className="text-sm text-blue-800">
                <strong>Task Details:</strong>
                {(() => {
                  const task = tasks.find(t => t.id === selectedTask);
                  return task ? (
                    <div className="mt-1">
                      <div>Priority: {task.priority}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>Est. {task.estimatedMinutes} minutes</span>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedTask || !selectedEmployee}
            className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Assign Task
          </button>
        </div>
      </div>
    </div>
  );
};