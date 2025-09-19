import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Clock, AlertTriangle } from 'lucide-react';
import { Task } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface TaskManagementProps {
  tasks: Task[];
  onUpdateTasks: (tasks: Task[]) => void;
}

export const TaskManagement: React.FC<TaskManagementProps> = ({ tasks, onUpdateTasks }) => {
  const [categories] = useLocalStorage('hospitality_categories', [
    { id: 'cat-1', name: 'reservations', description: 'Hotel booking and reservation management', color: 'blue', isActive: true },
    { id: 'cat-2', name: 'payments', description: 'Payment processing and financial transactions', color: 'green', isActive: true },
    { id: 'cat-3', name: 'reconciliation', description: 'Financial reconciliation and auditing', color: 'purple', isActive: true },
    { id: 'cat-4', name: 'tracking', description: 'Occupancy and performance tracking', color: 'yellow', isActive: true },
    { id: 'cat-5', name: 'admin', description: 'Administrative and general tasks', color: 'gray', isActive: true }
  ]);
  
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Task>>({
    name: '',
    description: '',
    category: 'admin', 
    estimatedMinutes: 30,
    priority: 'medium',
    isRecurring: true
  });

  const activeCategories = categories.filter((cat: any) => cat.isActive);

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
  ];

  const handleSaveTask = () => {
    if (!formData.name || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    const taskData: Task = {
      id: editingTask || `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name!,
      description: formData.description!,
      category: formData.category as Task['category'],
      estimatedMinutes: formData.estimatedMinutes || 30,
      priority: formData.priority as Task['priority'],
      isRecurring: formData.isRecurring || false
    };

    if (editingTask) {
      // Update existing task
      const updatedTasks = tasks.map(task => 
        task.id === editingTask ? taskData : task
      );
      onUpdateTasks(updatedTasks);
    } else {
      // Add new task
      onUpdateTasks([...tasks, taskData]);
    }

    resetForm();
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task.id);
    setFormData(task);
    setIsAddingTask(true);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      onUpdateTasks(updatedTasks);
    }
  };

  const resetForm = () => {
    setIsAddingTask(false);
    setEditingTask(null);
    setFormData({
      name: '',
      description: '',
      category: 'admin',
      estimatedMinutes: 30,
      priority: 'medium',
      isRecurring: true
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'reservations': return 'bg-blue-100 text-blue-800';
      case 'payments': return 'bg-green-100 text-green-800';
      case 'reconciliation': return 'bg-purple-100 text-purple-800';
      case 'tracking': return 'bg-yellow-100 text-yellow-800';
      case 'admin': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Tasks</h2>
          <p className="text-gray-600">
            Add, edit, and organize tasks for your team. Total tasks: {tasks.length}
          </p>
        </div>
        <button
          onClick={() => setIsAddingTask(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Task
        </button>
      </div>

      {/* Add/Edit Task Form */}
      {isAddingTask && (
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Name *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter task name"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter task description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category || 'admin'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {activeCategories.map((cat: any) => (
                  <option key={cat.id} value={cat.name.toLowerCase()}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority || 'medium'}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {priorities.map(priority => (
                  <option key={priority.value} value={priority.value}>{priority.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Time (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="480"
                value={formData.estimatedMinutes || 30}
                onChange={(e) => setFormData({ ...formData, estimatedMinutes: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.isRecurring || false}
                  onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Recurring Task
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={resetForm}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveTask}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {editingTask ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Tasks</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Est. Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map(task => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{task.name}</div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">{task.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                      {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority === 'urgent' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <Clock className="w-4 h-4 mr-1 text-gray-400" />
                      {task.estimatedMinutes}m
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      task.isRecurring ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {task.isRecurring ? 'Recurring' : 'One-time'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit task"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {tasks.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="text-gray-400 mb-4">
              <Clock className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Tasks Found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first task.</p>
            <button
              onClick={() => setIsAddingTask(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add First Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};