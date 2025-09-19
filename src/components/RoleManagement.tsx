import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Briefcase } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Role {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

const defaultRoles: Role[] = [
  { id: 'role-1', name: 'Senior Revenue Analyst', description: 'Analyzes revenue data and trends', isActive: true },
  { id: 'role-2', name: 'Reservations Specialist', description: 'Manages hotel reservations and bookings', isActive: true },
  { id: 'role-3', name: 'Payments Coordinator', description: 'Handles payment processing and reconciliation', isActive: true },
  { id: 'role-4', name: 'Occupancy Analyst', description: 'Tracks and analyzes occupancy rates', isActive: true },
  { id: 'role-5', name: 'Reconciliation Specialist', description: 'Performs financial reconciliation tasks', isActive: true },
  { id: 'role-6', name: 'Revenue Manager', description: 'Oversees revenue management strategies', isActive: true },
  { id: 'role-7', name: 'Guest Services Coordinator', description: 'Coordinates guest services and satisfaction', isActive: true },
  { id: 'role-8', name: 'Financial Analyst', description: 'Analyzes financial performance and metrics', isActive: true },
  { id: 'role-9', name: 'Operations Specialist', description: 'Manages daily operational tasks', isActive: true },
  { id: 'role-10', name: 'Administrative Assistant', description: 'Provides administrative support', isActive: true }
];

export const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useLocalStorage<Role[]>('hospitality_roles', defaultRoles);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Role>>({
    name: '',
    description: '',
    isActive: true
  });

  const handleSaveRole = () => {
    if (!formData.name?.trim()) {
      alert('Please enter a role name');
      return;
    }

    const roleData: Role = {
      id: editingRole || `role-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name.trim(),
      description: formData.description?.trim() || '',
      isActive: formData.isActive ?? true
    };

    if (editingRole) {
      setRoles(prev => prev.map(role => role.id === editingRole ? roleData : role));
    } else {
      setRoles(prev => [...prev, roleData]);
    }

    resetForm();
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role.id);
    setFormData(role);
    setIsAddingRole(true);
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;

    if (confirm(`Are you sure you want to delete "${role.name}"? This action cannot be undone.`)) {
      setRoles(prev => prev.filter(r => r.id !== roleId));
    }
  };

  const handleToggleActive = (roleId: string) => {
    setRoles(prev => prev.map(role =>
      role.id === roleId ? { ...role, isActive: !role.isActive } : role
    ));
  };

  const resetForm = () => {
    setIsAddingRole(false);
    setEditingRole(null);
    setFormData({
      name: '',
      description: '',
      isActive: true
    });
  };

  const activeRoles = roles.filter(role => role.isActive);
  const inactiveRoles = roles.filter(role => !role.isActive);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Roles & Positions</h2>
          <p className="text-gray-600">
            Add, edit, and manage employee roles and positions. Total roles: {roles.length} ({activeRoles.length} active)
          </p>
        </div>
        <button
          onClick={() => setIsAddingRole(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Role
        </button>
      </div>

      {/* Add/Edit Role Form */}
      {isAddingRole && (
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingRole ? 'Edit Role' : 'Add New Role'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role Name *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter role name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter role description"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.isActive ?? true}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Active Role
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
              onClick={handleSaveRole}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {editingRole ? 'Update Role' : 'Add Role'}
            </button>
          </div>
        </div>
      )}

      {/* Active Roles */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">Active Roles ({activeRoles.length})</h3>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
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
              {activeRoles.map(role => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{role.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                    {role.description || 'No description'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditRole(role)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit role"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(role.id)}
                        className="text-yellow-600 hover:text-yellow-800 transition-colors"
                        title="Deactivate role"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRole(role.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete role"
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

        {activeRoles.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="text-gray-400 mb-4">
              <Briefcase className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Roles</h3>
            <p className="text-gray-600 mb-4">Add your first role to get started.</p>
            <button
              onClick={() => setIsAddingRole(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add First Role
            </button>
          </div>
        )}
      </div>

      {/* Inactive Roles */}
      {inactiveRoles.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <X className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Inactive Roles ({inactiveRoles.length})</h3>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
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
                {inactiveRoles.map(role => (
                  <tr key={role.id} className="hover:bg-gray-50 opacity-75">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <Briefcase className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="text-sm font-medium text-gray-700">{role.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                      {role.description || 'No description'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditRole(role)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit role"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(role.id)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="Reactivate role"
                        >
                          <Briefcase className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete role"
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