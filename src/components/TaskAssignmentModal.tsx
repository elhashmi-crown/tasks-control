import React, { useState } from 'react';
import { X, User, Calendar, Clock } from 'lucide-react';
import { Task, Employee } from '../types';

interface TaskAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  employees: Employee[];
  onAssign: (taskId: string, employeeId: string) => void;
}

export const TaskAssignmentModal: React.FC<TaskAssignmentModalProps> = ({
  isOpen,
  onClose,
  task,
  employees,
  onAssign
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState('');

  if (!isOpen || !task) return null;

  const handleAssign = () => {
    if (selectedEmployee) {
      onAssign(task.id, selectedEmployee);
      setSelectedEmployee('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Assign Task</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
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
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Assign to Employee
            </label>
            <div className="space-y-2">
              {employees.filter(emp => emp.isActive).map(employee => (
                <label
                  key={employee.id}
                  className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="radio"
                    name="employee"
                    value={employee.id}
                    checked={selectedEmployee === employee.id}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">{employee.name}</div>
                      <div className="text-sm text-gray-500">{employee.role}</div>
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