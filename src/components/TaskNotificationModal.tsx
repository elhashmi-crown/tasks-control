import React, { useState } from 'react';
import { X, Send, Clock, AlertTriangle, User, MessageSquare, MessageCircle } from 'lucide-react';
import { Task, Employee } from '../types';

interface TaskNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  employee: Employee | null;
  onSendNotification: (taskId: string, employeeId: string, message: string, priority: 'normal' | 'urgent') => void;
  onSendWhatsApp?: (taskId: string, employeeId: string, message: string, priority: 'normal' | 'urgent') => void;
}

export const TaskNotificationModal: React.FC<TaskNotificationModalProps> = ({
  isOpen,
  onClose,
  task,
  employee,
  onSendNotification,
  onSendWhatsApp
}) => {
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const messageTemplates = [
    {
      id: 'reminder',
      label: 'Gentle Reminder',
      message: 'Hi! Just a friendly reminder about your assigned task. Please let me know if you need any assistance or have questions.',
      priority: 'normal' as const
    },
    {
      id: 'urgent',
      label: 'Urgent Request',
      message: 'This task requires immediate attention. Please prioritize this and update me on your progress as soon as possible.',
      priority: 'urgent' as const
    },
    {
      id: 'deadline',
      label: 'Deadline Approaching',
      message: 'The deadline for this task is approaching. Please ensure completion by the scheduled time or let me know if you need support.',
      priority: 'urgent' as const
    },
    {
      id: 'support',
      label: 'Offer Support',
      message: 'I noticed this task has been in progress for a while. Do you need any additional resources or assistance to complete it?',
      priority: 'normal' as const
    }
  ];

  if (!isOpen || !task || !employee) return null;

  const handleSend = () => {
    if (!message.trim()) {
      alert('Please enter a message');
      return;
    }

    onSendNotification(task.id, employee.id, message, priority);
    setMessage('');
    setSelectedTemplate('');
    setPriority('normal');
    onClose();
  };

  const handleSendWhatsApp = () => {
    if (!message.trim()) {
      alert('Please enter a message');
      return;
    }

    onSendWhatsApp?.(task.id, employee.id, message, priority);
  };

  const handleTemplateSelect = (template: typeof messageTemplates[0]) => {
    setSelectedTemplate(template.id);
    setMessage(template.message);
    setPriority(template.priority);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Send Task Notification</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Task and Employee Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Task</span>
                </div>
                <p className="font-semibold text-gray-900">{task.name}</p>
                <p className="text-sm text-gray-600">{task.description}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Employee</span>
                </div>
                <p className="font-semibold text-gray-900">{employee.name}</p>
                <p className="text-sm text-gray-600">{employee.role}</p>
              </div>
            </div>
          </div>

          {/* Message Templates */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Quick Templates (Optional)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {messageTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-3 text-left border rounded-lg transition-colors ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {template.priority === 'urgent' && (
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                    )}
                    <span className="font-medium text-gray-900">{template.label}</span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{template.message}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Priority Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Priority Level
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="priority"
                  value="normal"
                  checked={priority === 'normal'}
                  onChange={(e) => setPriority(e.target.value as 'normal' | 'urgent')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Normal</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="priority"
                  value="urgent"
                  checked={priority === 'urgent'}
                  onChange={(e) => setPriority(e.target.value as 'normal' | 'urgent')}
                  className="mr-2"
                />
                <div className="flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-700">Urgent</span>
                </div>
              </label>
            </div>
          </div>

          {/* Custom Message */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Type your message here..."
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                {message.length}/500 characters
              </span>
              {priority === 'urgent' && (
                <div className="flex items-center gap-1 text-xs text-orange-600">
                  <AlertTriangle className="w-3 h-3" />
                  This will be sent as an urgent notification
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            
            {onSendWhatsApp && (
              <button
                onClick={handleSendWhatsApp}
                disabled={!message.trim()}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <MessageCircle className="w-4 h-4" />
                Send via WhatsApp
              </button>
            )}
            
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
                priority === 'urgent'
                  ? 'bg-orange-600 hover:bg-orange-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              } disabled:bg-gray-300 disabled:cursor-not-allowed`}
            >
              <Send className="w-4 h-4" />
              Send Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};