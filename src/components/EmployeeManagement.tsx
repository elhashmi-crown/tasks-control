import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, User, UserCheck, UserX } from 'lucide-react';
import { Employee } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface EmployeeManagementProps {
  employees: Employee[];
  onUpdateEmployees: (employees: Employee[]) => void;
}

export const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ employees, onUpdateEmployees }) => {
  const [roles] = useLocalStorage('hospitality_roles', []);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: '',
    role: '',
    isActive: true,
    email: '',
    phone: '',
    temporaryPassword: ''
  });

  const activeRoles = roles.filter((role: any) => role.isActive);

  const handleSaveEmployee = () => {
    if (!formData.name?.trim() || !formData.role?.trim() || !formData.email?.trim()) {
      alert('Please fill in all required fields (Name, Role, Email)');
      return;
    }

    // Generate temporary password if not provided
    const tempPassword = formData.temporaryPassword?.trim() || 
      `temp${Math.random().toString(36).substr(2, 6)}`;

    const employeeData: Employee = {
      id: editingEmployee || `emp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name.trim(),
      role: formData.role.trim(),
      isActive: formData.isActive ?? true,
      email: formData.email.trim(),
      phone: formData.phone?.trim() || '',
      temporaryPassword: tempPassword
    };

    if (editingEmployee) {
      // Update existing employee
      const updatedEmployees = employees.map(employee => 
        employee.id === editingEmployee ? employeeData : employee
      );
      onUpdateEmployees(updatedEmployees);
    } else {
      // Add new employee
      onUpdateEmployees([...employees, employeeData]);
    }

    resetForm();
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee.id);
    setFormData(employee);
    setIsAddingEmployee(true);
  };

  const handleDeleteEmployee = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return;

    if (confirm(`Are you sure you want to delete ${employee.name}? This action cannot be undone and will affect historical data.`)) {
      const updatedEmployees = employees.filter(emp => emp.id !== employeeId);
      onUpdateEmployees(updatedEmployees);
    }
  };

  const handleToggleActive = (employeeId: string) => {
    const updatedEmployees = employees.map(employee =>
      employee.id === employeeId
        ? { ...employee, isActive: !employee.isActive }
        : employee
    );
    onUpdateEmployees(updatedEmployees);
  };

  const resetForm = () => {
    setIsAddingEmployee(false);
    setEditingEmployee(null);
    setFormData({
      name: '',
      role: '',
      isActive: true,
      email: '',
      phone: '',
      temporaryPassword: ''
    });
  };

  const activeEmployees = employees.filter(emp => emp.isActive);
  const inactiveEmployees = employees.filter(emp => !emp.isActive);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Employees</h2>
          <p className="text-gray-600">
            Add, edit, and manage your team members. Total employees: {employees.length} ({activeEmployees.length} active)
          </p>
        </div>
        <button
          onClick={() => setIsAddingEmployee(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Employee
        </button>
      </div>

      {/* Add/Edit Employee Form */}
      {isAddingEmployee && (
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter employee full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter employee email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role/Position *
              </label>
              <select
                value={formData.role || ''}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a role</option>
                {activeRoles.map((role: any) => (
                  <option key={role.id} value={role.name}>{role.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temporary Password
              </label>
              <input
                type="text"
                value={formData.temporaryPassword || ''}
                onChange={(e) => setFormData({ ...formData, temporaryPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Auto-generated if empty"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate</p>
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.isActive ?? true}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Active Employee
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
              onClick={handleSaveEmployee}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {editingEmployee ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </div>
      )}

      {/* Active Employees */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">Active Employees ({activeEmployees.length})</h3>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role/Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Temp Password
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeEmployees.map(employee => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-xs text-gray-500">{employee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div>
                      <div>{employee.email}</div>
                      <div className="text-xs text-gray-500">{employee.phone || 'No phone'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{employee.role}</td>
                  <td className="px-6 py-4">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {employee.temporaryPassword || 'Not set'}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditEmployee(employee)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit employee"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(employee.id)}
                        className="text-yellow-600 hover:text-yellow-800 transition-colors"
                        title="Deactivate employee"
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete employee"
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

        {activeEmployees.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="text-gray-400 mb-4">
              <UserCheck className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Employees</h3>
            <p className="text-gray-600 mb-4">Add your first team member to get started.</p>
            <button
              onClick={() => setIsAddingEmployee(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add First Employee
            </button>
          </div>
        )}
      </div>

      {/* Inactive Employees */}
      {inactiveEmployees.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <UserX className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Inactive Employees ({inactiveEmployees.length})</h3>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role/Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inactiveEmployees.map(employee => (
                  <tr key={employee.id} className="hover:bg-gray-50 opacity-75">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="text-sm font-medium text-gray-700">{employee.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{employee.role}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditEmployee(employee)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit employee"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(employee.id)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="Reactivate employee"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(employee.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete employee"
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
        </div>
      )}
    </div>
  );
};